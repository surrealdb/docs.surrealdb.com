# Docs Search

Hybrid search for the SurrealDB documentation. Combines BM25 full-text search
with OpenAI vector embeddings, fused via Reciprocal Rank Fusion (RRF) inside
SurrealDB.

## How it works

### Indexing (build-time)

1. **Crawler** (`search/scripts/crawler.ts`) walks every markdown file in
   `src/content/`, parses frontmatter and body, then yields two kinds of
   records:
   - **Page** — one per document (title, description, breadcrumb, full plain
     text).
   - **Section** — one per H2 heading within a page (title, breadcrumb, plain
     text until the next H2). Links to the parent page via `#anchor`.
2. **Embedder** (`search/src/embed.ts`) sends each record's text to OpenAI
   `text-embedding-3-small` and receives a 1536-dimensional vector.
3. **Indexer** (`search/scripts/indexer.ts`) connects to SurrealDB, compares content
   hashes to skip unchanged records, upserts new/changed records with their
   embeddings, and deletes stale records.

Content before the first H2 exists only on the page record, not as a separate
section. Code blocks are excluded from indexed text.

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

4. Crawl and index all content:

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

| Command                 | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `bun run search:schema` | Apply `search/schema.surql` to local SurrealDB |
| `bun run search:index`  | Crawl content and upsert into SurrealDB        |
| `bun run search:serve`  | Start local search API on port 4322            |

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

| Variable            | Description                         |
| ------------------- | ----------------------------------- |
| `SURREAL_ENDPOINT`  | SurrealDB WebSocket URL             |
| `SURREAL_NAMESPACE` | SurrealDB namespace                 |
| `SURREAL_DATABASE`  | SurrealDB database                  |
| `SURREAL_USERNAME`  | SurrealDB username (root or scoped) |
| `SURREAL_PASSWORD`  | SurrealDB password                  |
| `OPENAI_API_KEY`    | OpenAI API key for embeddings       |

## File structure

```
search/
├── schema.surql    # SurrealDB tables, indexes, fn::search
├── types.ts        # CrawledPage, CrawledSection, SearchResult
├── crawler.ts      # Markdown → page + section records
├── embed.ts        # OpenAI text-embedding-3-small wrapper
├── indexer.ts      # Incremental upsert into SurrealDB
└── handler.ts      # Shared search handler (Vercel fn + local server)

api/
└── search.ts       # Vercel serverless function

scripts/
├── index-search.ts   # Build-time / local indexer entry point
├── search-schema.ts  # Apply schema to SurrealDB
└── search-serve.ts   # Local dev search server (Bun.serve)
```
