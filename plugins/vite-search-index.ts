// ══════════════════════════════════════════════════════════
// Search index compiler
//
// Emits the artefacts the docs search package consumes:
//
//   generated/search-index.json   every indexable document
//   generated/search-routes.json  URL prefix → collection metadata
//
// Both are built from the content collections the site already
// loads, so search sees exactly the entries, frontmatter, and
// category metadata the pages do. Previously the search package
// walked src/content itself and re-parsed every markdown file with
// its own AST traversal; that duplicate pipeline silently stopped
// finding H2 headings when the markdown renderer changed, dropping
// section-level results from 7000-odd to 7, and its own copy of the
// URL layout went stale when the SDK docs moved.
//
// This plugin runs after vike-content-collection has populated the
// collection store, and reads it through the package's public API.
// ══════════════════════════════════════════════════════════

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { extractHeadings, getCollection } from "vike-content-collection";
import type { Plugin } from "vite";
import { PRODUCT_ORDER } from "../src/utils/product";
import { COLLECTION_ROUTES } from "../src/utils/routes";
import type { PageSchema, SearchKind } from "../src/utils/schema";

const INDEX_FILE = "generated/search-index.json";
const ROUTES_FILE = "generated/search-routes.json";

/** Slug of the `__category.json` entry describing a collection's own root. */
const ROOT_CATEGORY_SLUG = "__category";
const CATEGORY_SUFFIX = `/${ROOT_CATEGORY_SLUG}`;

export interface SearchRoute {
    /** Collection id, e.g. "reference/python". */
    id: string;
    /** URL prefix the collection is served from, without the base. */
    prefix: string;
    label: string;
    kind: SearchKind;
    /** Canonical SDK language slug. Set only when `kind` is "sdk". */
    language?: string;
    product: string;
}

export interface SearchSection {
    anchor: string;
    title: string;
    content: string;
}

export interface SearchDocument {
    collection: string;
    slug: string;
    /** Full URL path including the base, e.g. "/docs/reference/python/api". */
    path: string;
    title: string;
    description: string;
    breadcrumb: string;
    kind: SearchKind;
    language?: string;
    product: string;
    content: string;
    sections: SearchSection[];
}

// ──────────────────────────────────────────────────────────
// Markdown → plain text
//
// Search indexes prose, not syntax. Code blocks are excluded
// because identifiers and punctuation add a lot of BM25 noise and
// little semantic value, and JSX blocks are presentational.
//
// A line scan rather than an AST walk: it cannot be broken by a
// change of markdown renderer, which is what silently killed
// section extraction before.
// ──────────────────────────────────────────────────────────

