-- ============================================================
-- Search schema: page + section with hybrid search
-- ============================================================

DEFINE ANALYZER OVERWRITE simple
    TOKENIZERS blank, class, camel, punct
    FILTERS snowball(english);

-- ────────────────────────────────────────────────────────────
-- PAGE table
-- ────────────────────────────────────────────────────────────

DEFINE TABLE OVERWRITE page SCHEMAFULL;

DEFINE FIELD OVERWRITE path         ON page TYPE string;
DEFINE FIELD OVERWRITE collection   ON page TYPE string;
DEFINE FIELD OVERWRITE title        ON page TYPE string;
DEFINE FIELD OVERWRITE description  ON page TYPE string;
DEFINE FIELD OVERWRITE breadcrumb   ON page TYPE string;
DEFINE FIELD OVERWRITE content      ON page TYPE string;
DEFINE FIELD OVERWRITE content_hash ON page TYPE string;
DEFINE FIELD OVERWRITE embedding    ON page TYPE array<float>;
DEFINE FIELD OVERWRITE date         ON page TYPE datetime DEFAULT time::now();

DEFINE INDEX OVERWRITE page_collection   ON page FIELDS collection CONCURRENTLY;
DEFINE INDEX OVERWRITE page_path_unique  ON page FIELDS path UNIQUE CONCURRENTLY;

DEFINE INDEX OVERWRITE page_ft_title       ON page FIELDS title       FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_breadcrumb  ON page FIELDS breadcrumb  FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_description ON page FIELDS description FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_content     ON page FIELDS content     FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_ft_path        ON page FIELDS path        FULLTEXT ANALYZER simple BM25(1.2, 0.75) CONCURRENTLY;

DEFINE INDEX OVERWRITE page_embedding_hnsw ON page FIELDS embedding
    HNSW DIMENSION 1536 DIST COSINE CONCURRENTLY;

-- ────────────────────────────────────────────────────────────
-- SECTION table
-- ────────────────────────────────────────────────────────────

DEFINE TABLE OVERWRITE section SCHEMAFULL;

DEFINE FIELD OVERWRITE page         ON section TYPE record<page>
    REFERENCE ON DELETE CASCADE;
DEFINE FIELD OVERWRITE anchor       ON section TYPE string;
DEFINE FIELD OVERWRITE depth        ON section TYPE int;
DEFINE FIELD OVERWRITE title        ON section TYPE string;
DEFINE FIELD OVERWRITE breadcrumb   ON section TYPE string;
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
