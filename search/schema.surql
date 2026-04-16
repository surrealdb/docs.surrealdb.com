-- ============================================================
-- Search schema: page + section with hybrid search
--
-- The search system uses two complementary retrieval strategies:
--
--   1. BM25 full-text search — lexical matching via tokenised
--      inverted indexes. Good for exact keyword matches
--      (e.g. "DEFINE TABLE", "array::group").
--
--   2. HNSW vector search — semantic similarity via OpenAI
--      embeddings. Good for natural-language queries where the
--      user's phrasing differs from the docs wording
--      (e.g. "how to join tables" → record links / RELATE).
--
-- Results from both strategies are fused with Reciprocal Rank
-- Fusion (search::rrf) at query time in handler.ts.
-- ============================================================

-- Tokeniser chain: split on whitespace (blank), unicode class
-- boundaries (class), camelCase transitions (camel), and
-- punctuation (punct). The snowball(english) filter then stems
-- tokens ("running" → "run", "tables" → "tabl") so that
-- morphological variants match each other.
DEFINE ANALYZER OVERWRITE simple
    TOKENIZERS blank, class, camel, punct
    FILTERS snowball(english);

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
