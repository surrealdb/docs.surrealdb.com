# Docs Search

Hybrid search for the SurrealDB documentation. Combines BM25 full-text search
with OpenAI vector embeddings, fused via Reciprocal Rank Fusion (RRF) inside
SurrealDB.

## How it works

### Indexing (build-time)

1. **Compiler** (`plugins/vite-search-index.ts`) runs on every Vite build and
   dev-server start, reading the same `vike-content-collection` store the pages
   render from. It emits two artefacts into `generated/` (gitignored):

   | Artefact                       | Contents                                    |
   | ------------------------------ | ------------------------------------------- |
   | `search-index.json`            | every indexable document and its sections   |
   | `search-routes.json`           | URL prefix → collection label, kind, product |

   Each document carries a **page** record (title, description, breadcrumb,
   ranking kind, full plain text) and one **section** per H2 heading (title,
   breadcrumb, anchor, plain text until the next H2). Anchors come from
   `extractHeadings`, so they match the ids the rendered page assigns.

   Search deliberately does not walk `src/content` itself. It used to, with its
   own markdown AST traversal, and that duplicate pipeline drifted from the site
   twice: it stopped finding H2 headings when the markdown renderer changed
   (sections fell from ~4500 to 7), and its copy of the URL layout went stale
   when the SDK docs moved.

2. **Embedder** (`search/src/embed.ts`) sends each record's text to OpenAI
   `text-embedding-3-small` and receives a 1536-dimensional vector.
3. **Indexer** (`search/scripts/indexer.ts`) reads the compiled index, compares
   content hashes to skip unchanged records, upserts new/changed records with
   their embeddings, and deletes stale records.

Content before the first H2 exists only on the page record, not as a separate
section. Code blocks are excluded from indexed text, as are headings whose only
body is a code block.

### Content-declared metadata

Ranking needs to know what *kind* of documentation a page is, and that is
editorial knowledge about the docs — so it lives in the content tree, in the
`search` block of each collection's root `__category.json`:

```json
{
    "position": 0,
    "title": "Overview",
    "search": { "label": "SurrealQL", "kind": "reference" }
}
```

- **`label`** — the collection's display name, used as the leading breadcrumb
  crumb and indexed as searchable text. Needed because most collections' root
  `__category.json` is titled "Overview": that labels the collection's landing
  section in the sidebar, not the collection itself.
- **`kind`** — the ranking class. Valid values are `SEARCH_KINDS` in
  `src/utils/schema.ts`.
- **`product`** — optional; defaults to the first entry in `PRODUCT_ORDER`.

The build fails if a collection has no `search` block, so adding or renaming a
collection cannot silently degrade ranking. `bun run test` additionally asserts
that every declared kind has a ranking weight and vice versa.

### Querying (runtime)

1. The browser calls `GET /docs/api/search?q=...&product=...&context=...`,
   where `context` is the pathname the search was made from.
2. The Vercel function (`api/search.ts`) canonicalises the query and resolves
   `context` to a coarse token via the compiled route table, then redirects so
   the CDN caches one entry per (query, product, context). The pathname itself
   never reaches the cache key — thousands of distinct pathnames would shard the
   cache per page, while one token per collection is ~19 values.
3. `handleSearch` embeds the query via OpenAI and runs one SurrealQL query
   containing four parallel retrievals — page vector, page full-text, section
   vector, section full-text — fused with `search::rrf`.
4. `rankHits` reranks the fused candidates, diversifies them, groups by page,
   and trims to the relevance threshold.

### Ranking

RRF returns candidates in a narrow score band, so reranking decides the top of
the list. Each candidate's fused score is multiplied by:

| Factor            | Range      | Source                                              |
| ----------------- | ---------- | --------------------------------------------------- |
| Kind authority    | 0.25–1.4   | indexed `doc_kind`, weighted in `src/ranking.ts`    |
| Title match       | 1.0–3.0    | exact / token-prefix / all-tokens-present           |
| Page over section | 1.1        | pages are more comprehensive landing points         |
| Reader's location | 1.12       | `context` token                                     |
| Comparison query  | 1.5        | "X vs Y" mentioning both terms                      |

