# Content collections

Managed by vike-content-collection. Schemas and slug logic live in `config.ts`.

## Adding content

1. Create a `.md` file in the appropriate collection folder (e.g. `doc-surrealdb/`, `doc-cloud/`).
2. Add YAML frontmatter matching the collection schema.
3. Use `sidebar_position` in frontmatter and `_category_.json` files for sidebar ordering.

## Schemas (in `config.ts`)

- **`abstractDoc`** — `title`, `description`, `sidebar_position`, `sidebar_label`, `no_page_headings`, `no_sidebar` (all optional)
- **`labCollection`** — `title` (required), `url`, `category`, `author`, `topics`, `languages`

## Adding a new collection

When adding a new doc collection you **must** also update redirect logic in `aws/viewer-request/index.js`.

## Content conventions

- Use British English spelling throughout.
- Capitalise product names correctly: **SurrealDB**, **SurrealQL**, **SurrealKV**, **Surrealist**, **SurrealML**, **SurrealAI**.
- Use sentence case for headings.
- Use the Oxford comma.
