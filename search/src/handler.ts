// ══════════════════════════════════════════════════════════
// Search handler — hybrid retrieval + reranking
//
// Query flow:
//   1. Strip question prefixes for BM25 ("how to X" → "X")
//   2. Embed the full original query with OpenAI
//   3. Run four parallel retrieval paths in SurrealDB:
//        a. Page vector search   (semantic similarity)
//        b. Page full-text search (BM25 keyword matching)
//        c. Section vector search
//        d. Section full-text search
//   4. Fuse results with Reciprocal Rank Fusion (RRF)
//   5. Rerank: static authority prior × title match × page kind
//   6. Diversify: collapse cross-language SDK duplicates and cap
//      how many pages one SDK language may occupy
//   7. Group hits by page and extract snippets
//   8. Apply relevance threshold to trim noise
//
// Steps 5 and 6 exist because the corpus is heavily skewed: the
// ten SDK collections are ~370 of ~880 SurrealDB pages and
// describe the same method surface ten times over, with terse
// one-word titles ("Table", "Select", "Upsert") that exact-match
// short queries. Retrieval alone therefore hands the entire top
// of the results to SDK reference pages — searching "table"
// returned the JavaScript, Go, Python, Java and Kotlin `Table`
// types before `DEFINE TABLE` or the Tables guide.
// ══════════════════════════════════════════════════════════

import { getDb } from "./db";
import { embed } from "./embed";
import {
    detectLanguages,
    kindAuthority,
    type LanguageIntent,
    SDK_KIND,
    type SearchContext,
    type SearchKind,
    sdkAuthority,
} from "./ranking";
import type { RawSearchHit, SearchResult, SearchResultItem } from "./types";

export const MAX_QUERY_LENGTH = 500;

// ──────────────────────────────────────────────────────────
// Product scoping
//
// The search index is shared across products, but the UX is
// product-scoped. Each page carries the product its collection
// declares, so this is a field comparison rather than a URL test.
//
// Filtering happens HERE — before reranking, grouping, the relevance
// threshold, and the result cap — so the much larger SurrealDB corpus
// can't crowd the smaller Spectron product out of the global top-N.
// (This previously ran in the API wrapper after the cap, which
// starved Spectron results: a Spectron query could return few or zero
// hits even when relevant Spectron pages existed.)
// ──────────────────────────────────────────────────────────

export type SearchProduct = string;

function matchesProduct(hit: RawSearchHit, product: SearchProduct): boolean {
    return hit.product === product;
}

