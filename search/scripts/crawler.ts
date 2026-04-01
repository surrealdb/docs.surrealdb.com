// ══════════════════════════════════════════════════════════
// Content crawler
//
// Walks every markdown file in src/content/, parses it into
// an AST, and emits two kinds of entries:
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
import { type AnyNode, type BlockNode, parseMarkdown, type Root, visit } from "@surrealdb/ui";
import matter from "gray-matter";
import {
    abstractDoc,
    type DocCollection,
    docCollections,
    urlForCollection,
    versionedSdks,
} from "../../src/content/config";
import type { CrawledEntry, CrawledPage, CrawledSection } from "../src/types";

const CONTENT_DIR = join(import.meta.dirname, "../../src/content");

interface CategoryMeta {
    sidebar_label: string;
    sidebar_position: number;
}

// Versioned SDK collections (e.g. "doc-sdk-javascript-1x") are
// skipped because only the latest version should be indexed.
const VERSIONED_COLLECTION_IDS = new Set(
    Object.entries(versionedSdks).flatMap(([sdk, config]) =>
        config ? config.versions.map((v) => `doc-sdk-${sdk}-${v.replace(".", "")}`) : [],
    ),
);

// ──────────────────────────────────────────────────────────
// Filesystem helpers
// ──────────────────────────────────────────────────────────

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
 * Loads _category_.json files from a collection directory tree.
 * These provide sidebar labels used to build breadcrumbs
 * (e.g. "SurrealQL > Statements > SELECT"). The root category
 * is keyed by "" and subdirectory categories by their relative
 * path (e.g. "statements", "statements/define").
 */
async function loadCategoryMap(collectionDir: string): Promise<Map<string, CategoryMeta>> {
    const categories = new Map<string, CategoryMeta>();

    try {
        const raw = await readFile(join(collectionDir, "_category_.json"), "utf-8");
        categories.set("", JSON.parse(raw) as CategoryMeta);
    } catch {
        // no root _category_.json
    }

    async function scan(dir: string) {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const subdir = join(dir, entry.name);
            const catPath = join(subdir, "_category_.json");

            try {
                const raw = await readFile(catPath, "utf-8");
                const meta = JSON.parse(raw) as CategoryMeta;
                const relPath = relative(collectionDir, subdir);
                categories.set(relPath, meta);
            } catch {
                // no _category_.json in this dir
            }

            await scan(subdir);
        }
    }

    await scan(collectionDir);
    return categories;
}

// ──────────────────────────────────────────────────────────
// AST → plain text extraction
//
// We walk the markdown AST to extract readable text, skipping
// HTML nodes and JSX components (which are UI-only and would
// pollute search content). Code blocks are also skipped in the
// section-level extraction.
// ──────────────────────────────────────────────────────────

const SKIP_TYPES = new Set(["html", "mdxJsxTextElement", "mdxJsxFlowElement", "jsxComponent"]);

function stripHtmlTags(text: string): string {
    return text.replace(/<[^>]+>/g, " ");
}

/** Extracts readable text from a single AST node, skipping HTML/JSX. */
function extractText(node: AnyNode | Root): string {
    if (SKIP_TYPES.has(node.type)) {
        return "";
    }

    if ("value" in node && typeof node.value === "string") {
        return stripHtmlTags(node.value);
    }

    if ("children" in node && Array.isArray(node.children)) {
        const joined = (node.children as (AnyNode | Root)[]).map(extractText).join(" ");
        return stripHtmlTags(joined).replace(/\s+/g, " ").trim();
    }

    return "";
}

/**
 * Converts block-level AST nodes to plain text. Collects text
 * and inline code values but skips fenced code blocks entirely
 * — code examples add noise to search without semantic value.
 *
 * Each block node (paragraph, list item, etc.) is processed
 * separately and joined with newlines so that text from
 * adjacent blocks doesn't run together (e.g. a heading
 * followed by a paragraph won't produce "SELECT statementThe
 * SELECT statement can be used...").
 */
