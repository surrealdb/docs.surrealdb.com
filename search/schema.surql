-- ============================================================
-- Search schema: page + section with hybrid search
--
-- The search system uses two complementary retrieval strategies:
--
--   1. BM25 full-text search - lexical matching via tokenised
--      inverted indexes. Good for exact keyword matches
--      (e.g. "DEFINE TABLE", "array::group").
--
--   2. HNSW vector search - semantic similarity via OpenAI
--      embeddings. Good for natural-language queries where the
--      user's phrasing differs from the docs wording
--      (e.g. "how to join tables" → record links / RELATE).
--
-- Results from both strategies are fused with Reciprocal Rank
-- Fusion (search::rrf) at query time in handler.ts.
-- ============================================================

-- Tokeniser chain: split on whitespace (blank), unicode class
-- boundaries (class), camelCase transitions (camel), and
-- punctuation (punct). Filters run in order: ascii folds accented
-- characters to their plain form ("café" → "cafe") so accented
-- input still matches, then snowball(english) stems tokens
-- ("running" → "run", "tables" → "tabl") so morphological variants
-- match each other.
--
-- NOTE: changing this analyzer only takes effect once the schema is
-- re-applied (`bun run search:schema`) AND records are re-indexed so
-- the full-text indexes are rebuilt with the new token stream.
DEFINE ANALYZER OVERWRITE simple
    TOKENIZERS blank, class, camel, punct
    FILTERS ascii, snowball(english);

-- ────────────────────────────────────────────────────────────
-- PAGE table
--
-- One record per markdown file. Stores the full plain-text
-- content (code blocks excluded), metadata for display, and
-- an embedding vector for semantic search.
-- ────────────────────────────────────────────────────────────

DEFINE TABLE OVERWRITE page SCHEMAFULL;

DEFINE FIELD OVERWRITE path         ON page TYPE string;
DEFINE FIELD OVERWRITE collection   ON page TYPE string;  -- e.g. "doc-surrealql", "doc-sdk-javascript"
DEFINE FIELD OVERWRITE title        ON page TYPE string;
DEFINE FIELD OVERWRITE description  ON page TYPE string;
DEFINE FIELD OVERWRITE breadcrumb   ON page TYPE string;  -- "SurrealQL > Statements > SELECT"
DEFINE FIELD OVERWRITE content      ON page TYPE string;  -- plain text, no code blocks
DEFINE FIELD OVERWRITE content_hash ON page TYPE string;  -- SHA-256 of title+breadcrumb+description+content for incremental indexing
DEFINE FIELD OVERWRITE embedding    ON page TYPE array<float>;  -- 1536-dim OpenAI text-embedding-3-small
DEFINE FIELD OVERWRITE date         ON page TYPE datetime DEFAULT time::now();

DEFINE INDEX OVERWRITE page_collection   ON page FIELDS collection CONCURRENTLY;
DEFINE INDEX OVERWRITE page_path_unique  ON page FIELDS path UNIQUE CONCURRENTLY;

-- BM25 full-text indexes, one per searchable field.
-- Each uses the same analyzer and BM25 parameters:
--   k1=1.2 controls term-frequency saturation (higher = more weight to repeated terms)
--   b=0.75 controls document-length normalisation (higher = more penalty for long docs)
-- These are standard BM25 defaults that work well for documentation.
DEFINE INDEX OVERWRITE page_ft_title       ON page FIELDS title       FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_breadcrumb  ON page FIELDS breadcrumb  FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_description ON page FIELDS description FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_content     ON page FIELDS content     FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_path        ON page FIELDS path        FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;

-- HNSW index for approximate nearest-neighbour vector search.
-- Dimension 1536 matches OpenAI text-embedding-3-small output.
-- Cosine distance is the standard metric for normalised text embeddings.
DEFINE INDEX OVERWRITE page_embedding_hnsw ON page FIELDS embedding
    HNSW DIMENSION 1536 DIST COSINE CONCURRENTLY;

-- ────────────────────────────────────────────────────────────
-- SECTION table
--
-- One record per H2 section within a page. Allows search to
-- deep-link to specific sections and rank section-level
-- content independently from the full page.
-- ────────────────────────────────────────────────────────────

DEFINE TABLE OVERWRITE section SCHEMAFULL;

-- Cascade-delete sections when the parent page is removed.
DEFINE FIELD OVERWRITE page         ON section TYPE record<page>
    REFERENCE ON DELETE CASCADE;
DEFINE FIELD OVERWRITE anchor       ON section TYPE string;  -- URL fragment, e.g. "record-ranges"
DEFINE FIELD OVERWRITE depth        ON section TYPE int;     -- heading depth (always 2 for now)
DEFINE FIELD OVERWRITE title        ON section TYPE string;
DEFINE FIELD OVERWRITE breadcrumb   ON section TYPE string;  -- page breadcrumb + " > " + section title
DEFINE FIELD OVERWRITE content      ON section TYPE string;
DEFINE FIELD OVERWRITE content_hash ON section TYPE string;
DEFINE FIELD OVERWRITE embedding    ON section TYPE array<float>;
DEFINE FIELD OVERWRITE date         ON section TYPE datetime DEFAULT time::now();

DEFINE INDEX OVERWRITE section_page   ON section FIELDS page CONCURRENTLY;
DEFINE INDEX OVERWRITE section_anchor ON section FIELDS page, anchor UNIQUE CONCURRENTLY;

DEFINE INDEX OVERWRITE section_ft_title      ON section FIELDS title      FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE section_ft_breadcrumb ON section FIELDS breadcrumb FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE section_ft_content    ON section FIELDS content    FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;

