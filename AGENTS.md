# SurrealDB Docs

Documentation site for SurrealDB, built with Vike (React), Vite, Mantine v8,
`@surrealdb/ui`, and SCSS modules. Content is managed with
vike-content-collection (Zod-validated markdown collections).

## Commands

```bash
bun run dev   # start dev server
bun run qa    # apply code quality formatting
bun run qc    # check code quality
```

Always run `bun run qa` then `bun run qc` before finishing any task.

## References

- [Mantine](https://mantine.dev/llms.txt): UI
- [Vike](https://vike.dev/llms.txt): Framework
- [Vite](https://vite.dev/llms.txt): Build tool
- [Auth0](https://auth0.com/llms.txt): Authentication
- [vike-content-collection](https://raw.githubusercontent.com/welpie21/vike-content-collection/refs/heads/main/llms-full.txt): Content Collection API

## Code conventions

### SOLID principles

Apply SOLID where it fits:

- **Single Responsibility** — one reason to change per module, component, or function.
- **Open/Closed** — extend through composition and props, not by modifying existing code.
- **Liskov Substitution** — interchangeable components must not break consumers.
- **Interface Segregation** — focused prop interfaces and types; avoid catch-all types.
- **Dependency Inversion** — depend on abstractions (types, interfaces, callbacks).

### UI and components

- Prefer Mantine (`@mantine/core`) and `@surrealdb/ui` before creating new components.
- Use `<Box>` instead of `<div>`. Semantic elements: `<Box component="section|nav|main|footer">`.
- Use `<Anchor>` instead of `<a>`.
- Prefer Mantine styling props (`mt`, `fz`, `gap`, `display`) over custom CSS.
- SCSS modules: `style.module.scss`, kebab-case class names, imported as `import classes from "./style.module.scss"`.
- Inline `style` only for truly dynamic values.
- Shared UI that could benefit other SurrealDB frontends belongs in `@surrealdb/ui`, not here.

### Language

All user-facing text uses **British English** spelling (`-ise`, `-our`, `-re`, `-ogue`).

### Headings and subheaders

Use **sentence case** for multi-word headings (`##`, `###`, `####`). Do not use
Title Case on every main word.

| Pattern | Rule | Examples |
| ------- | ---- | -------- |
| Single word | Capitalise the word | `## Syntax`, `#### Parameters`, `#### Returns` |
| Multiple words | Capitalise the **first word only**; lowercase the rest | `## Type parameters`, `### Complete examples`, `### Default response` |
| Numbered lists | Same as multiple words — capitalise the first word after the number | `### 3. Don't reuse transactions`, `## 1. Install the SDK` |

**Keep capitalised** where they are names, not prose:

- Acronyms and protocols: `API`, `HTTP`, `JSON`, `UUID`, `SQL`
- Product and language names: `SurrealDB`, `SurrealQL`, `JavaScript`
- SDK types and identifiers: `RecordId`, `DateTime`, `ApiPromise`
- SurrealQL keywords when cited literally: `INSERT`, `CREATE`, `LIVE SELECT`

**Avoid** AI-style Title Case in subheaders:

- ~~`### Custom Functions`~~ → `### Custom functions`
- ~~`### Basic API Calls`~~ → `### Basic API calls`
- ~~`### Type-Safe Record IDs`~~ → `### Type-safe record IDs`

Hyphenated compounds follow sentence case on the second part unless it is a proper
name: `Full-text search`, `Type-safe queries`, `Half-open ranges`.

Code-block `title="…"` labels on fenced blocks should follow the same rules when
they describe the example (e.g. `title="Method syntax"`, not `title="Method Syntax"`).

## Documentation voice

The docs site mixes reference material, SDK guides, tutorials, and operational
content. The voice is consistent across them:

**Tone.** Neutral and instructional. State what something does, when to use it,
and what to watch out for. Explain rationale where it helps (security trade-offs,
precision loss, scope rules) without editorialising or selling.

**Structure.** Lead with purpose: one or two sentences on what the page covers
and who it is for. Reference pages put syntax or API surface near the top, then
work through examples. Guides and quickstarts use prerequisites, numbered steps,
and expected output. Troubleshooting pages follow symptom → cause → resolution.

**Prose style.** Short paragraphs, mostly declarative sentences. Define terms on
first use. Prefer concrete claims ("datetimes drop from nanoseconds to
milliseconds") over vague importance ("crucial for modern workflows"). Use
tables when comparing options (codecs, deployment modes, auth methods). Link to
related pages inline rather than duplicating full explanations.

**Examples.** Runnable code with realistic data. SurrealQL reference pages often
include inline test assertions and response blocks. SDK pages show imports,
configuration, and the trade-off when an option changes behaviour. Tutorials
include verification steps so readers can confirm the setup worked.

**Callouts.** Use `> [!NOTE]`, `> [!WARNING]`, and `> [!IMPORTANT]` for
exceptions, security caveats, and breaking or easy-to-miss details.

**What to avoid.** Promotional language, tutorial-script openers ("Let's dive
in"), padded significance, and first-person opinion in reference material.
Match existing pages in the same section when unsure.

## Writing new documentation

Two agent skills in `.agents/skills/` support content work, and should both be used
when writing new documentation or updating existing articles in the following order:

### technical-writing

Use this skill to determine how to structure individual articles and decide which content to include.

Follow the skill for audience-appropriate depth, heading hierarchy, worked
examples, completeness (edge cases, error handling), and consistency with
surrounding docs. Draft in the voice described above.

### humanizer

Use after drafting in order to remove AI writing patterns and make the prose more natural and human-written.

Do **not** run humanizer over:

- SurrealQL syntax blocks, railroad diagrams, or mostly-code reference pages
- Frontmatter, tables of parameters, or generated API listings
- Text where neutral precision is the point (security warnings, error catalogues)

Humanizer removes AI writing patterns (significance inflation, rule-of-three
padding, em dashes, chatbot framing) while preserving meaning. For docs, keep
the neutral reference tone; do not add casual voice or first-person editorial.

### Typical workflow

1. Draft with technical-writing.
2. Humanize explanatory prose.
3. Check British English and links.
4. `bun run qa` and `bun run qc`.

## Content collections

Schemas, slugs, and collection metadata live in `src/content/config.ts`. Each
collection has a `+Content.ts` file in `src/content/<collection>/`.

### Plugin configuration (`vite.config.ts`)

- `contentDir`: `"src/content"`
- `lastModified`: `true`
- `drafts.field`: `"draft"`, `includeDrafts`: `false`
- `ssr.external`: includes `"vike-content-collection"`

### Collections

| Kind | Schema          | Collections                                                                                                                                         |
| ---- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Docs | `abstractDoc`   | `doc-surrealdb`, `doc-cloud`, `doc-surrealist`, `doc-surrealml`, `doc-surrealkv`, `doc-surrealql`, `doc-integrations`, `doc-tutorials`, `doc-sdk-*` |
| Labs | `labCollection` | `labs-items`                                                                                                                                        |

Every `+Content.ts`:

```ts
import { abstractDoc, contentSlug } from "../config";

export const Content = {
    schema: abstractDoc,
    
};
```

### Schemas (`src/content/config.ts`)

- **`abstractDoc`** — `title`, `description`, `position`, `no_page_headings`, `no_sidebar` (all optional, strict object)
- **`labCollection`** — `title` (required), `url`, `category`, `author`, `topics`, `languages`
- **`contentSlug`** — strips the collection prefix from the file path and removes trailing `/index`

### URL mapping

`urlForCollection` maps collection names to URL prefixes:

- `doc-surrealdb` → `/surrealdb`
- `doc-sdk-javascript` → `/sdk/javascript`
- `labs-items` → `/labs`

### Adding content

1. Create a `.md` or `.mdx` file in the appropriate `src/content/<collection>/` folder.
2. Add YAML frontmatter matching the collection schema.
3. For docs, sidebar ordering uses `position` in frontmatter and `__category.json` files in subdirectories.

When adding a new doc collection, also update redirect logic in
`aws/viewer-request/index.js`.

## Data loading and rendering

Doc pages follow this pattern in `+data.ts`:

1. Resolve collection ID and slug from the URL (`getCollectionPartsFromURL` from `src/utils/collection.ts`)
2. Call `getCollectionEntry(id, slug)` — throw 404 if not found
3. Parse markdown with `resolveMarkdown(entry.content)` from `src/utils/markdown.tsx` (not `renderEntry`)
4. Build sidebar with `getSidebarItemsFromCollection(id)` from `src/utils/sidebar.ts`
5. Return `{ ast, headings, sidebar, contentPath }`

Labs listing: `sortCollection(getCollection("labs-items"), "title", "asc")`.

Markdown pipeline (`resolveMarkdown` in `src/utils/markdown.tsx`):

1. `parseMarkdown` → AST (via `@surrealdb/ui`)
2. Strip leading H1
3. `resolveAstImages`
4. `extractHeadings` (custom, uses `github-slugger`)

Sidebar: `getSidebarItemsFromCollection` in `src/utils/sidebar.ts` builds trees
from `getCollection(id)` plus `__category.json` via `getCategories` in
`src/lib/categories.ts`.

Prerendering: each doc section has `+onBeforePrerenderStart.ts` mapping
collection entries to URL paths.

Sitemap lastmod: `vite.config.ts` uses `getCollectionEntry` for content pages;
falls back to `getLastModFromGit` elsewhere.

### vike-content-collection APIs

**Used:** `getCollection`, `getCollectionEntry`, `sortCollection`, `vikeContentCollectionPlugin`

**Not used:**

- `renderEntry` / `extractHeadings` — rendering uses `@surrealdb/ui`'s `parseMarkdown` + `RenderMarkdown`
- `getBreadcrumbs` — sidebar-based breadcrumbs
- `getAdjacentEntries` — prev/next follows `__category.json` tree order
- `getEntryUrl` — URLs come from `urlForCollection`
- `getCollectionTree` — sidebar uses `__category.json`
