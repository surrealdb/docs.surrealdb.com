// ══════════════════════════════════════════════════════════
// Content crawler
//
// Walks every markdown file in src/content/, parses it into
// a Lezer syntax tree, and emits two kinds of entries:
//
//   • Page  — one per file, with the full plain-text content
//   • Section — one per H2 heading, with the text between
//     that heading and the next H2
//
// These entries are consumed by the indexer which computes
// embeddings and upserts them into SurrealDB.
//
// Code blocks are deliberately excluded from plain text
// because they add a lot of noise to both BM25 and embeddings
// (variable names, syntax tokens, etc.) without much semantic
// value for search.
// ══════════════════════════════════════════════════════════

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import {
    extractHeadings,
    type MarkdownSource,
    markdownSourceFromString,
    parseMarkdownTree,
} from "@surrealdb/ui";
import matter from "gray-matter";
import type { CrawledEntry, CrawledPage, CrawledSection } from "../src/types";

type MarkdownNode = NonNullable<ReturnType<typeof parseMarkdownTree>["topNode"]["firstChild"]>;

const CONTENT_DIR = join(import.meta.dirname, "../../src/content");

// A content collection is any directory under src/content/ that
// contains a +Content.ts file (the vike-content-collection marker).
// The collection id is its path relative to src/content/, e.g.
// "learn/security" or "reference/query-language".
const COLLECTION_MARKER = "+Content.ts";

// Collections excluded from search indexing. "labs-items" uses a
// different schema (labSchema) and is rendered as a listing rather
// than as doc pages, so it has no per-entry doc URLs to index.
const EXCLUDED_COLLECTIONS = new Set<string>(["labs-items"]);

// URL prefix overrides. A page's URL is derived as
// `/docs/<prefix>/<slug>`, where the prefix defaults to the
// collection id — mirroring `resolveDataFromCollection` in
// src/utils/data.ts, where `prefix = urlPrefix ?? id`. The entries
// below override that default and must stay in sync with the
// `urlPrefix` argument passed in each collection's +data.ts.
const URL_PREFIX_OVERRIDES: Record<string, string> = {
    // Served from the docs root (/docs/<slug>).
    index: "",
    // Served from /docs/spectron rather than /docs/spectron/index.
    "spectron/index": "spectron",
};

/** The site is served under a `/docs` base path (see vite.config.ts). */
const URL_BASE = "/docs";

interface CategoryMeta {
    title: string;
    position: number;
}

/** Frontmatter fields the crawler needs. Full validation happens at
 *  build time via the collection's `pageSchema`, so we read loosely. */
interface PageFrontmatter {
    title?: string;
    description?: string;
}

// ──────────────────────────────────────────────────────────
// Filesystem helpers
// ──────────────────────────────────────────────────────────

/**
 * Discovers all content collections by walking src/content/ for
 * directories containing a +Content.ts marker. Collections never
 * nest inside one another, so recursion stops once a marker is
 * found. Excluded collections are filtered out.
 */
async function discoverCollections(): Promise<string[]> {
    const collections: string[] = [];

    async function scan(dir: string) {
        const entries = await readdir(dir, { withFileTypes: true });

        if (entries.some((e) => e.isFile() && e.name === COLLECTION_MARKER)) {
            const id = relative(CONTENT_DIR, dir);
            if (!EXCLUDED_COLLECTIONS.has(id)) collections.push(id);
            return;
        }

        for (const entry of entries) {
            if (entry.isDirectory()) {
                await scan(join(dir, entry.name));
            }
        }
    }

    await scan(CONTENT_DIR);
    return collections.sort();
}

/** Recursively yields all .md and .mdx file paths in a directory. */
async function* walkMarkdown(dir: string): AsyncGenerator<string> {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const full = join(dir, entry.name);

        if (entry.isDirectory()) {
            yield* walkMarkdown(full);
        } else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))) {
            yield full;
        }
    }
}

/**
 * Loads __category.json files from a collection directory tree.
 * These provide sidebar labels used to build breadcrumbs
 * (e.g. "SurrealQL > Statements > SELECT"). The root category
 * is keyed by "" and subdirectory categories by their relative
 * path (e.g. "statements", "statements/define").
 */
async function loadCategoryMap(collectionDir: string): Promise<Map<string, CategoryMeta>> {
    const categories = new Map<string, CategoryMeta>();

    try {
        const raw = await readFile(join(collectionDir, "__category.json"), "utf-8");
        categories.set("", JSON.parse(raw) as CategoryMeta);
    } catch {
        // no root __category.json
    }

    async function scan(dir: string) {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const subdir = join(dir, entry.name);
            const catPath = join(subdir, "__category.json");

            try {
                const raw = await readFile(catPath, "utf-8");
                const meta = JSON.parse(raw) as CategoryMeta;
                const relPath = relative(collectionDir, subdir);
                categories.set(relPath, meta);
            } catch {
                // no __category.json in this dir
            }

            await scan(subdir);
        }
    }

    await scan(collectionDir);
    return categories;
}