// ──────────────────────────────────────────────────────────
// SurrealQL hybrid search query
//
// Runs four sub-queries and fuses them with RRF. The query
// receives two parameters:
//   $query — the search string for BM25 (question prefixes stripped)
//   $qvec  — the 1536-dim embedding vector for KNN search
// ──────────────────────────────────────────────────────────
const SEARCH_SQL = /* surql */ `
    -- ── Page vector search ──
    -- Finds the 60 pages whose embeddings are closest to the
    -- query embedding. The <|60,240|> syntax means: return 60
    -- neighbours, exploring up to 240 candidates in the HNSW
    -- graph (higher = more accurate but slower). The pool is kept
    -- generous because results are product-filtered downstream, and
    -- the smaller product (Spectron) must not be crowded out.
    LET $page_vs = (
        SELECT
            id,
            "page" AS kind,
            path AS url,
            path AS page_path,
            collection,
            slug,
            doc_kind,
            language,
            product,
            title,
            breadcrumb,
            description,
            content,
            vector::distance::knn() AS distance
        FROM page
        WHERE embedding <|60,240|> $qvec
        ORDER BY distance ASC
        LIMIT 60
    );

    -- ── Page full-text search ──
    -- BM25 scoring across five indexed fields. Each @N@ operator
    -- binds to search::score(N) so we can weight fields differently.
    -- Weights reflect how informative each field is:
    --   path (15)        — URL segments are strong signals ("surrealql/statements/select")
    --   title (25)       — strongest signal, exact topic match
    --   breadcrumb (10)  — navigation context ("SurrealQL > Statements > SELECT")
    --   description (8)  — frontmatter summary, good keywords
    --   content (3)      — body text, weakest per-term but most volume
    LET $page_ft = (
        SELECT
            id,
            "page" AS kind,
            path AS url,
            path AS page_path,
            collection,
            slug,
            doc_kind,
            language,
            product,
            title,
            breadcrumb,
            description,
            content,
            (
                (search::score(0) * 15)
                + (search::score(1) * 25)
                + (search::score(2) * 10)
                + (search::score(3) * 8)
                + (search::score(4) * 3)
            ) AS ft_score
        FROM page
        WHERE
            path @0@ $query
            OR title @1@ $query
            OR breadcrumb @2@ $query
            OR description @3@ $query
            OR content @4@ $query
        ORDER BY ft_score DESC
        LIMIT 60
    );

    -- ── Section vector search ──
    -- Same as page vector search but for H2 sections.
    -- Pulls the parent page's path and collection via the
    -- record link (page.path, page.collection).
    LET $section_vs = (
        SELECT
            id,
            "section" AS kind,
            string::concat(page.path, "#", anchor) AS url,
            page.path AS page_path,
            page.collection AS collection,
            page.slug AS slug,
            page.doc_kind AS doc_kind,
            page.language AS language,
            page.product AS product,
            title,
            breadcrumb,
            content,
            vector::distance::knn() AS distance
        FROM section
        WHERE embedding <|60,240|> $qvec
        ORDER BY distance ASC
        LIMIT 60
    );

    -- ── Section full-text search ──
    -- Sections don't have path or description fields, so only
    -- three fields are searched. Title is still the strongest
    -- signal (25), breadcrumb provides context (10), and body
    -- content is a weaker but broad signal (3).
    LET $section_ft = (
        SELECT
            id,
            "section" AS kind,
            string::concat(page.path, "#", anchor) AS url,
            page.path AS page_path,
            page.collection AS collection,
            page.slug AS slug,
            page.doc_kind AS doc_kind,
            page.language AS language,
            page.product AS product,
            title,
            breadcrumb,
            content,
            (
                (search::score(0) * 25)
                + (search::score(1) * 10)
                + (search::score(2) * 3)
            ) AS ft_score
        FROM section
        WHERE
            title @0@ $query
            OR breadcrumb @1@ $query
            OR content @2@ $query
        ORDER BY ft_score DESC
        LIMIT 60
    );

    -- ── Reciprocal Rank Fusion ──
    -- Combines the four ranked lists into a single ranking.
    -- RRF scores each result as: sum(1 / (k + rank_in_list))
    -- across all lists the result appears in.
    --   arg 1: array of ranked lists to fuse
    --   arg 2: k=60 (smoothing constant, standard RRF default)
    --   arg 3: limit=240 (max candidates to consider)
    --
    -- The candidate pool is deliberately larger than the 20 results
    -- the UI shows: reranking collapses the ten cross-language copies
    -- of an SDK page into one, so a pool sized for the display limit
    -- would come out short after deduplication.
    LET $fused = search::rrf([$page_ft, $page_vs, $section_ft, $section_vs], 60, 240);

    RETURN (
        SELECT
            kind,
            url,
            page_path,
            collection,
            slug,
            doc_kind,
            language,
            product,
            title,
            breadcrumb,
            description,
            content,
            rrf_score AS score
        FROM $fused
        LIMIT 100
    );
`;

// ──────────────────────────────────────────────────────────
// Text helpers
// ──────────────────────────────────────────────────────────

function normalise(s: string): string {
    return s.toLowerCase().trim();
}

/** Split on whitespace, hyphens, underscores, and slashes. */
function tokenise(s: string): string[] {
    return normalise(s)
        .split(/[\s\-_/]+/)
        .filter(Boolean);
}

