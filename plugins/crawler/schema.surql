DEFINE TABLE OVERWRITE page SCHEMALESS PERMISSIONS FOR select FULL;
DEFINE ANALYZER OVERWRITE simple TOKENIZERS blank,class,camel,punct FILTERS snowball(english);
DEFINE INDEX OVERWRITE page_hostname ON page FIELDS hostname CONCURRENTLY;
DEFINE INDEX OVERWRITE page_date_indexed ON page FIELDS date CONCURRENTLY;
DEFINE INDEX OVERWRITE unique_page ON page FIELDS hostname, path UNIQUE CONCURRENTLY;
DEFINE INDEX OVERWRITE page_title ON page FIELDS title SEARCH ANALYZER simple BM25(1.2,0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_path ON page FIELDS path SEARCH ANALYZER simple BM25(1.2,0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_h1 ON page FIELDS h1 SEARCH ANALYZER simple BM25(1.2,0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_h2 ON page FIELDS h2 SEARCH ANALYZER simple BM25(1.2,0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_h3 ON page FIELDS h3 SEARCH ANALYZER simple BM25(1.2,0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_h4 ON page FIELDS h4 SEARCH ANALYZER simple BM25(1.2,0.75) CONCURRENTLY;
DEFINE INDEX OVERWRITE page_content ON page FIELDS content SEARCH ANALYZER simple BM25(1.2,0.75) HIGHLIGHTS CONCURRENTLY;
DEFINE INDEX OVERWRITE page_code ON page FIELDS code SEARCH ANALYZER simple BM25(1.2,0.75) CONCURRENTLY;

DEFINE FUNCTION OVERWRITE fn::search($hostname: string, $query: string) {
    RETURN SELECT
        path as url,
        hostname,
        title,
        content,
        search::offsets(7) AS offsets,
        (
                (search::score(0) * 10)
            + (search::score(1) * 9)
            + (search::score(2) * 7)
            + (search::score(3) * 6)
            + (search::score(4) * 5)
            + (search::score(5) * 4)
            + (search::score(6) * 2)
            + search::score(7)
        ) AS score
    FROM page
        WITH INDEX page_hostname
        WHERE
            hostname = $hostname
            AND (
                title @0@ $query
                OR path @1@ $query
                OR h1 @2@ $query
                OR h2 @3@ $query
                OR h3 @4@ $query
                OR h4 @5@ $query
                OR code @6@ $query
                OR content @7@ $query
            )
    ORDER BY score DESC LIMIT 10;
}