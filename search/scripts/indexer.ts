// ══════════════════════════════════════════════════════════
// Incremental search indexer
//
// Syncs the SurrealDB search index with the compiled content index
// that plugins/vite-search-index.ts emits during the Vite build:
//
//   1. Read generated/search-index.json
//   2. Fetch content hashes for all existing records
//   3. Embed and upsert only changed entries (saves OpenAI $)
//   4. Delete records for pages/sections that no longer exist
//
// Repeated runs are fast — only new or modified content triggers an
// embedding API call.
//
// The indexer does not read src/content. Everything about a document
// (its URL, breadcrumb, ranking kind, sections) is decided by the
// build step from the site's own content collections, so search can
// never disagree with the rendered pages about what exists or where
// it lives.
// ══════════════════════════════════════════════════════════

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { RecordId, type Surreal } from "surrealdb";
import { connectDb } from "../src/db";
import { buildEmbedText, embedBatch } from "../src/embed";
import type { CompiledSearchIndex, IndexedDocument } from "../src/types";

// OpenAI's batch embedding endpoint accepts up to ~2048 texts,
// but we chunk at 64 to keep individual requests manageable
// and avoid timeouts.
const EMBED_BATCH_SIZE = 64;

// Number of concurrent UPSERT queries against SurrealDB.
// Higher = faster indexing but more DB load.
const UPSERT_CONCURRENCY = 8;

const INDEX_PATH = join(import.meta.dirname, "../../generated/search-index.json");

// Version token mixed into every content hash. Bump it whenever the
// indexed text changes shape (embedding model, truncation length, embed
// text structure, breadcrumb format) so the incremental indexer treats
// existing records as changed and re-embeds them once. "c8000" = 8000-char
// content limit (see EMBED_CONTENT_LIMIT in search/src/embed.ts).
//
// v3: documents come from the compiled content index, which changed every
// breadcrumb and restored section extraction.
const EMBED_VERSION = "v3-c8000";

interface HashRow {
    id: RecordId;
    content_hash: string;
}

interface ExistingRecord {
    contentHash: string;
    rid: RecordId;
}

/**
 * A page or section flattened into the unit the indexer works with:
 * one embedding, one record, one content hash.
 */
interface Entry {
    kind: "page" | "section";
    /** Record id key, e.g. "reference/python:api/values/table#constructor". */
    id: string;
    document: IndexedDocument;
    title: string;
    breadcrumb: string;
    content: string;
    contentHash: string;
    /** Set for sections only. */
    anchor?: string;
}

function contentHash(...parts: string[]): string {
    const hash = createHash("sha256");
    hash.update(EMBED_VERSION);
    for (const part of parts) hash.update(part);
    return hash.digest("hex");
}

/** Record id key for a document: "<collection>:<slug>", with the root slug named. */
function documentKey(document: IndexedDocument): string {
    return `${document.collection}:${document.slug || "index"}`;
}

/**
 * Flattens the compiled index into page and section entries. Sections
 * whose heading produced no prose (a heading followed only by a code
 * block) are already absent from the artefact.
 */
function toEntries(documents: IndexedDocument[]): Entry[] {
    const entries: Entry[] = [];

    for (const document of documents) {
        const key = documentKey(document);

        entries.push({
            kind: "page",
            id: key,
            document,
            title: document.title,
            breadcrumb: document.breadcrumb,
            content: document.content,
            contentHash: contentHash(
                document.title,
                document.breadcrumb,
                document.description,
                document.content,
            ),
        });

        for (const section of document.sections) {
            const breadcrumb = `${document.breadcrumb} > ${section.title}`;

            entries.push({
                kind: "section",
                id: `${key}#${section.anchor}`,
                document,
                anchor: section.anchor,
                title: section.title,
                breadcrumb,
                content: section.content,
                contentHash: contentHash(section.title, breadcrumb, section.content),
            });
        }
    }

    return entries;
}