/**
 * Candidate forms of a token: itself plus naive plural strips. The
 * BM25 analyser stems with snowball, so "table" already retrieves the
 * page titled "Tables"; without the same leniency here that page then
 * missed the title boost and lost to an SDK page whose title happened
 * to be the exact singular. Both "-s" and "-es" strips are kept as
 * alternatives rather than picking one, since neither rule alone
 * relates "tables"/"table" and "indexes"/"index" correctly.
 */
function tokenForms(token: string): string[] {
    const forms = [token];
    if (token.length > 3 && token.endsWith("s")) forms.push(token.slice(0, -1));
    if (token.length > 4 && token.endsWith("es")) forms.push(token.slice(0, -2));
    return forms;
}

/** True when two tokens match exactly or as singular/plural variants. */
function tokensMatch(a: string, b: string): boolean {
    if (a === b) return true;
    const formsOfB = tokenForms(b);
    return tokenForms(a).some((form) => formsOfB.includes(form));
}

/** True when two token sequences are equal, allowing plural variants. */
function tokensEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((token, i) => tokensMatch(token, b[i]));
}

/**
 * Checks whether `shorter` is a token-level prefix of `longer`.
 * Used for title matching: e.g. title tokens ["select"] are a
 * prefix of query tokens ["select", "statement", "examples"],
 * so the SELECT page gets a boost.
 *
 * This is stricter than a character-level startsWith check,
 * which caused false positives like "Surreal" boosting on
 * "SurrealDB authentication" (the class name "Surreal" is
 * NOT a token prefix of ["surrealdb", "authentication"]).
 */
function isTokenPrefix(shorter: string[], longer: string[]): boolean {
    if (shorter.length === 0 || shorter.length > longer.length) return false;
    return shorter.every((token, i) => tokensMatch(longer[i], token));
}

// ──────────────────────────────────────────────────────────
// Post-retrieval reranking
//
// After RRF fusion, multiplicative factors adjust the ranking
// using signals the retrieval query cannot express: where a page
// sits in the docs taxonomy, how closely its title matches, and
// whether the query names an SDK language.
//
// RRF scores sit in a narrow band by construction — rank 1 and
// rank 5 of the same list differ by ~6% — so these factors, not
// retrieval order, decide the top of the list. That is why the
// authority prior has to carry real weight, and why the factors
// are kept few and named rather than tuned freely.
// ──────────────────────────────────────────────────────────

/**
 * Title relevance tiers, mutually exclusive:
 *   3.0x — title equals the query ("RELATE" → "RELATE", "table" → "Tables")
 *   2.0x — one is a token prefix of the other ("SELECT statement" → "SELECT")
 *   1.5x — every query token appears somewhere in the title
 */
const TITLE_EXACT_BOOST = 3.0;
const TITLE_PREFIX_BOOST = 2.0;
const TITLE_CONTAINS_BOOST = 1.5;

/**
 * Pages are slightly preferred over their own sections: a page is a
 * more comprehensive landing point, and its sections stay reachable
 * through the grouped "more results on this page" list.
 */
const PAGE_KIND_BOOST = 1.1;

/** Applied when a result sits in the same part of the docs the user is reading. */
const SAME_CONTEXT_BOOST = 1.12;

/** Applied to results mentioning both terms of an "X vs Y" query. */
const COMPARISON_BOOST = 1.5;

/**
 * Detects whether the user is comparing two concepts and
 * extracts both terms. When detected, results mentioning BOTH
 * terms get a boost so that "difference between MERGE and
 * UPDATE" surfaces pages discussing both rather than pages
 * about only one.
 *
 * Uses indexOf-based splitting instead of regex capture groups
 * to avoid polynomial backtracking (ReDoS) on adversarial
 * input — greedy/lazy `.+?` overlapping with `\s+` separators
 * causes exponential search in the regex engine.
 */
function extractComparisonTerms(query: string): [string, string] | null {
    const q = query.trim().toLowerCase().replace(/\s+/g, " ");

    if (q.startsWith("difference between ") || q.startsWith("differences between ")) {
        const after = q.slice(q.indexOf(" between ") + 9);
        return splitOnLast(after, " and ");
    }

    if (q.startsWith("comparing ")) {
        const after = q.slice("comparing ".length);
        for (const sep of [" and ", " with ", " to "]) {
            const pair = splitOnFirst(after, sep);
            if (pair) return pair;
        }
        return null;
    }

    for (const sep of [" vs. ", " vs ", " versus ", " compared to "]) {
        const pair = splitOnFirst(q, sep);
        if (pair) return pair;
    }

    return null;
}