const FENCE = /^\s*(`{3,}|~{3,})/;
const HEADING = /^(#{1,6})\s+(.*)$/;
/** A line that is only a JSX/HTML tag, e.g. `<Tabs>` or `<Image src="..." />`. */
const TAG_ONLY_LINE = /^\s*<\/?[A-Za-z][^>]*>\s*$/;
/** Callout markers such as `> [!NOTE]`. */
const CALLOUT_MARKER = /\[!\w+\]/g;

function stripInline(text: string): string {
    return text
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/__([^_]+)__/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/~~([^~]+)~~/g, "$1")
        .replace(/<\/?[A-Za-z][^>]*>/g, " ")
        .replace(CALLOUT_MARKER, "")
        .replace(/\s+/g, " ")
        .trim();
}

/** Strips list bullets, blockquote markers, and table pipes from a line. */
function stripBlockMarkers(line: string): string {
    return line
        .replace(/^\s*>+\s?/, "")
        .replace(/^\s*[-*+]\s+/, "")
        .replace(/^\s*\d+\.\s+/, "")
        .replace(/^\s*\|/, "")
        .replace(/\|\s*$/, "")
        .replace(/\|/g, " ")
        .trim();
}

/** True for a table rule row like `| --- | :--: |`, which carries no text. */
function isTableRule(line: string): boolean {
    return /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line) && line.includes("-");
}

/**
 * Joins accumulated lines into paragraph blocks separated by a blank
 * line. The blank-line separator matters: snippet extraction splits
 * indexed content on it to pick a coherent preview.
 */
function toParagraphs(lines: string[]): string {
    const blocks: string[] = [];
    let current: string[] = [];

    const flush = () => {
        const text = current.join(" ").replace(/\s+/g, " ").trim();
        if (text) blocks.push(text);
        current = [];
    };

    for (const line of lines) {
        if (line.trim() === "") {
            flush();
            continue;
        }
        current.push(line);
    }

    flush();
    return blocks.join("\n\n");
}

interface Chunk {
    /** Depth-2 heading that opened this chunk; absent for the page preamble. */
    headingText?: string;
    lines: string[];
}

/**
 * Splits a markdown body into the text before the first H2 and one
 * chunk per H2, with code blocks and JSX removed.
 */
function splitIntoChunks(body: string): Chunk[] {
    const chunks: Chunk[] = [{ lines: [] }];
    let inCode = false;
    let fence = "";

    for (const raw of body.split("\n")) {
        const fenceMatch = FENCE.exec(raw);

        if (fenceMatch) {
            if (!inCode) {
                inCode = true;
                fence = fenceMatch[1][0];
            } else if (fenceMatch[1][0] === fence) {
                inCode = false;
            }
            continue;
        }

        if (inCode) continue;

        const heading = HEADING.exec(raw);

        if (heading && heading[1].length === 2) {
            chunks.push({ headingText: stripInline(heading[2]), lines: [] });
            continue;
        }

        const current = chunks[chunks.length - 1];

        if (heading) {
            current.lines.push(stripInline(heading[2]));
            continue;
        }

        if (TAG_ONLY_LINE.test(raw) || isTableRule(raw)) {
            continue;
        }

        current.lines.push(raw.trim() === "" ? "" : stripInline(stripBlockMarkers(raw)));
    }

    return chunks;
}

// ──────────────────────────────────────────────────────────
// Document assembly
// ──────────────────────────────────────────────────────────

type CategoryTitles = Map<string, string>;

/** Directory-path → category title, from the collection's `__category.json` entries. */
function collectCategoryTitles(entries: { slug: string; metadata: PageSchema }[]): CategoryTitles {
    const titles: CategoryTitles = new Map();

    for (const entry of entries) {
        if (!entry.slug.endsWith(CATEGORY_SUFFIX)) continue;

        const dir = entry.slug.slice(0, -CATEGORY_SUFFIX.length);
        const title = entry.metadata.title;
        if (title) titles.set(dir, title);
    }

    return titles;
}

/**
 * Breadcrumb for a page: the collection label, each intermediate
 * category label, then the page title. Consecutive repeats are
 * collapsed so a section that restates its parent reads once.
 *
 * Indexed as a searchable field and embedded with the page, so this
 * is what puts "SurrealQL" or "Python SDK" into the index for pages
 * whose title and URL never say it.
 */
function buildBreadcrumb(
    label: string,
    slug: string,
    categories: CategoryTitles,
    title: string,
): string {
    const parts = [label];
    const segments = slug.split("/").filter(Boolean);

    for (let i = 1; i <= segments.length; i++) {
        const categoryTitle = categories.get(segments.slice(0, i).join("/"));

        if (categoryTitle && categoryTitle !== parts[parts.length - 1]) {
            parts.push(categoryTitle);
        }
    }

    if (title && title !== parts[parts.length - 1]) {
        parts.push(title);
    }

    return parts.join(" > ");
}

function buildPath(base: string, prefix: string, slug: string): string {
    return `/${[base, prefix, slug]
        .flatMap((part) => part.split("/"))
        .filter(Boolean)
        .join("/")}`;
}

/**
 * Reads a collection's declared search metadata, throwing when it is
 * absent. Failing the build is deliberate: a collection added or
 * renamed without search metadata would otherwise index with no
 * ranking class and no breadcrumb root, which is the silent
 * degradation this file exists to prevent.
 */
function resolveRoute(
    id: string,
    prefix: string,
    entries: { slug: string; metadata: PageSchema }[],
): SearchRoute {
    const root = entries.find((entry) => entry.slug === ROOT_CATEGORY_SLUG);
    const search = root?.metadata.search;

    if (!search) {
        throw new Error(
            `[search-index] Collection "${id}" has no search metadata. Add a ` +
                `"search" block with "label" and "kind" to src/content/${id}/__category.json ` +
                "(see SEARCH_KINDS in src/utils/schema.ts).",
        );
    }

    // The SDK collections are named after their language, which is the
    // canonical slug query-time language detection resolves aliases to.
    const language = search.kind === "sdk" ? id.split("/").pop() : undefined;

    return {
        id,
        prefix,
        label: search.label,
        kind: search.kind,
        ...(language && { language }),
        product: search.product ?? PRODUCT_ORDER[0],
    };
}

function buildDocuments(route: SearchRoute, base: string): SearchDocument[] {
    const entries = getCollection(route.id) as unknown as {
        slug: string;
        content: string;
        metadata: PageSchema;
    }[];

    const categories = collectCategoryTitles(entries);
    const documents: SearchDocument[] = [];

    for (const entry of entries) {
        // `__category.json` entries carry sidebar metadata, not content.
        if (entry.slug === ROOT_CATEGORY_SLUG || entry.slug.endsWith(CATEGORY_SUFFIX)) {
            continue;
        }

        const title = entry.metadata.title ?? entry.slug.split("/").pop() ?? "";
        const chunks = splitIntoChunks(entry.content);

        // Anchors come from the content-collection package so they match
        // the ids the rendered page assigns to its headings.
        const headings = extractHeadings(entry.content).filter((heading) => heading.depth === 2);
        const [preamble, ...sectionChunks] = chunks;

        const sections: SearchSection[] = [];

        for (const [index, chunk] of sectionChunks.entries()) {
            const heading = headings[index];
            const content = toParagraphs(chunk.lines);
            const sectionTitle = chunk.headingText ?? heading?.text ?? "";

            if (!heading || !sectionTitle || !content) continue;

            sections.push({ anchor: heading.id, title: sectionTitle, content });
        }

        const fullText = [
            toParagraphs(preamble.lines),
            ...sectionChunks.map((chunk) => toParagraphs(chunk.lines)),
        ]
            .filter(Boolean)
            .join("\n\n");

        documents.push({
            collection: route.id,
            slug: entry.slug,
            path: buildPath(base, route.prefix, entry.slug),
            title,
            description: entry.metadata.description ?? "",
            breadcrumb: buildBreadcrumb(route.label, entry.slug, categories, title),
            kind: route.kind,
            ...(route.language && { language: route.language }),
            product: route.product,
            content: fullText,
            sections,
        });
    }

    return documents;
}

async function writeJson(root: string, file: string, data: unknown): Promise<void> {
    const target = join(root, file);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify(data)}\n`);
}