/** Loads the compiled content index, explaining how to produce it if absent. */
async function loadCompiledIndex(): Promise<IndexedDocument[]> {
    let raw: string;

    try {
        raw = await readFile(INDEX_PATH, "utf-8");
    } catch {
        throw new Error(
            `No compiled search index at ${INDEX_PATH}. It is written by the ` +
                "viteSearchIndex plugin on any Vite run, so build the site " +
                "(`bun run build`) or start it (`bun run dev`) first.",
        );
    }

    const { documents } = JSON.parse(raw) as CompiledSearchIndex;

    if (!Array.isArray(documents) || documents.length === 0) {
        throw new Error(`Compiled search index at ${INDEX_PATH} contains no documents.`);
    }

    return documents;
}

/** Loads the content_hash for every existing page and section so we can
 *  detect which entries have changed and need re-embedding. */
async function fetchExistingRecords(db: Surreal): Promise<Map<string, ExistingRecord>> {
    const records = new Map<string, ExistingRecord>();

    const [pages, sections] = await db
        .query<[HashRow[], HashRow[]]>(
            "SELECT id, content_hash FROM page; SELECT id, content_hash FROM section;",
        )
        .collect();

    for (const row of [...pages, ...sections]) {
        records.set(row.id.toString(), { contentHash: row.content_hash, rid: row.id });
    }

    return records;
}

function recordIdFor(entry: Entry): RecordId {
    return new RecordId(entry.kind, entry.id);
}

async function upsertPage(db: Surreal, entry: Entry, embedding: number[]) {
    const { document } = entry;

    // `$language ?? NONE`: only SDK pages have a language. NULL and NONE
    // are distinct values in SurrealDB and the field is `option<string>`,
    // which accepts only NONE — so the absent case is coerced in the
    // query rather than depending on how the client serialises it.
    await db
        .query(
            `UPSERT $id MERGE {
                path: $path,
                collection: $collection,
                slug: $slug,
                doc_kind: $doc_kind,
                language: $language ?? NONE,
                product: $product,
                title: $title,
                description: $description,
                breadcrumb: $breadcrumb,
                content: $content,
                content_hash: $content_hash,
                embedding: $embedding,
                date: time::now(),
            };`,
            {
                id: recordIdFor(entry),
                path: document.path,
                collection: document.collection,
                slug: document.slug,
                doc_kind: document.kind,
                language: document.language ?? null,
                product: document.product,
                title: entry.title,
                description: document.description,
                breadcrumb: entry.breadcrumb,
                content: entry.content,
                content_hash: entry.contentHash,
                embedding,
            },
        )
        .collect();
}

async function upsertSection(db: Surreal, entry: Entry, embedding: number[]) {
    await db
        .query(
            `UPSERT $id MERGE {
                page: $page,
                anchor: $anchor,
                depth: 2,
                title: $title,
                breadcrumb: $breadcrumb,
                content: $content,
                content_hash: $content_hash,
                embedding: $embedding,
                date: time::now(),
            };`,
            {
                id: recordIdFor(entry),
                page: new RecordId("page", documentKey(entry.document)),
                anchor: entry.anchor,
                title: entry.title,
                breadcrumb: entry.breadcrumb,
                content: entry.content,
                content_hash: entry.contentHash,
                embedding,
            },
        )
        .collect();
}

/** Bulk-deletes records that no longer have corresponding
 *  content files (e.g. a page was removed or renamed). */
async function deleteStaleRecords(db: Surreal, table: string, staleRids: RecordId[]) {
    if (staleRids.length === 0) return;

    await db
        .query(`DELETE FROM type::table($table) WHERE id IN $ids;`, {
            table,
            ids: staleRids,
        })
        .collect();
}