// ──────────────────────────────────────────────────────────
// Syntax tree → plain text extraction
//
// We walk the markdown tree to extract readable text, skipping
// HTML/JSX blocks (UI-only) and fenced code blocks.
// ──────────────────────────────────────────────────────────

const SKIP_MARKS = new Set([
    "EmphasisMark",
    "StrikethroughMark",
    "CodeMark",
    "LinkMark",
    "URL",
    "LinkTitle",
    "LinkLabel",
    "HeaderMark",
    "HardBreak",
    "Comment",
]);

function headingLevel(name: string): number {
    if (name.startsWith("ATXHeading")) {
        const lvl = Number.parseInt(name.slice("ATXHeading".length), 10);
        return Number.isFinite(lvl) ? lvl : 0;
    }
    if (name.startsWith("SetextHeading")) {
        const lvl = Number.parseInt(name.slice("SetextHeading".length), 10);
        return Number.isFinite(lvl) ? lvl : 0;
    }
    return 0;
}

function readTagName(node: MarkdownNode, source: MarkdownSource): string | null {
    const text = source.slice(node.from, node.to).trim();
    const match = /^<\/?([A-Za-z][\w-]*)/.exec(text);
    return match?.[1] ?? null;
}

function isJsxNode(node: MarkdownNode, source: MarkdownSource): boolean {
    if (node.name !== "HTMLTag" && node.name !== "SelfClosingTag") return false;
    const tag = readTagName(node, source);
    return tag ? /^[A-Z]/.test(tag) : false;
}

function shouldSkipNode(node: MarkdownNode, source: MarkdownSource): boolean {
    if (node.name === "FencedCode" || node.name === "HTMLBlock") return true;
    return isJsxNode(node, source);
}

function collectPlainText(node: MarkdownNode, source: MarkdownSource): string {
    const parts: string[] = [];

    function walk(current: MarkdownNode): void {
        if (shouldSkipNode(current, source)) return;

        if (current.name === "Text" || current.name === "Escape") {
            parts.push(source.slice(current.from, current.to));
            return;
        }

        if (SKIP_MARKS.has(current.name)) return;

        if (current.name === "InlineCode") {
            let child = current.firstChild;
            while (child) {
                if (child.name === "CodeText") {
                    parts.push(source.slice(child.from, child.to));
                }
                child = child.nextSibling;
            }
            return;
        }

        let child = current.firstChild;
        while (child) {
            walk(child);
            child = child.nextSibling;
        }
    }

    walk(node);
    return parts.join("").replace(/\s+/g, " ").trim();
}

function blockNodeToPlainText(node: MarkdownNode, source: MarkdownSource): string {
    if (shouldSkipNode(node, source)) return "";
    return collectPlainText(node, source);
}

