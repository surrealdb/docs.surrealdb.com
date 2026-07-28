import type { SearchKind } from "./ranking";

// ──────────────────────────────────────────────────────────
// Compiled index types
//
// The shape of `generated/search-index.json`, produced by
// plugins/vite-search-index.ts from the site's own content
// collections. The indexer reads this artefact rather than crawling
// src/content, so search indexes exactly the entries, frontmatter,
// and category metadata the rendered pages use.
// ──────────────────────────────────────────────────────────

/** One H2 section of a document, deep-linkable via its anchor. */
export interface IndexedSection {
    anchor: string; // URL fragment, e.g. "record-ranges"
    title: string; // H2 heading text
    content: string; // plain text until the next H2
}

export interface IndexedDocument {
    collection: string; // e.g. "reference/query-language"
    slug: string; // path within the collection, e.g. "statements/select"
    path: string; // full URL path, e.g. "/docs/reference/query-language/statements/select"
    title: string;
    description: string; // from frontmatter, used in ranking and as a snippet
    breadcrumb: string; // "SurrealQL > Statements > SELECT"
    kind: SearchKind; // ranking class declared by the collection
    language?: string; // SDK language slug, only when kind is "sdk"
    product: string;
    content: string; // full page plain text (no code blocks)
    sections: IndexedSection[];
}

/** Shape of `generated/search-index.json`. */
export interface CompiledSearchIndex {
    base: string;
    documents: IndexedDocument[];
}

// ──────────────────────────────────────────────────────────
// Search result types
//
// RawSearchHit is what comes back from the SurrealDB query.
// The handler transforms these into grouped SearchResults
// where multiple hits from the same page are collapsed.
// ──────────────────────────────────────────────────────────

/** Raw row returned by the hybrid search query (before reranking/grouping). */
export interface RawSearchHit {
    kind: "page" | "section";
    url: string;
    title: string;
    breadcrumb: string;
    description?: string;
    content?: string;
    /** Ranking class of the parent page, from the compiled index. */
    doc_kind: SearchKind;
    /** SDK language slug, only when `doc_kind` is "sdk". */
    language?: string;
    product: string;
    /** Path within the collection, used to collapse cross-language duplicates. */
    slug: string;
    score: number; // RRF fusion score
    page_path: string; // used to group hits from the same page
}

/** A single search result item shown in the UI. */
export interface SearchResultItem {
    kind: "page" | "section";
    url: string;
    title: string;
    breadcrumb: string;
    description?: string;
    content?: string; // snippet with context around matched terms
    score: number;
}

/**
 * A grouped search result: one primary hit plus additional
 * hits from the same page collapsed under `more`. This lets
 * the UI show "SELECT — Record ranges, Selecting inside
 * graph queries" as a single result group.
 */
export interface SearchResult extends SearchResultItem {
    more: SearchResultItem[];
}
