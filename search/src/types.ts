// ──────────────────────────────────────────────────────────
// Crawler output types
//
// The crawler walks every markdown file in src/content/ and
// emits two kinds of entries: pages and sections. These are
// consumed by the indexer which embeds and upserts them into
// SurrealDB.
// ──────────────────────────────────────────────────────────

export interface CrawledPage {
    kind: "page";
    id: string; // e.g. "doc-surrealql:statements/select"
    collection: string; // e.g. "doc-surrealql", "doc-sdk-javascript"
    path: string; // URL path, e.g. "/docs/surrealql/statements/select"
    url: string; // same as path for pages
    title: string;
    description: string; // from frontmatter, used in search ranking
    breadcrumb: string; // "SurrealQL > Statements > SELECT"
    content: string; // full page plain text (no code blocks)
    contentHash: string; // SHA-256 for incremental re-indexing
}

export interface CrawledSection {
    kind: "section";
    id: string; // e.g. "doc-surrealql:statements/select#record-ranges"
    pageId: string; // parent page id
    anchor: string; // URL fragment, e.g. "record-ranges"
    depth: number; // heading depth (always 2)
    url: string; // page path + "#" + anchor
    title: string; // H2 heading text
    breadcrumb: string; // page breadcrumb + " > " + section title
    content: string; // plain text between this H2 and the next
    contentHash: string;
}

export type CrawledEntry = CrawledPage | CrawledSection;

// ──────────────────────────────────────────────────────────
// Search result types
//
// RawSearchHit is what comes back from the SurrealDB query.
// The handler transforms these into grouped SearchResults
// where multiple hits from the same page are collapsed.
// ──────────────────────────────────────────────────────────

/** Raw row returned by the hybrid search query (before boosting/grouping). */
export interface RawSearchHit {
    kind: "page" | "section";
    url: string;
    title: string;
    breadcrumb: string;
    description?: string;
    content?: string;
    collection?: string; // used for collection-based ranking boost
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
