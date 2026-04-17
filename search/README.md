# Docs Search

Hybrid search for the SurrealDB documentation. Combines BM25 full-text search
with OpenAI vector embeddings, fused via Reciprocal Rank Fusion (RRF) inside
SurrealDB.

## How it works

### Indexing (build-time)

1. **Crawler plugin** (`search/plugin/index.ts` + `search/plugin/crawl.ts`) is
   registered as a Vite plugin. It runs after `vike-content-collection` has
   parsed every `+Content.ts` collection and reads the already-validated
   entries via `getCollection()` / `getCollectionEntry()`. For each entry it
   yields two kinds of records:
   - **Page** — one per document (title, description, breadcrumb, full plain
     text).
   - **Section** — one per H2 heading within a page (title, breadcrumb, plain
     text until the next H2). Links to the parent page via `#anchor`.
   The plugin writes the resulting array to
   `.vike-content-collection/search-crawl.json` during `closeBundle`.
2. **Embedder** (`search/src/embed.ts`) sends each record's text to OpenAI
   `text-embedding-3-small` and receives a 1536-dimensional vector.
3. **Indexer** (`search/scripts/indexer.ts`) reads
   `search-crawl.json`, connects to SurrealDB, compares content hashes to skip
   unchanged records, upserts new/changed records with their embeddings, and
   deletes stale records.

Content before the first H2 exists only on the page record, not as a separate
section. Code blocks are excluded from indexed text.

Breadcrumbs combine the Title-Cased collection ID, each subdirectory's
`__category` entry title (resolved via `vike-content-collection`), and the page
title — matching what the runtime layout (`src/utils/data.ts`) renders.

### Querying (runtime)

1. The browser calls `GET /docs/api/search?q=...`.
2. The Vercel function (`api/search.ts`) embeds the query via OpenAI.
3. It passes both the raw query string and the vector to `fn::search` in
   SurrealDB.
4. `fn::search` runs four parallel retrievals — page vector, page full-text,
   section vector, section full-text — then fuses them with RRF, collapses by
   page, and returns grouped results.

### Schema

`search/schema.surql` defines:

- **`page`** and **`section`** tables with BM25 full-text indexes (title,
  breadcrumb, description, content, path) and HNSW vector indexes (1536
  dimensions, cosine distance).

Full-text scoring weights:

| Field       | Page weight | Section weight |
| ----------- | ----------- | -------------- |
| path        | 15          | —              |
| title       | 25          | 25             |
| breadcrumb  | 10          | 10             |
| description | 8           | —              |
| content     | 1           | 1              |

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

4. Build the docs (this also runs the crawler plugin and the indexer via the
   `postbuild` step):

   ```bash
   bun run build
   ```

   Or, if you've already built once and just want to re-run the indexer
   against the existing crawl artefact:

   ```bash
   bun run search:index
   ```

5. Start the local search API server:

   ```bash
   bun run search:serve
   ```

   This starts a server on `http://localhost:4322/api/search`. You can test it
   with:

   ```bash
   curl "http://localhost:4322/api/search?q=connect"
   ```

### Commands

| Command                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| `bun run search:schema`  | Apply `search/schema.surql` to local SurrealDB               |
| `bun run search:index`   | Read the latest crawl artefact and upsert into SurrealDB     |
| `bun run search:serve`   | Start local search API on port 4322                          |

The crawl artefact itself (`.vike-content-collection/search-crawl.json`) is
produced by `vike build` via the `docs-search-crawler` Vite plugin.

### Re-indexing

The indexer is incremental — it computes a SHA-256 hash of each record's
content and skips records that haven't changed. Only new or modified pages and
sections are re-embedded and upserted. Deleted pages are cleaned up
automatically.

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
├── schema.surql           # SurrealDB tables, indexes, fn::search
├── plugin/
│   ├── index.ts           # Vite plugin that emits search-crawl.json
│   └── crawl.ts           # Pure markdown → page + section transform
├── src/
│   ├── types.ts           # CrawledPage, CrawledSection, SearchResult
│   ├── embed.ts           # OpenAI text-embedding-3-small wrapper
│   ├── handler.ts         # Shared search handler (Vercel fn + local server)
│   ├── db.ts              # SurrealDB connection helpers
│   └── index.ts           # Common exports for @surrealdb/docs-search-common
└── scripts/
    ├── schema.ts          # Apply schema to SurrealDB
    └── indexer.ts         # Reads crawl artefact, embeds, upserts

api/
└── search.ts              # Vercel serverless function

scripts/
├── index-search.ts        # Indexer entry point (postbuild)
└── search-serve.ts        # Local dev search server (Bun.serve)
```
