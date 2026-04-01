// ══════════════════════════════════════════════════════════
// Search handler — hybrid retrieval + post-processing
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
//   5. Apply post-retrieval boosts (title match, collection, etc.)
//   6. Group hits by page and extract snippets
//   7. Apply relevance threshold to trim noise
// ══════════════════════════════════════════════════════════

import { getDb } from "./db";
import { embed } from "./embed";
import type { RawSearchHit, SearchResult, SearchResultItem } from "./types";

export const MAX_QUERY_LENGTH = 500;

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
    -- Finds the 30 pages whose embeddings are closest to the
    -- query embedding. The <|30,100|> syntax means: return 30
    -- neighbours, exploring up to 100 candidates in the HNSW
    -- graph (higher = more accurate but slower).
    LET $page_vs = (
        SELECT
            id,
            "page" AS kind,
            path AS url,
            path AS page_path,
            collection,
            title,
            breadcrumb,
            description,
            content,
            vector::distance::knn() AS distance
        FROM page
        WHERE embedding <|30,100|> $qvec
        ORDER BY distance ASC
        LIMIT 30
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
        LIMIT 30
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
            title,
            breadcrumb,
            content,
            vector::distance::knn() AS distance
        FROM section
        WHERE embedding <|30,100|> $qvec
        ORDER BY distance ASC
        LIMIT 30
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
        LIMIT 30
    );

    -- ── Reciprocal Rank Fusion ──
    -- Combines the four ranked lists into a single ranking.
    -- RRF scores each result as: sum(1 / (k + rank_in_list))
    -- across all lists the result appears in.
    --   arg 1: array of ranked lists to fuse
    --   arg 2: k=60 (smoothing constant, standard RRF default)
    --   arg 3: limit=80 (max candidates to consider)
    LET $fused = search::rrf([$page_ft, $page_vs, $section_ft, $section_vs], 60, 80);

    RETURN (
        SELECT
            kind,
            url,
            page_path,
            collection,
            title,
            breadcrumb,
            description,
            content,
            rrf_score AS score
        FROM $fused
        LIMIT 60
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
    return shorter.every((token, i) => longer[i] === token);
}

// ──────────────────────────────────────────────────────────
// Post-retrieval boosting
//
// After RRF fusion, we apply multiplicative boosts to adjust
// rankings based on signals the database query can't capture:
// title similarity, content type (page vs section), source
// collection, and comparison-query detection.
// ──────────────────────────────────────────────────────────

/**
 * Non-SDK doc collections get a small ranking boost because
 * generic queries like "authentication" should prefer the
 * core concept page over an SDK API reference page that
 * happens to mention auth as one of many methods.
 */
const CORE_COLLECTIONS = new Set([
    "doc-surrealdb",
    "doc-surrealql",
    "doc-tutorials",
    "doc-cloud",
    "doc-surrealist",
    "doc-surrealml",
    "doc-surrealkv",
    "doc-integrations",
]);

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

function boostResults(hits: RawSearchHit[], query: string): RawSearchHit[] {
    const q = normalise(query);
    const qTokens = tokenise(query);
    const comparison = extractComparisonTerms(query);

    const boosted = hits.map((hit) => {
        const t = normalise(hit.title || "");
        const tTokens = tokenise(hit.title || "");
        let boost = 1.0;

        // Title relevance boost (mutually exclusive tiers):
        //   3.0x — exact title match (e.g. query "RELATE" → title "RELATE")
        //   2.0x — token prefix (e.g. query "SELECT statement" → title "SELECT")
        //   1.5x — all query tokens appear in title as substrings
        if (t === q) {
            boost = 3.0;
        } else if (isTokenPrefix(tTokens, qTokens) || isTokenPrefix(qTokens, tTokens)) {
            boost = 2.0;
        } else if (qTokens.length > 1 && qTokens.every((w) => t.includes(w))) {
            boost = 1.5;
        }

        // Slight preference for page-level results over sections,
        // since pages are more comprehensive landing points.
        if (hit.kind === "page") {
            boost *= 1.1;
        }

        // Prefer core docs over SDK API reference pages for
        // general queries. SDK-specific queries still rank well
        // because they'll have stronger BM25/vector base scores.
        if (hit.collection && CORE_COLLECTIONS.has(hit.collection)) {
            boost *= 1.15;
        }

        // For comparison queries ("X vs Y"), boost results whose
        // title or content mentions both compared terms.
        if (comparison) {
            const searchable = `${t} ${normalise(hit.content || "")}`;
            if (comparison.every((term) => searchable.includes(term))) {
                boost *= 1.5;
            }
        }

        return { ...hit, score: hit.score * boost };
    });

    return boosted.sort((a, b) => b.score - a.score);
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
    q = q.replace(/[?.!]+$/, "");
    q = stripQuestionPrefix(q);
    return q.trim();
}

// ──────────────────────────────────────────────────────────
// Relevance threshold
//
// Without a cutoff, every query returns 30-50 grouped results
// because vector search always finds "something close". We
// drop results scoring below 30% of the top hit and cap at 20
// groups so the UI isn't flooded with marginal matches.
// ──────────────────────────────────────────────────────────

const MAX_GROUPED_RESULTS = 20;
const MIN_SCORE_RATIO = 0.3;

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
// ──────────────────────────────────────────────────────────

export async function handleSearch(query: string): Promise<SearchResult[]> {
    const connection = await getDb();

    // Strip question words for BM25 but embed the original
    // query — the vector model understands natural language.
    const ftQuery = stripQuestionPrefix(query);
    const qvec = await embed(query);

    // The query returns 6 results (5 LET statements + 1 RETURN),
    // we only need the final RETURN value.
    const [_1, _2, _3, _4, _5, hits] = await connection
        .query<[undefined, undefined, undefined, undefined, undefined, RawSearchHit[]]>(
            SEARCH_SQL,
            { query: ftQuery, qvec },
        )
        .collect();

    const boosted = boostResults(hits, query);
    const grouped = groupByPage(boosted, query);
    return applyRelevanceThreshold(grouped);
}