function splitOnFirst(text: string, sep: string): [string, string] | null {
    const idx = text.indexOf(sep);
    if (idx <= 0) return null;
    const a = text.slice(0, idx).trim();
    const b = text.slice(idx + sep.length).trim();
    return a && b ? [a, b] : null;
}

function splitOnLast(text: string, sep: string): [string, string] | null {
    const idx = text.lastIndexOf(sep);
    if (idx <= 0) return null;
    const a = text.slice(0, idx).trim();
    const b = text.slice(idx + sep.length).trim();
    return a && b ? [a, b] : null;
}

function titleBoost(hit: RawSearchHit, queryTokens: string[]): number {
    const titleTokens = tokenise(hit.title || "");

    if (tokensEqual(titleTokens, queryTokens)) return TITLE_EXACT_BOOST;

    if (isTokenPrefix(titleTokens, queryTokens) || isTokenPrefix(queryTokens, titleTokens)) {
        return TITLE_PREFIX_BOOST;
    }

    const title = normalise(hit.title || "");
    if (queryTokens.length > 1 && queryTokens.every((token) => title.includes(token))) {
        return TITLE_CONTAINS_BOOST;
    }

    return 1.0;
}

/** Static prior for the kind of documentation the hit belongs to. */
function authorityBoost(hit: RawSearchHit, intent: LanguageIntent): number {
    return hit.doc_kind === SDK_KIND
        ? sdkAuthority(hit.language, intent)
        : kindAuthority(hit.doc_kind);
}

/**
 * The part of the query that names what the reader wants, with any
 * language mention removed.
 *
 * Naming a language says *where* to look, not *what* to look for, and
 * the authority prior has already acted on it. Leaving it in the tokens
 * used for title matching let the language's own landing page win on
 * title alone: "rust select" scored `/docs/languages/rust` (title
 * "Rust", a token prefix of the query) above `rust/methods/select`,
 * which is the page actually being asked for.
 *
 * Falls back to the whole query when the language is all there is, so
 * "python" still matches the Python landing page.
 */
function subjectTokens(queryTokens: string[], intent: LanguageIntent): string[] {
    if (intent.requested.size === 0) return queryTokens;

    const namesRequestedLanguage = (token: string) =>
        [...detectLanguages([token])].some((language) => intent.requested.has(language));

    const subject = queryTokens.filter((token) => !namesRequestedLanguage(token));

    return subject.length > 0 ? subject : queryTokens;
}

function rerank(
    hits: RawSearchHit[],
    query: string,
    intent: LanguageIntent,
    contextKind?: SearchKind,
): RawSearchHit[] {
    const queryTokens = subjectTokens(tokenise(query), intent);
    const comparison = extractComparisonTerms(query);

    const scored = hits.map((hit) => {
        let boost = titleBoost(hit, queryTokens) * authorityBoost(hit, intent);

        if (hit.kind === "page") {
            boost *= PAGE_KIND_BOOST;
        }

        // Someone reading the SurrealQL reference who searches "table"
        // means the statement, not a client library's type wrapper.
        if (contextKind && hit.doc_kind === contextKind) {
            boost *= SAME_CONTEXT_BOOST;
        }

        // For comparison queries ("X vs Y"), prefer results whose
        // title or content mentions both compared terms.
        if (comparison) {
            const searchable = `${normalise(hit.title || "")} ${normalise(hit.content || "")}`;
            if (comparison.every((term) => searchable.includes(term))) {
                boost *= COMPARISON_BOOST;
            }
        }

        return { ...hit, score: hit.score * boost };
    });

    return scored.sort((a, b) => b.score - a.score);
}