function documentToPlainText(body: string, source: MarkdownSource): string {
    const blocks: string[] = [];
    let child = parseMarkdownTree(body).topNode.firstChild;

    while (child) {
        const text = blockNodeToPlainText(child, source);
        if (text) blocks.push(text);
        child = child.nextSibling;
    }

    return blocks
        .join("\n\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function getTopLevelBlocks(body: string): MarkdownNode[] {
    const blocks: MarkdownNode[] = [];
    let child = parseMarkdownTree(body).topNode.firstChild;

    while (child) {
        blocks.push(child);
        child = child.nextSibling;
    }

    return blocks;
}

function splitAtHeadings(body: string): { heading: MarkdownNode; nodes: MarkdownNode[] }[] {
    const sections: { heading: MarkdownNode; nodes: MarkdownNode[] }[] = [];
    let current: { heading: MarkdownNode; nodes: MarkdownNode[] } | null = null;

    for (const node of getTopLevelBlocks(body)) {
        if (headingLevel(node.name) === 2) {
            if (current) sections.push(current);
            current = { heading: node, nodes: [] };
        } else if (current) {
            current.nodes.push(node);
        }
    }

    if (current) sections.push(current);
    return sections;
}

// ──────────────────────────────────────────────────────────
// Breadcrumb and URL construction
//
// Breadcrumbs are built from __category.json sidebar labels
// and the page title, producing strings like:
//   "SurrealQL > Statements > DEFINE > TABLE"
//
// URLs are built from the collection's URL prefix (the collection
// id by default, see URL_PREFIX_OVERRIDES) and the file's slug:
//   collection "reference/query-language" + slug "statements/select"
//   → "/docs/reference/query-language/statements/select"
// ──────────────────────────────────────────────────────────

function buildBreadcrumb(
    collection: string,
    slug: string,
    categories: Map<string, CategoryMeta>,
    pageLabel: string,
): string {
    const rootLabel = categories.get("")?.title ?? collection;
    const parts: string[] = [rootLabel];

    // Walk each segment of the slug to pick up intermediate
    // category labels (e.g. slug "statements/define/table"
    // checks "statements" then "statements/define").
    const slugParts = slug.split("/").filter(Boolean);

    for (let i = 1; i <= slugParts.length; i++) {
        const dirPath = slugParts.slice(0, i).join("/");
        const cat = categories.get(dirPath);

        if (cat) {
            parts.push(cat.title);
        }
    }

    if (pageLabel) {
        parts.push(pageLabel);
    }

    return parts.join(" > ");
}

function buildSlug(filePath: string, collectionDir: string): string {
    let slug = relative(collectionDir, filePath).replace(/\.mdx?$/, "");

    if (slug.endsWith("/index")) {
        slug = slug.slice(0, -"/index".length);
    }

    // The root index file maps to an empty slug (collection landing page).
    if (slug === "index") {
        slug = "";
    }

    return slug;
}

function buildUrl(collection: string, slug: string): string {
    const prefix = URL_PREFIX_OVERRIDES[collection] ?? collection;
    const segments = [URL_BASE, prefix, slug].filter(Boolean);
    return segments.join("/");
}

// ──────────────────────────────────────────────────────────
// Anchor generation
//
// Heading text is slugified to produce URL-safe anchors.
// Duplicates within a page get a numeric suffix (e.g.
// "example-usage", "example-usage-1").
// ──────────────────────────────────────────────────────────

function slugifyHeading(text: string): string {
    const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return slug || "section";
}

function createAnchorDeduplicator(): (raw: string) => string {
    const seen = new Map<string, number>();

    return (raw: string) => {
        const base = slugifyHeading(raw);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        return count === 0 ? base : `${base}-${count}`;
    };
}

// Version token mixed into every content hash. Bump it whenever the
// embedding strategy changes (model, content truncation length, embed
// text structure) so the incremental indexer treats all existing
// records as changed and re-embeds them once. "c8000" = 8000-char
// content limit (see EMBED_CONTENT_LIMIT in search/src/embed.ts).
const EMBED_VERSION = "v2-c8000";

/**
 * SHA-256 hash used for incremental indexing — if the hash
 * hasn't changed since last index, we skip re-embedding and
 * re-upserting the record to save OpenAI API calls. EMBED_VERSION
 * is folded in so embedding-strategy changes force a re-index.
 */
function contentHash(...parts: string[]): string {
    const hash = createHash("sha256");
    hash.update(EMBED_VERSION);
    for (const part of parts) hash.update(part);
    return hash.digest("hex");
}

// ──────────────────────────────────────────────────────────
// Main crawl generator
//
// Iterates over all doc collections, parses each markdown
// file, and yields page + section entries. The generator
// pattern keeps memory low since we process one file at a
// time rather than loading everything into an array.
// ──────────────────────────────────────────────────────────

export async function* crawl(): AsyncGenerator<CrawledEntry> {
    const collections = await discoverCollections();

    for (const collection of collections) {
        const collectionDir = join(CONTENT_DIR, collection);
        const categories = await loadCategoryMap(collectionDir);

        for await (const filePath of walkMarkdown(collectionDir)) {
            const raw = await readFile(filePath, "utf-8");
            const { data: frontmatter, content: body } = matter(raw);
            const parsed = frontmatter as PageFrontmatter;

            const slug = buildSlug(filePath, collectionDir);
            const source = markdownSourceFromString(body);
            const tree = parseMarkdownTree(body);
            const pageUrl = buildUrl(collection, slug);
            const pageLabel = parsed.title ?? slug.split("/").pop() ?? "";
            const breadcrumb = buildBreadcrumb(collection, slug, categories, pageLabel);
            const pageContent = documentToPlainText(body, source);
            const description = parsed.description ?? "";
            const title = pageLabel;

            // Page IDs use the format "collection:slug" which maps
            // directly to a SurrealDB record ID.
            const pageId = `${collection}:${slug || "index"}`;

            yield {
                kind: "page",
                id: pageId,
                collection,
                path: pageUrl,
                url: pageUrl,
                title,
                description,
                breadcrumb,
                content: pageContent,
                contentHash: contentHash(title, breadcrumb, description, pageContent),
            } satisfies CrawledPage;

            // Split the page at H2 headings into sections that can
            // be individually searched and deep-linked.
            const sections = splitAtHeadings(body);
            const deduplicateAnchor = createAnchorDeduplicator();
            const headingEntries = extractHeadings(tree, source, { depths: [2] });

            for (const [index, section] of sections.entries()) {
                const sectionTitle =
                    headingEntries[index]?.text ?? collectPlainText(section.heading, source);
                const anchor = deduplicateAnchor(sectionTitle);
                const sectionContent = section.nodes
                    .map((node) => blockNodeToPlainText(node, source))
                    .filter(Boolean)
                    .join("\n\n")
                    .replace(/\n{3,}/g, "\n\n")
                    .trim();
                const sectionBreadcrumb = `${breadcrumb} > ${sectionTitle}`;
                const sectionId = `${pageId}#${anchor}`;

                // Skip sections with no extractable title (e.g. headings
                // that only contained JSX) or no body content.
                if (!sectionTitle.trim() || !sectionContent) continue;

                yield {
                    kind: "section",
                    id: sectionId,
                    pageId,
                    anchor,
                    depth: 2,
                    url: `${pageUrl}#${anchor}`,
                    title: sectionTitle,
                    breadcrumb: sectionBreadcrumb,
                    content: sectionContent,
                    contentHash: contentHash(sectionTitle, sectionBreadcrumb, sectionContent),
                } satisfies CrawledSection;
            }
        }
    }
}