/** Compiles the search artefacts. Exported for the standalone generator script. */
export function compileSearchIndex(base: string): {
    routes: SearchRoute[];
    documents: SearchDocument[];
} {
    const routes: SearchRoute[] = [];
    const documents: SearchDocument[] = [];

    for (const { id, prefix } of COLLECTION_ROUTES) {
        const entries = getCollection(id) as unknown as {
            slug: string;
            metadata: PageSchema;
        }[];

        const route = resolveRoute(id, prefix, entries);
        routes.push(route);
        documents.push(...buildDocuments(route, base));
    }

    return { routes, documents };
}

export function viteSearchIndex(): Plugin {
    let root = process.cwd();
    let base = "/";
    // A build runs buildStart once per environment (client, server, and each
    // Vercel target). The artefacts are identical every time, so compile once.
    let written = false;

    return {
        name: "surrealdb:search-index",
        // vike-content-collection is `enforce: "pre"`, so its buildStart has
        // already populated the collection store by the time this runs.
        async buildStart() {
            if (written) return;
            written = true;

            const { routes, documents } = compileSearchIndex(base);
            const sections = documents.reduce((total, doc) => total + doc.sections.length, 0);

            await writeJson(root, ROUTES_FILE, { base, collections: routes });
            await writeJson(root, INDEX_FILE, { base, documents });

            this.info?.(
                `search index: ${documents.length} pages, ${sections} sections, ${routes.length} collections`,
            );
        },
        configResolved(config) {
            root = config.root;
            // Vite normalises `base` with a trailing slash ("/docs/"); store it
            // without one so it reads as a path prefix everywhere downstream.
            base = config.base.replace(/\/+$/, "");
        },
    };
}