// ──────────────────────────────────────────────────────────
// SDK result diversification
//
// The ten SDK collections document the same surface ten times, so
// a query matching one of them usually matches all ten with near
// identical scores. Ranking alone cannot fix that: even correctly
// de-prioritised, the copies stay adjacent and fill the list as a
// block ("Table" ×5 before any SurrealDB page).
//
// The fix is the standard one for near-duplicate corpora — collapse
// on a group key, as Elasticsearch field collapsing and Algolia's
// `distinct` do. Two rules, both applied at page granularity so a
// page's sections travel with it into the grouped result:
//
//   1. Collapse cross-language variants of the same page, keeping
//      the best-scoring language.
//   2. Cap how many distinct pages any one language may contribute,
//      so a single SDK cannot fill the list with near-synonyms
//      (.NET's `live-query`, `live-raw-query`, `live-table`, ...).
//
// Neither rule applies once the query names a language: asking for
// "python methods" should return the whole Python surface.
// ──────────────────────────────────────────────────────────

/** Maximum distinct pages one SDK language may contribute to an unscoped query. */
const MAX_PAGES_PER_SDK_LANGUAGE = 2;

/** SDK docs version their paths (`php/v1/methods/...`); versions are not variants. */
const VERSION_SEGMENT = /^v\d+$/;

/**
 * Cross-language identity of an SDK page: its in-collection slug with
 * version segments removed. `reference/python` + "api/values/table"
 * and `reference/golang` + "api/values/table" share a key;
 * "methods/live" and "methods/live-query" do not.
 *
 * Returns null for hits that have no cross-language twin to collapse
 * against — non-SDK pages, and each SDK's own landing page.
 */
function sdkVariantKey(hit: RawSearchHit): string | null {
    if (hit.doc_kind !== SDK_KIND || !hit.slug) return null;

    const segments = hit.slug.split("/").filter((s) => s && !VERSION_SEGMENT.test(s));
    return segments.length > 0 ? segments.join("/") : null;
}

/**
 * Selects which pages survive diversification. Hits arrive in score
 * order, so the first page seen for a variant key or a language is
 * the best-scoring one.
 */
function diversify(hits: RawSearchHit[], intent: LanguageIntent): RawSearchHit[] {
    if (intent.requested.size > 0) return hits;

    const admitted = new Set<string>();
    const rejected = new Set<string>();
    const claimedVariants = new Set<string>();
    const pagesPerLanguage = new Map<string, number>();

    for (const hit of hits) {
        const page = hit.page_path;
        if (admitted.has(page) || rejected.has(page)) continue;

        const variant = sdkVariantKey(hit);
        const language = hit.language;

        if (variant && claimedVariants.has(variant)) {
            rejected.add(page);
            continue;
        }

        if (hit.doc_kind === SDK_KIND && language) {
            const count = pagesPerLanguage.get(language) ?? 0;
            if (count >= MAX_PAGES_PER_SDK_LANGUAGE) {
                rejected.add(page);
                continue;
            }
            pagesPerLanguage.set(language, count + 1);
        }

        if (variant) claimedVariants.add(variant);
        admitted.add(page);
    }

    return hits.filter((hit) => admitted.has(hit.page_path));
}

// ──────────────────────────────────────────────────────────
// Snippet extraction
//
// Selects the best paragraph-level block from the stored
// content to use as a search result preview. Instead of
// sliding a character window across flat text, we split on
// block boundaries (\n\n) and score each block by how many
// query terms it contains.
//
// Priority:
//   1. A single block that contains query terms and is long
//      enough (>= SNIPPET_MAX_LENGTH / 3).
//   2. Consecutive blocks joined together that meet the same
//      criteria (handles short paragraphs / list items).
//   3. The longest block regardless of query term matches.
//   4. Frontmatter description (pages) or empty (sections).
// ──────────────────────────────────────────────────────────

const SNIPPET_MAX_LENGTH = 200;
const MIN_BLOCK_LENGTH = Math.floor(SNIPPET_MAX_LENGTH / 3);

/**
 * Repair older indexed content where adjacent blocks were
 * joined without separators ("statementThe", "select()Selects").
 */