Title matching ignores singular/plural differences (so "table" matches a page
titled "Tables", as BM25's snowball stemmer already does) and ignores any
language the query names — "rust select" is asking for the `select` method, not
for the page titled "Rust".

The ten SDK collections are ~370 of ~880 SurrealDB pages and document the same
surface ten times with terse titles ("Table", "Select", "Upsert") that
exact-match short queries. Two rules stop them dominating:

- **Authority prior** — SDK pages rank below core docs by default, and above
  everything else once the query names their language (or the reader is in
  that SDK's docs).
- **Diversification** — cross-language copies of one page collapse to the
  best-scoring language, and one language may contribute at most two pages.
  Both are disabled when the query names a language.

`bun run test` covers these rules against synthetic hits.

### Schema

`search/schema.surql` defines:

- **`page`** and **`section`** tables with BM25 full-text indexes (title,
  breadcrumb, description, content, path) and HNSW vector indexes (1536
  dimensions, cosine distance).
- **`doc_kind`**, **`language`**, **`product`**, and **`slug`** on `page`,
  carried from the compiled index and read at query time by the authority prior,
  product scoping, and cross-language deduplication. Sections inherit all four
  through their `page` record link, so ranking never parses a URL.

Full-text scoring weights:

| Field       | Page weight | Section weight |
| ----------- | ----------- | -------------- |
| path        | 15          | —              |
| title       | 25          | 25             |
| breadcrumb  | 10          | 10             |
| description | 8           | —              |
| content     | 3           | 3              |

### Search UI

`src/components/SearchDocs/` renders a Mantine Spotlight overlay (Cmd/Ctrl+K).
Each result card shows:

- Breadcrumb trail (dimmed)
- Title with query highlight
- Content snippet with query highlight
- Section indicator icon (page vs section)
- "+N more results on this page" for grouped hits

Non-production environments (localhost, preview deploys) fall back to the
production search endpoint at `https://surrealdb.com/docs/api/search`.

## Local development

### Prerequisites

- [Bun](https://bun.sh)
- [SurrealDB](https://surrealdb.com/install) (CLI)
- An OpenAI API key

### Setup

1. Copy the example environment file and fill in your OpenAI key:

   ```bash
   cp .env.example .env.local
   # Edit .env.local and set OPENAI_API_KEY
   ```

2. Start a local SurrealDB instance:

   ```bash
   surreal start --user root --pass root
   ```

3. Apply the search schema:

   ```bash
   bun run search:schema
   ```

4. Compile the content index, then index it. The compiler runs as part of any
   Vite invocation, so a build (or a dev server that has started once) is a
   prerequisite:

   ```bash
   bun run build          # writes generated/search-index.json
   bun run search:index   # embeds and upserts it
   ```

5. Start the local search API server:

   ```bash
   bun run search:serve
   ```

   This starts a server on `http://localhost:4322/docs/api/search`. You can test
   it with:

   ```bash
   curl "http://localhost:4322/docs/api/search?q=connect"
   curl "http://localhost:4322/docs/api/search?q=table&context=/docs/reference/python"
   ```

### Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `bun run search:schema`  | Apply `search/schema.surql` to local SurrealDB |
| `bun run search:index`   | Embed the compiled index and upsert into SurrealDB |
| `bun run search:serve`   | Start local search API on port 4322            |
| `bun run test`           | Run ranking and route-table tests (no DB needed) |

### Re-indexing

The indexer is incremental — it computes a SHA-256 hash of each record's
content and skips records that haven't changed. Only new or modified pages and
sections are re-embedded and upserted. Deleted pages are cleaned up
automatically.

The hash mixes in `EMBED_VERSION` (`search/scripts/indexer.ts`). Bump it whenever
the indexed text changes shape — embedding model, truncation limit, embed-text
structure, breadcrumb format — so every record is treated as changed and
re-embedded once.

Removing a field from `schema.surql` needs care: `DEFINE FIELD OVERWRITE` only
touches fields the schema still declares, so a dropped non-optional field lingers
in the database and rejects every upsert. Remove it explicitly, or recreate the
tables.

## Production

On Vercel production builds, `bun run search:index` runs automatically as a
`postbuild` step. Preview and development builds skip indexing and fall back to
the production search API.

### Environment variables (Vercel project settings)

| Variable              | Description                             |
| --------------------- | --------------------------------------- |
| `SURREAL_ENDPOINT`    | SurrealDB WebSocket URL                 |
| `SURREAL_NAMESPACE`   | SurrealDB namespace                     |
| `SURREAL_DATABASE`    | SurrealDB database                      |
| `SURREAL_USERNAME`    | SurrealDB username (root or scoped)     |
| `SURREAL_PASSWORD`    | SurrealDB password                      |
| `OPENAI_API_KEY`      | OpenAI API key for embeddings           |

## File structure

```
search/
├── schema.surql        # SurrealDB tables and indexes
├── src/
│   ├── types.ts        # Compiled-index and search-result types
│   ├── ranking.ts      # Ranking policy: kind weights, language aliases
│   ├── routes.ts       # Pathname → context token, over the compiled route table
│   ├── embed.ts        # OpenAI text-embedding-3-small wrapper
│   ├── db.ts           # SurrealDB connection
│   ├── handler.ts      # Retrieval + reranking (Vercel fn + local server)
│   └── *.test.ts       # Ranking and route-table tests
└── scripts/
    ├── indexer.ts      # Incremental upsert from the compiled index
    └── schema.ts       # Apply schema to SurrealDB

plugins/
└── vite-search-index.ts  # Compiles generated/search-{index,routes}.json

api/
└── search.ts       # Vercel serverless function

scripts/
├── index-search.ts   # Build-time / local indexer entry point
└── search-serve.ts   # Local dev search server (Bun.serve)
```

## Where to change what

| To change…                                   | Edit                                            |
| -------------------------------------------- | ----------------------------------------------- |
| A collection's label or ranking class         | its root `__category.json`                      |
| How much a ranking class is worth             | `KIND_AUTHORITY` in `src/ranking.ts`            |
| Language aliases ("js" → javascript)          | `LANGUAGE_ALIASES` in `src/ranking.ts`          |
| Which URL prefix a collection serves          | `src/utils/routes.ts` (mirrors `+data.ts`)      |
| What text gets indexed                        | `plugins/vite-search-index.ts`                  |
| BM25 field weights or retrieval limits        | `SEARCH_SQL` in `src/handler.ts`                |