/** Simple concurrency limiter for parallel upserts. */
async function runConcurrent<T>(
    items: T[],
    concurrency: number,
    fn: (item: T, index: number) => Promise<void>,
): Promise<void> {
    let next = 0;

    async function worker() {
        while (next < items.length) {
            const idx = next++;
            await fn(items[idx], idx);
        }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
}

export async function runIndexer() {
    const documents = await loadCompiledIndex();
    const entries = toEntries(documents);

    console.log(
        `[IX] Compiled index: ${documents.length} pages, ${entries.length - documents.length} sections`,
    );

    const db = await connectDb({ logging: true });

    // Phase 1: Load existing records so we can skip unchanged content.
    console.log("[IX] Fetching existing content hashes...");
    const existingRecords = await fetchExistingRecords(db);
    console.log(`[IX] Found ${existingRecords.size} existing records`);

    const seenIds = new Set<string>();
    const changed: Entry[] = [];
    const stats = {
        pagesUnchanged: 0,
        pagesUpdated: 0,
        sectionsUnchanged: 0,
        sectionsUpdated: 0,
        pagesDeleted: 0,
        sectionsDeleted: 0,
    };

    // Phase 2: Compare hashes to identify what changed.
    for (const entry of entries) {
        const rid = recordIdFor(entry).toString();
        seenIds.add(rid);

        // Content hash matches — skip re-embedding to save API cost.
        if (existingRecords.get(rid)?.contentHash === entry.contentHash) {
            if (entry.kind === "page") stats.pagesUnchanged++;
            else stats.sectionsUnchanged++;
            continue;
        }

        changed.push(entry);
    }

    console.log(`[IX] ${changed.length} entries to embed and upsert.`);

    // Phase 3: Embed changed entries in batches, then upsert.
    const texts = changed.map(buildEmbedText);

    for (let batchStart = 0; batchStart < changed.length; batchStart += EMBED_BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + EMBED_BATCH_SIZE, changed.length);
        const batchTexts = texts.slice(batchStart, batchEnd);
        const batchEntries = changed.slice(batchStart, batchEnd);

        console.log(`[EM] Embedding batch ${batchStart + 1}..${batchEnd} of ${changed.length}`);
        const embeddings = await embedBatch(batchTexts);

        const pairs = batchEntries.map((entry, i) => ({ entry, embedding: embeddings[i] }));

        await runConcurrent(pairs, UPSERT_CONCURRENCY, async ({ entry, embedding }) => {
            if (entry.kind === "page") {
                await upsertPage(db, entry, embedding);
                stats.pagesUpdated++;
            } else {
                await upsertSection(db, entry, embedding);
                stats.sectionsUpdated++;
            }
        });
    }

    // Phase 4: Clean up records whose source content no longer exists.
    const stalePages: RecordId[] = [];
    const staleSections: RecordId[] = [];

    for (const [rid, record] of existingRecords) {
        if (seenIds.has(rid)) continue;

        if (rid.startsWith("page:")) {
            stalePages.push(record.rid);
        } else if (rid.startsWith("section:")) {
            staleSections.push(record.rid);
        }
    }

    if (stalePages.length > 0) {
        await deleteStaleRecords(db, "page", stalePages);
        stats.pagesDeleted = stalePages.length;
        console.log(`[IX] Deleted ${stalePages.length} stale page(s)`);
    }

    if (staleSections.length > 0) {
        await deleteStaleRecords(db, "section", staleSections);
        stats.sectionsDeleted = staleSections.length;
        console.log(`[IX] Deleted ${staleSections.length} stale section(s)`);
    }

    console.log("[IX] Indexing complete:");
    console.log(
        `     Pages:    ${stats.pagesUpdated} updated, ${stats.pagesUnchanged} unchanged, ${stats.pagesDeleted} deleted`,
    );
    console.log(
        `     Sections: ${stats.sectionsUpdated} updated, ${stats.sectionsUnchanged} unchanged, ${stats.sectionsDeleted} deleted`,
    );

    await db.close();
}
