// ══════════════════════════════════════════════════════════
// Pure crawl logic
//
// Transforms a single collection entry (already parsed and
// validated by vike-content-collection) into one Page record
// plus one Section record per H2 heading.
//
// All filesystem walking, frontmatter parsing, and collection
// discovery is handled upstream by vike-content-collection.
// This module is only responsible for:
//
//   • Parsing markdown → AST → plain text
//   • Splitting at H2 boundaries
//   • Computing URLs and breadcrumbs
//   • Hashing for incremental indexing
//
// Code blocks are deliberately excluded from plain text
// because they add a lot of noise to both BM25 and embeddings
// (variable names, syntax tokens, etc.) without much semantic
// value for search.
// ══════════════════════════════════════════════════════════

import { createHash } from "node:crypto";
// `@surrealdb/ui` is imported for its TYPES only at module level. The
// runtime functions (`parseMarkdown`, `visit`) are dynamically imported
// inside `createCrawler()` below. The package eagerly imports `.webp`
// assets from its bundle, which Vite's config loader (pure Node) cannot
// resolve. Keeping it out of this module's top-level means esbuild won't
// produce a bundled `import "@surrealdb/ui"` during config loading.
import type { AnyNode, BlockNode, Root } from "@surrealdb/ui";
import type { CrawledEntry, CrawledPage, CrawledSection } from "../src/types";

/** Minimal shape we need from a vike-content-collection entry. */
export interface CollectionEntry {
    slug: string;
    content: string;
    metadata: {
        title?: string;
        description?: string;
        sidebar_label?: string;
    };
}

/**
 * Look up a sibling collection entry by slug. Used to resolve
 * `__category` metadata when building breadcrumbs.
 */
export type LookupEntry = (slug: string) => CollectionEntry | undefined;

// ──────────────────────────────────────────────────────────
// AST → plain text extraction
//
// We walk the markdown AST to extract readable text, skipping
// HTML nodes and JSX components (which are UI-only and would
// pollute search content). Code blocks are also skipped in the
// section-level extraction.
// ──────────────────────────────────────────────────────────

const SKIP_TYPES = new Set(["html", "mdxJsxTextElement", "mdxJsxFlowElement", "jsxComponent"]);

type VisitFn = typeof import("@surrealdb/ui").visit;
type ParseMarkdownFn = typeof import("@surrealdb/ui").parseMarkdown;

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
function blockNodesToPlainText(nodes: BlockNode[], visit: VisitFn): string {
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

function astToPlainText(ast: Root, visit: VisitFn): string {
    return blockNodesToPlainText(ast.children, visit);
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

interface Section {
    heading: BlockNode & { type: "heading" };
    nodes: BlockNode[];
}

function splitAtHeadings(ast: Root): Section[] {
    const sections: Section[] = [];
    let current: Section | null = null;

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
// Breadcrumb and URL construction
//
// Breadcrumbs combine three pieces:
//
//   1. The collection ID, split into Title-Cased segments
//      (e.g. "reference/query-language" → "Reference > Query
//      Language"). The "index" collection is treated as
//      unprefixed so root-level pages don't read as
//      "Index > …".
//   2. Each subdirectory's `__category` entry title, looked
//      up via `vike-content-collection`. This is the same
//      mechanism the runtime layout uses
//      (`src/utils/data.ts`), so search breadcrumbs match the
//      sidebar verbatim.
//   3. The page title from frontmatter (or the last slug
//      segment as a fallback).
//
// Example for collection "reference/query-language" / slug
// "statements/select" / title "SELECT":
//
//   Reference > Query Language > Statements > SELECT
// ──────────────────────────────────────────────────────────

function titleCaseSegment(segment: string): string {
    return segment
        .split("-")
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join(" ");
}

function buildBreadcrumb(
    collectionId: string,
    slug: string,
    pageTitle: string,
    lookup: LookupEntry,
): string {
    const parts: string[] = [];

    if (collectionId !== "index") {
        for (const segment of collectionId.split("/")) {
            parts.push(titleCaseSegment(segment));
        }
    }

    // Walk every slug segment, pushing a category title where
    // a `<dir>/__category` entry exists. Matches the runtime
    // breadcrumb logic in `src/utils/data.ts`.
    const slugSegments = slug.split("/").filter(Boolean);
    const cur: string[] = [];

    for (const segment of slugSegments) {
        cur.push(segment);
        const categoryEntry = lookup(`${cur.join("/")}/__category`);

        if (categoryEntry) {
            const label =
                categoryEntry.metadata.sidebar_label ??
                categoryEntry.metadata.title ??
                titleCaseSegment(segment);
            parts.push(label);
        }
    }

    if (pageTitle && parts[parts.length - 1] !== pageTitle) {
        parts.push(pageTitle);
    }

    return parts.join(" > ");
}

function buildUrl(collectionId: string, slug: string): string {
    const prefix = collectionId === "index" ? "" : collectionId;
    return ["/docs", prefix, slug].filter(Boolean).join("/");
}

// ──────────────────────────────────────────────────────────
// Main per-entry crawl
//
// Yields one Page record plus one Section record per H2
// heading. The generator pattern keeps memory low because
// callers can stream entries instead of buffering them all
// at once.
//
// `createCrawler()` is an async factory that resolves the
// `@surrealdb/ui` module (via dynamic import) and returns a
// synchronous generator function bound to its `parseMarkdown`
// and `visit` exports. Keeping the dynamic import out of
// module-load scope is what makes this file safe to import
// from `vite.config.ts` — see the note at the top.
// ──────────────────────────────────────────────────────────

export type CrawlEntryFn = (
    collectionId: string,
    entry: CollectionEntry,
    lookup: LookupEntry,
) => Generator<CrawledEntry>;

export async function createCrawler(): Promise<CrawlEntryFn> {
    const ui = await import("@surrealdb/ui");
    const parseMarkdown: ParseMarkdownFn = ui.parseMarkdown;
    const visit: VisitFn = ui.visit;

    return function* crawlEntry(collectionId, entry, lookup) {
        const ast = parseMarkdown(entry.content);

        const pageLabel =
            entry.metadata.sidebar_label ??
            entry.metadata.title ??
            entry.slug.split("/").pop() ??
            "";
        const description = entry.metadata.description ?? "";
        const breadcrumb = buildBreadcrumb(collectionId, entry.slug, pageLabel, lookup);
        const pageUrl = buildUrl(collectionId, entry.slug);
        const pageContent = astToPlainText(ast, visit);

        // Page IDs use the format "collection:slug" which maps
        // directly to a SurrealDB record ID.
        const pageId = `${collectionId}:${entry.slug || "index"}`;

        yield {
            kind: "page",
            id: pageId,
            collection: collectionId,
            path: pageUrl,
            url: pageUrl,
            title: pageLabel,
            description,
            breadcrumb,
            content: pageContent,
            contentHash: contentHash(pageLabel, breadcrumb, description, pageContent),
        } satisfies CrawledPage;

        const sections = splitAtHeadings(ast);
        const deduplicateAnchor = createAnchorDeduplicator();

        for (const section of sections) {
            const sectionTitle = extractText(section.heading);
            const anchor = deduplicateAnchor(sectionTitle);
            const sectionContent = blockNodesToPlainText(section.nodes, visit);
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
    };
}
