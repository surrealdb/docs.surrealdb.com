DEFINE TABLE OVERWRITE page SCHEMALESS PERMISSIONS FOR select FULL;
DEFINE ANALYZER OVERWRITE simple TOKENIZERS blank,class,camel,punct FILTERS snowball(english);
DEFINE INDEX OVERWRITE page_hostname ON page FIELDS hostname;
DEFINE INDEX OVERWRITE page_date_indexed ON page FIELDS date;
DEFINE INDEX OVERWRITE unique_page ON page FIELDS hostname, path UNIQUE;
DEFINE INDEX OVERWRITE page_title ON page FIELDS title FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_description ON page FIELDS description FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_path ON page FIELDS path FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_h1 ON page FIELDS h1 FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_h2 ON page FIELDS h2 FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_h3 ON page FIELDS h3 FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_h4 ON page FIELDS h4 FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_content ON page FIELDS content FULLTEXT ANALYZER simple BM25(1.2,0.75) HIGHLIGHTS;
DEFINE INDEX OVERWRITE page_code ON page FIELDS code FULLTEXT ANALYZER simple BM25(1.2,0.75);
DEFINE INDEX OVERWRITE page_embedding_hnsw ON TABLE page FIELDS embedding HNSW DIMENSION 768 DIST COSINE;

DEFINE FUNCTION OVERWRITE fn::search($hostname: string, $query: string, $qvec: array<float>) {

-- Vector search candidates (bigger than final limit so RRF has room)
  LET $vs = (
    SELECT
      id,
      path as url,
      hostname,
      title,
      description,
      content,
      vector::distance::knn() AS distance
    FROM page
    WHERE
      hostname = $hostname
      AND embedding <|50,100|> $qvec
    ORDER BY distance ASC
    LIMIT 50
  );

  -- Full-text candidates
  LET $ft = (
    SELECT
      id,
      path as url,
      hostname,
      title,
      description,
      content,
      search::offsets(8) AS offsets,
      (
          (search::score(0) * 11)
        + (search::score(1) * 10)
        + (search::score(2) * 9)
        + (search::score(3) * 7)
        + (search::score(4) * 6)
        + (search::score(5) * 5)
        + (search::score(6) * 4)
        + (search::score(7) * 2)
        + search::score(8)
      ) AS ft_score
    FROM page
      WITH INDEX page_hostname
    WHERE
      hostname = $hostname
      AND (
        title @0@ $query
        OR path @1@ $query
        OR description @2@ $query
        OR h1 @3@ $query
        OR h2 @4@ $query
        OR h3 @5@ $query
        OR h4 @6@ $query
        OR code @7@ $query
        OR content @8@ $query
      )
    ORDER BY ft_score DESC
    LIMIT 50
  );

  -- Fuse them. rrf keeps fields from the first non-null it sees,
  -- put $ft first so offsets/highlights “wins”.
  RETURN search::rrf([$ft, $vs], 10, 60);
}