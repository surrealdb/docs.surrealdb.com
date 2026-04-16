// ══════════════════════════════════════════════════════════
// Incremental search indexer
//
// Runs after a docs build to sync the SurrealDB search index
// with the current content. The process:
//
//   1. Fetch content hashes for all existing records
//   2. Crawl all markdown files and compare hashes
//   3. Embed and upsert only changed entries (saves OpenAI $)
//   4. Delete records for pages/sections that no longer exist
//
// This makes repeated runs fast — only new or modified content
// triggers an embedding API call.
// ══════════════════════════════════════════════════════════

import { RecordId, type Surreal } from "surrealdb";
import { connectDb } from "../src/db";
import { buildEmbedText, embedBatch } from "../src/embed";
import type { CrawledEntry, CrawledPage, CrawledSection } from "../src/types";
import { crawl } from "./crawler";

// OpenAI's batch embedding endpoint accepts up to ~2048 texts,
// but we chunk at 64 to keep individual requests manageable
// and avoid timeouts.
const EMBED_BATCH_SIZE = 64;

// Number of concurrent UPSERT queries against SurrealDB.
// Higher = faster indexing but more DB load.
const UPSERT_CONCURRENCY = 8;

interface HashRow {
    id: RecordId;
    content_hash: string;
}

interface ExistingRecord {
    contentHash: string;
    rid: RecordId;
}

/** Loads the content_hash for every existing page and section so
 *  we can detect which entries have changed and need re-embedding. */
async function fetchExistingRecords(db: Surreal): Promise<Map<string, ExistingRecord>> {
    const records = new Map<string, ExistingRecord>();

    const [pages, sections] = await db
        .query<[HashRow[], HashRow[]]>(
            "SELECT id, content_hash FROM page; SELECT id, content_hash FROM section;",
        )
        .collect();

    for (const row of pages) {
        records.set(row.id.toString(), { contentHash: row.content_hash, rid: row.id });
    }

    for (const row of sections) {
        records.set(row.id.toString(), { contentHash: row.content_hash, rid: row.id });
    }

    return records;
}

function pageRecordId(entry: CrawledPage): RecordId {
    return new RecordId("page", entry.id);
}

function sectionRecordId(entry: CrawledSection): RecordId {
    return new RecordId("section", entry.id);
}

function recordIdString(entry: CrawledEntry): string {
    const rid = entry.kind === "page" ? pageRecordId(entry) : sectionRecordId(entry);
    return rid.toString();
}

async function upsertPage(db: Surreal, entry: CrawledPage, embedding: number[]) {
    const id = pageRecordId(entry);

    await db
        .query(
            `UPSERT $id MERGE {
                path: $path,
                collection: $collection,
                title: $title,
                description: $description,
                breadcrumb: $breadcrumb,
                content: $content,
                content_hash: $content_hash,
                embedding: $embedding,
                date: time::now(),
            };`,
            {
                id,
                path: entry.path,
                collection: entry.collection,
                title: entry.title,
                description: entry.description,
                breadcrumb: entry.breadcrumb,
                content: entry.content,
                content_hash: entry.contentHash,
                embedding,
            },
        )
        .collect();
}

async function upsertSection(db: Surreal, entry: CrawledSection, embedding: number[]) {
    const id = sectionRecordId(entry);
    const pageRef = new RecordId("page", entry.pageId);

    await db
        .query(
            `UPSERT $id MERGE {
                page: $page,
                anchor: $anchor,
                depth: $depth,
                title: $title,
                breadcrumb: $breadcrumb,
                content: $content,
                content_hash: $content_hash,
                embedding: $embedding,
                date: time::now(),
            };`,
            {
                id,
                page: pageRef,
                anchor: entry.anchor,
                depth: entry.depth,
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
    const db = await connectDb({ logging: true });

    // Phase 1: Load existing records so we can skip unchanged content.
    console.log("[IX] Fetching existing content hashes...");
    const existingRecords = await fetchExistingRecords(db);
    console.log(`[IX] Found ${existingRecords.size} existing records`);

    const seenIds = new Set<string>();
    const changed: CrawledEntry[] = [];
    const stats = {
        pagesUnchanged: 0,
        pagesUpdated: 0,
        sectionsUnchanged: 0,
        sectionsUpdated: 0,
        pagesDeleted: 0,
        sectionsDeleted: 0,
    };

    // Phase 2: Crawl all content and identify what changed.
    console.log("[CW] Crawling content...");

    for await (const entry of crawl()) {
        const rid = recordIdString(entry);
        seenIds.add(rid);

        const existing = existingRecords.get(rid);

        // Content hash matches — skip re-embedding to save API cost.
        if (existing?.contentHash === entry.contentHash) {
            if (entry.kind === "page") stats.pagesUnchanged++;
            else stats.sectionsUnchanged++;
            continue;
        }

        changed.push(entry);
    }

    console.log(`[CW] Crawl complete. ${changed.length} entries to embed and upsert.`);

    // Phase 3: Embed changed entries in batches, then upsert.
    const texts = changed.map(buildEmbedText);

    for (let batchStart = 0; batchStart < changed.length; batchStart += EMBED_BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + EMBED_BATCH_SIZE, changed.length);
        const batchTexts = texts.slice(batchStart, batchEnd);
        const batchEntries = changed.slice(batchStart, batchEnd);

        console.log(`[EM] Embedding batch ${batchStart + 1}..${batchEnd} of ${changed.length}`);
        const embeddings = await embedBatch(batchTexts);

        const pairs = batchEntries.map((entry, i) => ({
            entry,
            embedding: embeddings[i],
        }));

        await runConcurrent(pairs, UPSERT_CONCURRENCY, async ({ entry, embedding }, localIdx) => {
            if (entry.kind === "page") {
                await upsertPage(db, entry, embedding);
                stats.pagesUpdated++;
            } else {
                await upsertSection(db, entry, embedding);
                stats.sectionsUpdated++;
            }

            const globalIdx = batchStart + localIdx + 1;
            console.log(`[IX] ${globalIdx}/${changed.length} ${entry.kind} ${entry.id}`);
        });
    }

    // Phase 4: Clean up records whose source files no longer exist.
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