function repairConcatenation(text: string): string {
    return text.replace(/([a-z.!?,:;)\]`])([A-Z])/g, "$1 $2");
}

/**
 * Truncate text to SNIPPET_MAX_LENGTH, preferring to end at
 * a sentence boundary so the preview reads naturally.
 */
function truncateToLimit(text: string): string {
    if (text.length <= SNIPPET_MAX_LENGTH) return text;

    const sentEnd = text.search(/[.!?]\s/);
    if (sentEnd > 0 && sentEnd <= SNIPPET_MAX_LENGTH) {
        return text.slice(0, sentEnd + 1);
    }

    const cutAt = text.lastIndexOf(" ", SNIPPET_MAX_LENGTH);
    const safeEnd = cutAt > SNIPPET_MAX_LENGTH * 0.5 ? cutAt : SNIPPET_MAX_LENGTH;
    return `${text.slice(0, safeEnd)}...`;
}

/** Count how many distinct query terms appear in a string. */
function countTermHits(text: string, terms: string[]): number {
    const lower = text.toLowerCase();
    return terms.filter((t) => lower.includes(t)).length;
}

function extractSnippet(
    content: string | undefined,
    description: string | undefined,
    query: string,
): string {
    if (!content) return description?.trim() || "";

    const repaired = repairConcatenation(content);

    // Split into blocks. New content uses \n\n as the delimiter.
    // Old content without separators produces a single block.
    const blocks = repaired
        .split(/\n\n+/)
        .map((b) => b.replace(/\s+/g, " ").trim())
        .filter(Boolean);

    if (blocks.length === 0) return description?.trim() || "";

    const terms = tokenise(query);

    // Phase 1 — find the best single block with query term matches
    // that is long enough to be a meaningful preview.
    let bestBlock: string | null = null;
    let bestHits = 0;
    let bestLen = 0;

    for (const block of blocks) {
        const hits = terms.length > 0 ? countTermHits(block, terms) : 0;
        if (hits === 0 || block.length < MIN_BLOCK_LENGTH) continue;

        const better = hits > bestHits || (hits === bestHits && block.length > bestLen);
        if (better) {
            bestBlock = block;
            bestHits = hits;
            bestLen = block.length;
        }
    }

    if (bestBlock) return truncateToLimit(bestBlock);

    // Phase 2 — try joining consecutive blocks to form a long
    // enough candidate. Only adjacent blocks are joined, matching
    // the principle of not mixing unrelated content.
    if (terms.length > 0) {
        for (let i = 0; i < blocks.length; i++) {
            let merged = blocks[i];
            for (let j = i + 1; j < blocks.length && merged.length < MIN_BLOCK_LENGTH; j++) {
                merged = `${merged} ${blocks[j]}`;
            }
            const hits = countTermHits(merged, terms);
            if (hits > 0 && merged.length >= MIN_BLOCK_LENGTH) {
                return truncateToLimit(merged);
            }
        }
    }

    // Phase 3 — no query-matching block found. Use the longest
    // block if it meets the minimum length, otherwise fall back
    // to the frontmatter description (pages) or empty (sections).
    const longest = blocks.reduce((a, b) => (a.length >= b.length ? a : b));
    if (longest.length >= MIN_BLOCK_LENGTH) {
        return truncateToLimit(longest);
    }

    return description?.trim() || "";
}

function toItem(hit: RawSearchHit, query: string): SearchResultItem {
    const snippet =
        hit.kind === "page" && hit.description?.trim()
            ? hit.description.trim()
            : extractSnippet(hit.content, hit.description, query);

    return {
        kind: hit.kind,
        url: hit.url,
        title: hit.title,
        breadcrumb: hit.breadcrumb,
        description: hit.description,
        content: snippet,
        score: hit.score,
    };
}

// ──────────────────────────────────────────────────────────
// Question prefix stripping
//
// Natural-language prefixes like "how to", "what is" add noise
// to BM25 matching ("do" appears in almost every page). We
// strip them from the BM25 query but keep the original for the
// vector embedding, which handles natural language natively.
// ──────────────────────────────────────────────────────────

const QUESTION_PREFIXES = [
    /^how\s+(?:do\s+(?:i|you|we)\s+|to\s+|can\s+(?:i|you|we)\s+)/i,
    /^what\s+(?:is|are|does)\s+(?:a\s+|an\s+|the\s+)?/i,
    /^where\s+(?:is|are|do|does|can)\s+(?:the\s+)?/i,
    /^when\s+(?:should|do|does|to)\s+/i,
    /^why\s+(?:does|do|is|are|should)\s+/i,
    /^can\s+(?:i|you|we)\s+/i,
    /^is\s+(?:it|there)\s+(?:possible\s+to\s+)?/i,
];

function stripQuestionPrefix(query: string): string {
    const q = query.trim();
    for (const pattern of QUESTION_PREFIXES) {
        const stripped = q.replace(pattern, "");
        if (stripped !== q && stripped.length >= 3) {
            return stripped;
        }
    }
    return q;
}

// ──────────────────────────────────────────────────────────
// Domain synonym expansion (BM25 only)
//
// BM25 is purely lexical: a query for "perms" never matches a
// page that only says "permissions". We append a small, curated
// set of SurrealDB-specific synonyms to the BM25 query so common
// aliases and acronyms still retrieve the right pages. Expansion
// is applied ONLY to the keyword query — the vector embedding
// uses the original wording and already handles paraphrase.
//
// Keep this map small and high-precision: every added term widens
// recall but slightly dilutes BM25 scoring.
// ──────────────────────────────────────────────────────────

const SYNONYMS: Record<string, string[]> = {
    sql: ["surrealql"],
    surrealql: ["sql"],
    perms: ["permissions"],
    perm: ["permission"],
    auth: ["authentication"],
    authz: ["authorisation", "permissions"],
    authn: ["authentication"],
    js: ["javascript"],
    ts: ["typescript"],
    rel: ["relate"],
    fts: ["full-text", "search"],
    db: ["database"],
    "record id": ["recordid"],
    recordid: ["record"],
};

function expandSynonyms(query: string): string {
    const lower = query.toLowerCase();
    const tokens = tokenise(query);
    const additions: string[] = [];

    for (const [term, synonyms] of Object.entries(SYNONYMS)) {
        // Multi-word keys are matched as substrings; single-word
        // keys must match a whole token to avoid spurious hits.
        const present = term.includes(" ") ? lower.includes(term) : tokens.includes(term);
        if (!present) continue;

        for (const synonym of synonyms) {
            if (!lower.includes(synonym)) additions.push(synonym);
        }
    }

    return additions.length > 0 ? `${query} ${additions.join(" ")}` : query;
}

/**
 * Normalises a raw search query into a canonical form suitable
 * for use as a CDN cache key. Two queries that normalise to the
 * same string will produce identical search results, so the API
 * layer can redirect non-canonical queries to the canonical URL
 * and let the CDN serve a cached response.
 *
 * Steps: trim → lowercase → collapse whitespace → strip trailing
 * punctuation → strip question prefixes ("how to X" → "X").
 */
export function normaliseQuery(raw: string): string {
    let q = raw.trim().toLowerCase();
    q = q.replace(/\s+/g, " ");

    let end = q.length;
    while (end > 0 && (q[end - 1] === "?" || q[end - 1] === "." || q[end - 1] === "!")) {
        end--;
    }
    q = q.slice(0, end);

    q = stripQuestionPrefix(q);
    return q.trim();
}

// ──────────────────────────────────────────────────────────
// Relevance threshold
//
// Without a cutoff, every query returns 30-50 grouped results
// because vector search always finds "something close". We
// drop results scoring below a fraction of the top hit and cap
// at 20 groups so the UI isn't flooded with marginal matches.
//
// The ratio is lower than the score spread the authority prior
// introduces (a de-prioritised SDK page scores ~0.3x an equally
// well-retrieved SurrealQL page). At 0.3 the threshold would have
// turned that prior into a filter and dropped SDK results from
// generic queries entirely; the intent is to rank them below core
// docs, not to hide them.
// ──────────────────────────────────────────────────────────

const MAX_GROUPED_RESULTS = 20;
const MIN_SCORE_RATIO = 0.15;

function applyRelevanceThreshold(results: SearchResult[]): SearchResult[] {
    if (results.length === 0) return results;

    const topScore = results[0].score;
    const minScore = topScore * MIN_SCORE_RATIO;

    return results.filter((r) => r.score >= minScore).slice(0, MAX_GROUPED_RESULTS);
}

// ──────────────────────────────────────────────────────────
// Result grouping
//
// Multiple hits from the same page (e.g. the page itself plus
// several of its sections) are collapsed into a single result.
// The highest-scoring hit becomes the primary result, and the
// rest are nested under `more`. This keeps the results list
// compact while still surfacing deep-linked sections.
// ──────────────────────────────────────────────────────────

function groupByPage(hits: RawSearchHit[], query: string): SearchResult[] {
    // Drop hits with empty/missing titles (e.g. sections from
    // headings that only contained JSX components).
    const filtered = hits.filter((h) => h.title?.trim());

    const groups = new Map<string, RawSearchHit[]>();
    const order: string[] = [];

    for (const hit of filtered) {
        const key = hit.page_path;
        const existing = groups.get(key);

        if (existing) {
            existing.push(hit);
        } else {
            groups.set(key, [hit]);
            order.push(key);
        }
    }

    return order.map((key) => {
        const items = groups.get(key) ?? [];
        const [primary, ...rest] = items;
        return {
            ...toItem(primary, query),
            more: rest.map((h) => toItem(h, query)),
        };
    });
}

// ──────────────────────────────────────────────────────────
// Main entry point
//
// `context` is where the search came from — the reader's location,
// resolved from their pathname by the API layer (see
// createRouteResolver in ./routes). Search runs from inside a page
// and that page carries intent: "table" typed in the SurrealQL
// reference means the statement, and "connect" typed in the Python
// SDK means the Python client. This is the signal Algolia DocSearch
// calls contextual search.
// ──────────────────────────────────────────────────────────

export interface SearchOptions {
    product?: SearchProduct;
    /** Where the search was made from. */
    context?: SearchContext;
}

/**
 * Everything that happens to retrieved hits: product scoping, then
 * rerank, diversify, group, and trim. Kept separate from retrieval so
 * ranking can be exercised without a database or an embedding call —
 * see search/src/handler.test.ts.
 */
export function rankHits(
    hits: RawSearchHit[],
    query: string,
    options: SearchOptions = {},
): SearchResult[] {
    const { product, context } = options;

    // Filter by product BEFORE reranking/grouping/threshold so the
    // relevance cutoff and result cap apply within the product.
    const scoped = product ? hits.filter((hit) => matchesProduct(hit, product)) : hits;

    const intent: LanguageIntent = {
        requested: detectLanguages(tokenise(query)),
        browsing: context?.language,
    };

    const ranked = rerank(scoped, query, intent, context?.kind);
    const diversified = diversify(ranked, intent);
    const grouped = groupByPage(diversified, query);

    return applyRelevanceThreshold(grouped);
}

export async function handleSearch(
    query: string,
    options: SearchOptions = {},
): Promise<SearchResult[]> {
    const connection = await getDb();

    // Strip question words and expand domain synonyms for BM25, but
    // embed the original query — the vector model understands
    // natural language and paraphrase natively.
    const ftQuery = expandSynonyms(stripQuestionPrefix(query));
    const qvec = await embed(query);

    // The query returns 6 results (5 LET statements + 1 RETURN),
    // we only need the final RETURN value.
    const [_1, _2, _3, _4, _5, hits] = await connection
        .query<[undefined, undefined, undefined, undefined, undefined, RawSearchHit[]]>(
            SEARCH_SQL,
            { query: ftQuery, qvec },
        )
        .collect();

    return rankHits(hits, query, options);
}