function blockNodesToPlainText(nodes: BlockNode[]): string {
    const blocks: string[] = [];

    for (const node of nodes) {
        const parts: string[] = [];

        visit({ type: "root", children: [node] } as Root, (child) => {
            switch (child.type) {
                case "text":
                    parts.push(child.value);
                    break;
                case "inlineCode":
                    parts.push(child.value);
                    break;
                case "code":
                    // Skip fenced code blocks
                    return false;
            }
        });

        const text = parts.join("").trim();
        if (text) blocks.push(text);
    }

    return blocks
        .join("\n\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function astToPlainText(ast: Root): string {
    return blockNodesToPlainText(ast.children);
}

// ──────────────────────────────────────────────────────────
// Section splitting
//
// Pages are split at H2 boundaries so each major section can
// be indexed and deep-linked independently. Content before
// the first H2 is only captured at the page level. Only H2
// headings are used (not H3+) to keep sections at a useful
// granularity.
// ──────────────────────────────────────────────────────────

function splitAtHeadings(
    ast: Root,
): { heading: BlockNode & { type: "heading" }; nodes: BlockNode[] }[] {
    const sections: {
        heading: BlockNode & { type: "heading" };
        nodes: BlockNode[];
    }[] = [];
    let current: {
        heading: BlockNode & { type: "heading" };
        nodes: BlockNode[];
    } | null = null;

    for (const node of ast.children) {
        if (node.type === "heading" && node.depth === 2) {
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
// Breadcrumbs are built from _category_.json sidebar labels
// and the page title, producing strings like:
//   "SurrealQL > Statements > DEFINE > TABLE"
//
// URLs are built from the collection's URL prefix (defined in
// src/content/config.ts) and the file's slug:
//   collection "doc-surrealql" + slug "statements/select"
//   → "/docs/surrealql/statements/select"
// ──────────────────────────────────────────────────────────

function buildBreadcrumb(
    collection: DocCollection,
    slug: string,
    categories: Map<string, CategoryMeta>,
    pageLabel: string,
): string {
    const rootLabel = categories.get("")?.sidebar_label ?? collection;
    const parts: string[] = [rootLabel];

    // Walk each segment of the slug to pick up intermediate
    // category labels (e.g. slug "statements/define/table"
    // checks "statements" then "statements/define").
    const slugParts = slug.split("/").filter(Boolean);

    for (let i = 1; i <= slugParts.length; i++) {
        const dirPath = slugParts.slice(0, i).join("/");
        const cat = categories.get(dirPath);

        if (cat) {
            parts.push(cat.sidebar_label);
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

function buildUrl(collection: DocCollection, slug: string): string {
    const base = urlForCollection[collection as keyof typeof urlForCollection];
    const segments = ["/docs", base, slug].filter(Boolean);
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

/**
 * SHA-256 hash used for incremental indexing — if the hash
 * hasn't changed since last index, we skip re-embedding and
 * re-upserting the record to save OpenAI API calls.
 */
function contentHash(...parts: string[]): string {
    const hash = createHash("sha256");
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
    for (const collection of docCollections) {
        // Skip versioned SDK collections (e.g. 1.x docs) — only
        // the latest version is indexed.
        if (VERSIONED_COLLECTION_IDS.has(collection)) continue;

        const collectionDir = join(CONTENT_DIR, collection);

        let dirExists = true;
        try {
            await readdir(collectionDir);
        } catch {
            dirExists = false;
        }

        if (!dirExists) continue;

        const categories = await loadCategoryMap(collectionDir);

        for await (const filePath of walkMarkdown(collectionDir)) {
            const raw = await readFile(filePath, "utf-8");
            const { data: frontmatter, content: body } = matter(raw);
            const parsed = abstractDoc.parse(frontmatter);

            const slug = buildSlug(filePath, collectionDir);
            const ast = parseMarkdown(body);
            const pageUrl = buildUrl(collection, slug);
            const pageLabel = parsed.sidebar_label ?? parsed.title ?? slug.split("/").pop() ?? "";
            const breadcrumb = buildBreadcrumb(collection, slug, categories, pageLabel);
            const pageContent = astToPlainText(ast);
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
            const sections = splitAtHeadings(ast);
            const deduplicateAnchor = createAnchorDeduplicator();

            for (const section of sections) {
                const sectionTitle = extractText(section.heading);
                const anchor = deduplicateAnchor(sectionTitle);
                const sectionContent = blockNodesToPlainText(section.nodes);
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