DEFINE INDEX OVERWRITE section_embedding_hnsw ON section FIELDS embedding
    HNSW DIMENSION 1536 DIST COSINE CONCURRENTLY;

-- ────────────────────────────────────────────────────────────
-- PAGE FEEDBACK table
--
-- One record per submission of the "Was this page helpful?"
-- widget. Deliberately minimal: the page, the verdict, the
-- reader's chosen reasons and optional comment, and when.
-- No IP address, user agent or identifier is stored.
-- ────────────────────────────────────────────────────────────

DEFINE TABLE OVERWRITE page_feedback SCHEMAFULL;

DEFINE FIELD OVERWRITE path      ON page_feedback TYPE string
    ASSERT string::starts_with($value, "/") AND string::len($value) <= 300;
DEFINE FIELD OVERWRITE sentiment ON page_feedback TYPE string
    ASSERT $value IN ["helpful", "not-helpful"];
DEFINE FIELD OVERWRITE reasons   ON page_feedback TYPE array<string>
    ASSERT array::len($value) <= 8;
DEFINE FIELD OVERWRITE comment   ON page_feedback TYPE string
    ASSERT string::len($value) <= 2000;
DEFINE FIELD OVERWRITE date      ON page_feedback TYPE datetime DEFAULT time::now();

DEFINE INDEX OVERWRITE page_feedback_path ON page_feedback FIELDS path CONCURRENTLY;

-- ────────────────────────────────────────────────────────────
-- SEARCH MISS table
--
-- One record per zero-result search, written by the search API.
-- The cheapest missing-content signal there is: these are the
-- exact words readers used when the docs failed them. Client
-- analytics cannot be relied on for this (docs pages carry no
-- tag manager), so the API records it at the source.
-- ────────────────────────────────────────────────────────────

DEFINE TABLE OVERWRITE search_miss SCHEMAFULL;

DEFINE FIELD OVERWRITE query   ON search_miss TYPE string
    ASSERT string::len($value) <= 200;
DEFINE FIELD OVERWRITE product ON search_miss TYPE string;
DEFINE FIELD OVERWRITE date    ON search_miss TYPE datetime DEFAULT time::now();

DEFINE INDEX OVERWRITE search_miss_query ON search_miss FIELDS query CONCURRENTLY;

-- ────────────────────────────────────────────────────────────
-- LINKS edge
--
-- One relation per internal link, from the page that holds the
-- link to the page it points at. A graph edge rather than an
-- array of record links on `page`, because the metadata below
-- belongs to the link itself: the same two pages can be joined
-- by a prominent card and by a passing mention halfway down a
-- long page, and those are not equally findable.
--
-- `offset_ratio` and `first_screen` measure where the link sits
-- in its source page, which is the effort a reader spends before
-- seeing it. Weigh them for prose only: the last row of a long
-- reference table always scores badly and is perfectly usable,
-- because a reader on that page is scanning the table already.
--
-- The queries the graph exists to answer. They live here because
-- nothing in the codebase runs them - the scripts populate the
-- table, and the questions are asked by hand afterwards.
--
-- Hardest pages to reach. `weight` is the effort of one link, so
-- a page's cheapest route in is the minimum over its inbound
-- edges. Project `out`, not `out.id()`: under GROUP BY the latter
-- collects into an array instead of a scalar.
--
--     SELECT out, math::min(weight) AS effort, count() AS inbound
--     FROM links GROUP BY out ORDER BY effort DESC;
--
-- Pages with no contextual route in: reachable by search or by a
-- guessed URL, but never linked to from anywhere. Expect exactly
-- one row, the docs homepage, being the graph's root.
--
--     SELECT VALUE id.id() FROM page WHERE array::len(<-links) = 0;
--
-- Whether one page reaches another, and by what route. The
-- traversal returns the path itself, start excluded and
-- destination last, or NONE when nothing connects the two. NONE
-- is what an island looks like: react-native and expo linked to
-- each other and to nothing else until this turned them up.
--
--     page:⟨index:index⟩.{..+shortest=page:⟨index:frameworks/expo⟩}(->links->page);
-- ────────────────────────────────────────────────────────────

DEFINE TABLE OVERWRITE links TYPE RELATION IN page OUT page SCHEMAFULL;

DEFINE FIELD OVERWRITE text         ON links TYPE string;   -- the link's visible text
DEFINE FIELD OVERWRITE kind         ON links TYPE "prose" | "card" | "table" | "list";
DEFINE FIELD OVERWRITE offset_ratio ON links TYPE float;    -- 0.0 at the top of the page, 1.0 at the end
DEFINE FIELD OVERWRITE offset_chars ON links TYPE int;      -- characters from the top, which the ratio alone cannot give
DEFINE FIELD OVERWRITE first_screen ON links TYPE bool;     -- within the first screenful of the page
DEFINE FIELD OVERWRITE anchor       ON links TYPE option<string>;  -- fragment, when the link targets a section
DEFINE FIELD OVERWRITE date         ON links TYPE datetime DEFAULT time::now();

-- Effort to notice this link, lowest is easiest. A card or a list entry is
-- navigation the reader is already scanning; a table row is a reference entry;
-- a prose link depends on having read the surrounding sentence, and costs more
-- the further down the page it sits. Set by search/scripts/links.ts so the
-- formula lives in one place and `math::min(weight)` gives a page's cheapest
-- route in.
DEFINE FIELD OVERWRITE weight       ON links TYPE float;

-- "Which pages link here" is the question this table exists to answer.
DEFINE INDEX OVERWRITE links_out ON links FIELDS out CONCURRENTLY;
DEFINE INDEX OVERWRITE links_kind ON links FIELDS kind CONCURRENTLY;
