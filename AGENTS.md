# SurrealDB Docs

Documentation site for SurrealDB, built with Vike (React 19), Vite, Mantine v9,
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

- **Single Responsibility** - one reason to change per module, component, or function.
- **Open/Closed** - extend through composition and props, not by modifying existing code.
- **Liskov Substitution** - interchangeable components must not break consumers.
- **Interface Segregation** - focused prop interfaces and types; avoid catch-all types.
- **Dependency Inversion** - depend on abstractions (types, interfaces, callbacks).

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

### Dashes

Use the standard hyphen (`-`) everywhere. Em dashes (`—`) and en dashes (`–`) do
not appear in this repo, in prose, headings, tables, code comments or these guides.

| Use                           | Instead of                   |
| ----------------------------- | ---------------------------- |
| `a spaced hyphen - like this` | `an em dash — like this`     |
| `2-3 minutes`, `pages 10-12`  | `2–3 minutes`, `pages 10–12` |

A parenthetical takes a hyphen with a space on each side, so the words either
side stay separate. A numeric range takes a tight hyphen with no spaces.
Where a sentence leans on the dash for its rhythm, a comma, a colon or a full
stop usually reads better than either.

### Line breaks in content

**Never hard-wrap a paragraph.** The markdown renderer preserves single newlines as
line breaks, so a wrapped source line becomes a visible break mid-sentence and can
split a link across two lines. Write each paragraph, list item and callout body as one
line and leave wrapping to the viewport.

Newlines separate blocks, not lines within a block. Line structure is only meaningful
where it is part of the syntax - fenced code, `<Synopsis>` bodies (one usage line per
line), multi-line JSX attributes, tables and frontmatter.

### Headings and subheaders

Use **sentence case** for multi-word headings (`##`, `###`, `####`). Do not use
Title Case on every main word.

| Pattern        | Rule                                                                | Examples                                                              |
| -------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Single word    | Capitalise the word                                                 | `## Syntax`, `#### Parameters`, `#### Returns`                        |
| Multiple words | Capitalise the **first word only**; lowercase the rest              | `## Type parameters`, `### Complete examples`, `### Default response` |
| Numbered lists | Same as multiple words - capitalise the first word after the number | `### 3. Don't reuse transactions`, `## 1. Install the SDK`            |

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

**Example ordering.** SurrealQL often has several equivalents of the
same operation, and readers - agents included, since the docs are served raw
through the `.md` endpoints and `llms.txt` - take the first example shown as
the recommendation. Where a page presents two equivalent forms, lead with the
one whose meaning is fully visible in the snippet itself, breaking ties by
token count and then by similarity to mainstream languages. In practice:
literal unions (`TYPE 'draft' | 'published'`) before `ASSERT $value IN [...]`,
method syntax (`$value.len()`) before qualified paths in incidental examples,
`.map()`/`.filter()` chains before `FOR` loops for pure transformations,
inline closures before closures bound to a parameter first, and object forms
(`CONTENT {...}`, `INSERT INTO ... [{...}]`) before `SET` clauses. The other
form stays, with a one-line note on when to prefer it. Carve-outs: a page
documenting a construct keeps that construct first, migration pages stay
chronological, version-gated syntax keeps its `<Since>` marker, and statement
choice (`CREATE`/`INSERT`/`UPSERT`) is never swapped - those differ on
existing records.

**`RETURN` in examples.** Bare expressions are valid statements that yield the
same value, so a snippet that is a single expression drops the leading
`RETURN`: the bare form is the fragment a reader can paste into a `SELECT`
projection, a `WHERE` or an `ASSERT`, while the `RETURN` form is a statement
that fits none of those slots. Keep `RETURN` where it carries information: on
the final line of a multi-statement example to mark which statement produced
the displayed output, for early return and transaction return values (control
flow), and on the page documenting `RETURN` itself. Prose that only narrates
the keyword ("shows this function used in a `RETURN` statement") is trimmed
along with it.

**Callouts.** Use `> [!NOTE]`, `> [!WARNING]`, and `> [!IMPORTANT]` for
exceptions, security caveats, and breaking or easy-to-miss details.

**What to avoid.** Promotional language, tutorial-script openers ("Let's dive
in"), padded significance, and first-person opinion in reference material.
Match existing pages in the same section when unsure.

**Do not presume the reader's situation.** The test is *who the sentence is
about*, not whether it contains a negative. Attributing a state, a practice, or a
misconception to the reader is the fault. Samsung's writing style guide gives the
same rule as "use positive expressions".

A negative is fine in two cases. It is fine when it describes what SurrealDB asks
of the reader, because it lifts an obligation. It is also fine when it names a
general subject outright, because the claim then lands on a category rather than
on this reader - "most vector stores keep no history of a superseded fact" is an
observation, and a negative attached to our own architecture ("one engine, no
plumbing to run") describes ours. What fails is the **bare** negation: with no
stated subject the reader supplies themselves, and reads it as a verdict on their
own setup.

Fine, because these describe what SurrealDB asks of the reader and remove an
obligation:

- "No need to learn another query language just for time series."
- "You do not have to author Rust yourself to benefit from Surrealism."
- "You do not need to create the table first - SurrealDB adds it on the first write."

Not fine, because each one only works if the reader is in a state we have
decided for them:

| Avoid                                          | What it presumes                                     | Use                                                             |
| ---------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| No message broker, no polling, no glue code    | Nothing states the subject, so the reader becomes it | The database is your event bus and your source of truth at once |
| One engine, not a pile of stores               | They suspected we were a pile of stores              | One engine, one transaction                                     |
| Nothing here is a mention tally. The count is… | They guessed "mention tally"                         | The count is…                                                   |
| Forget about infrastructure operations         | Ops is their burden today - and instructs them       | SurrealDB Cloud runs the infrastructure for you                 |
| Stop stitching databases together              | They stitch databases together - and instructs them  | One database for every model your app needs                     |

Two forms to watch for:

1. **Imputed practice or pain** - the sentence only holds if the reader's current
   setup is bad. Watch "glue code", "bolt-ons", "plumbing", "juggling",
   "wrestling with", "hassle" - though these are not banned words, and are fine
   against a named general subject or against our own architecture. It is the
   bare, subjectless use that lands on the reader.
2. **Imputed misconception** - the sentence answers a question nobody asked, so
   it plants the wrong idea in order to knock it down. Usual shapes: "not a…",
   "isn't just…", "Nothing here is…", "more than just…".

A negative imperative ("Stop…", "Forget about…", "Say goodbye to…") is both at
once, and never belongs in the docs.

None of this applies where the subject genuinely *is* a problem or a limit:
`> [!WARNING]` and `> [!NOTE]` bodies, prohibitions, documented limits ("eval is
denied for every subject by default"), factual permission statements ("sort
fields do not need to appear in the `SELECT` list"), API semantics that literally
stop something, and product-to-product contrast on a comparison page ("not just
embeddings" on a page about vector databases). Rewriting those costs precision
and gains nothing.

## Writing or updating documentation

When you need to write new documentation or update existing articles, make use of the `documentation` skill (`.agents/skills/documentation/SKILL.md`).


### Typical workflow

1. Draft with technical-writing.
2. Humanize explanatory prose.
3. Check British English and links.
4. `bun run qa` and `bun run qc`.

## Content collections

Content lives in `src/content`. Frontmatter schemas live in
`src/utils/schema.ts`.

### Plugin configuration (`vite.config.ts`)

- `contentDir`: `"src/content"`
- `lastModified`: `true`
- `drafts.field`: `"draft"`, `includeDrafts`: `false`
- `ssr.external`: includes `"vike-content-collection"`

### Collection ids are directory paths

A collection is any directory under `src/content` holding a `+Content.ts`, and
its id is that directory's path relative to `src/content`. So
`src/content/manage/instances/+Content.ts` declares the collection
`manage/instances`. Renaming a directory renames the collection id, which then
has to be updated everywhere the id is named (see below).

The collections are `index` (the root catch-all, serving `/docs/<slug>`), one per
section under `build/*`, `explore/*`, `learn/*`, `manage/*`, `reference/*` and
`agent-memory/*` (plus `agent-memory/index` for `/docs/agent-memory`), and
`labs-items`.

Every doc collection's `+Content.ts` is the same boilerplate:

```ts
import { defineCollection } from "vike-content-collection";
import { pageSchema } from "~/utils/schema";

export const Content = defineCollection({
    schema: pageSchema,
    type: "both",
});
```

`labs-items` is the exception: `labSchema` and `type: "content"`.

> [!IMPORTANT]
> `+Content.ts` belongs at the collection root only. Discovery recurses
> unconditionally, so a nested `+Content.ts` registers a second collection over
> the same files and each file is indexed twice. Nested folders are structured by
> directory depth plus `__category.json`.

### Schemas (`src/utils/schema.ts`)

- **`pageSchema`** - `title`, `description`, `position`, `icon`, `hidden`, all
  optional. It is a Zod `strictObject`, so an unknown frontmatter key is a build
  error. `icon` must be a member of `SECTION_ICONS_NAMES` (`src/utils/icons.ts`).
- **`labSchema`** - `title`, `category` and `author` required; `description`,
  `url`, `topics` (max 2) and `languages` optional.

`type: "both"` means `__category.json` files are collection entries as well, and
they are validated by the same `pageSchema`. A folder's `__category.json` carries
the section `title`, `position`, `icon` and `hidden` for that subtree. Anything
enumerating a collection has to filter slugs ending in `__category`.

### Slugs and URLs

A slug is the file path relative to the collection root with the extension
stripped, each segment passed through `github-slugger` (dots are dropped, so
`v1.x` becomes `v1x`), and a trailing `index` removed.

There is no `urlForCollection`. The URL prefix is the optional third argument to
`resolveDataFromCollection` in the page group's `+data.ts`, defaulting to the
collection id:

| Collection           | `+data.ts` call                                   | URL                             |
| -------------------- | ------------------------------------------------- | ------------------------------- |
| `manage/instances`   | `(context, "manage/instances")`                   | `/docs/manage/instances/<slug>` |
| `index`              | `(context, "index", "")`                          | `/docs/<slug>`                  |
| `agent-memory/index` | `(context, "agent-memory/index", "agent-memory")` | `/docs/agent-memory/<slug>`     |

### Adding content

1. Create a `.md` or `.mdx` file in the appropriate `src/content/<collection>/` folder.
2. Add YAML frontmatter matching `pageSchema`.
3. Ordering comes from `position` in frontmatter for pages and from
   `__category.json` for folders. Both default to `0` and ties fall back to
   filesystem order, so set `position` explicitly on anything you add or move.

### Adding, renaming, or moving a collection

The content side needs `src/content/<id>/+Content.ts` and `__category.json`. The
page group `src/pages/<url-prefix>/` needs `+route.ts`, `+data.ts`, `+Page.tsx`,
`+Layout.tsx` and `+sitemapUrls.ts`. Then update:

- `src/utils/collections.ts` - `COLLECTION_ROUTES` powers the raw `.md` endpoint.
  Most specific prefix first; the `{ prefix: "", id: "index" }` catch-all stays last.
- `src/components/Layout/nav.ts` - top-nav hrefs are hardcoded.
- `redirects.ts` - old URLs to new URLs (see below).
- `public/llms.txt` - hand-maintained absolute URLs.
- `src/utils/product.ts` - only when introducing a new product (`surrealdb` |
  `agent-memory`).
- `src/pages/agent-memory/index/+route.ts` - add the segment to
  `AGENT_MEMORY_SIBLING_SECTIONS` when the collection sits under `/agent-memory`.
- `search/src/handler.ts` and `search/scripts/crawler.ts` - the search product
  filter and the crawler's URL-prefix map are both keyed on the path prefix.

### Redirects

Redirects live in `redirects.ts` (the `docsRedirects` array), read by `vercel.ts`
in production and by `plugins/vite-dev-redirects.ts` in dev and preview. There is
no `aws/` directory.

`www.surrealdb.com` rewrites `/docs/(.*)` to this project with the `/docs` prefix
**stripped**. Two rules follow from that:

- `source` must **not** include `/docs`. A `/docs/…` source can never match.
- `destination` **must** include `/docs`. It becomes a browser-facing `Location`
  header resolved against `surrealdb.com`, where the docs only exist under `/docs`.

Use `statusCode: 301` for content moves. Rules are matched in array order with no
specificity scoring, so list page renames before the folder rule that would
otherwise swallow them, and deeper folders before their parents. Follow
`cloudAndDeploymentRedirects` as the model.

Two things to check alongside a move:

- The `www.surrealdb.com` repo has its own `/docs/*` redirects in
  `redirects.json`, and they run first. When you move a page a www entry already
  points at, repoint that entry instead of leaving a second hop.
- A missing page does not 404 - `resolveDataFromCollection` 302s up to the parent
  path - so a missed redirect is silent. Diff the URL set before and after
  instead of watching for 404s.

## Content components

Markdown pages can use a small set of React components, registered in
`registerMarkdownComponents` (`src/utils/markdown.tsx`).

| Component                        | Use                                                           |
| -------------------------------- | ------------------------------------------------------------- |
| `<Synopsis>`                     | Usage or signature line for a command or method.              |
| `<OptionsTable>`                 | Reference table of CLI options, arguments, or SDK parameters. |
| `<Boxes>` with `<IconBox>`       | Card grid of links, used on section landing pages.            |
| `<Edition value="enterprise" />` | Community or Enterprise badge.                                |
| `<Version sdk="…" />`            | Inline current version number for an SDK.                     |

> [!IMPORTANT]
> Braced attribute values are parsed as **JSON**, not JavaScript. Object keys and
> strings need double quotes; an invalid value is dropped with a console warning.

### `<Synopsis>`

Write the usage lines as the block body:

```mdx
<Synopsis>
surrealctl instance create [OPTIONS] <NAME>
</Synopsis>
```

The markdown pipeline moves the body into the `command` attribute before parsing,
so metasyntax (`[NAME]`, `<TYPE>`, `...`) reaches the renderer verbatim -
children would be parsed as inline markdown and lose it. `label` defaults to
`Usage`; use `label="Signature"` for SDK reference. There is deliberately no copy
button, because a synopsis is not paste-ready.

### `<OptionsTable>`

```mdx
<OptionsTable
	title="Options"
	options={[
		{ "name": "--type", "short": "-t", "value": "<TYPE>", "env": "SURREALCTL_TYPE", "description": "Instance type to provision." },
		{ "name": "--replicas", "type": "number", "default": 1, "description": "Number of `scale` plan replicas." }
	]}
/>
```

Each row needs `name` and `description`; `short`, `value`, `type`, `default`,
`env` and `required` are optional. The `Type`, `Default` and
`Environment variable` columns render only when a row uses them, so a table never
carries a column of em-dashes. Use `value` for CLI placeholders and `type` for
SDK parameter types. Backtick spans inside `description` render as inline code.

## Data loading and rendering

A doc page group's `+data.ts` is a single call:

```ts
export default async function data(context: PageContext) {
    return resolveDataFromCollection(context, "manage/instances");
}
```

`resolveDataFromCollection` (`src/utils/data.ts`):

1. Strips the URL prefix (the optional third argument, defaulting to the
   collection id) to get the slug, then looks up `getCollectionEntry(id, slug)`.
2. On a miss, 302s one path segment up - `getParentUrl` re-attaches the `/docs`
   base - and only throws a 404 when there is no parent.
3. Sets the page `title` and `description` through `useConfig`, suffixing the
   title per product (`src/utils/product.ts`).
4. Builds the sidebar with `buildNavigation(id, prefix)`.
5. Parses the markdown with `resolveMarkdown(entry.content)`.
6. Walks each path prefix looking for a `<prefix>/__category` entry to build
   breadcrumbs; a folder without `__category.json` is skipped.

It returns `{ content, headings, navigation, contentPath, breadcrumbs, title, description }`.

`+Page.tsx` is identical in every group:
`export { DocMarkdown as default } from "~/components/DocMarkdown";`. `DocMarkdown`
renders `content` through `@surrealdb/ui`'s `MarkdownViewer` with `jsxMode="render"`
and the components from `registerMarkdownComponents`.

Labs listing: `sortCollection(getCollection("labs-items"), "title", "asc")`.

Markdown pipeline (`resolveMarkdown` in `src/utils/markdown.tsx`) returns
`{ content, headings }`:

1. `stripLeadingH1` - the rendered heading comes from frontmatter `title`.
2. Strip leading language-test block comments out of fenced code.
3. `inlineSynopsisCommands` - move `<Synopsis>` bodies into the `command` attribute.
4. `injectIconScope` - quote `icon={{ … }}` keys and resolve icon identifiers to URLs.
5. `parseMarkdownTree` and `extractHeadings` (both from `@surrealdb/ui`) for the page aside.

Sidebar: `buildNavigation` in `src/utils/navigation.ts` builds sections from
`getCollectionTree(id)`. The root folder becomes the first section, each top-level
subfolder becomes its own section (with the `icon` from its `__category.json`), and
deeper folders become links with children. A folder with no entry of its own takes
its first child's href. `hidden: true` removes an entry from the menu while the
page stays built and reachable by URL.

Prerendering is off (`prerender: false` in `src/pages/+config.ts`), so every
request is served by the SSR function and the `+onBeforePrerenderStart.ts` files
are inert. Sitemap URLs come from `+sitemapUrls.ts` instead
(`collectionSitemapUrls` in `src/utils/sitemap.ts`, which filters `__category`
entries) - add one for every new page group.

### vike-content-collection APIs

**Used:** `defineCollection`, `getCollection`, `getCollectionEntry`,
`getCollectionTree`, `sortCollection`, `vikeContentCollectionPlugin`

**Not used:**

- `renderEntry` and the package's `extractHeadings` - rendering goes through `@surrealdb/ui`'s `parseMarkdownTree` + `MarkdownViewer`
- `getBreadcrumbs` - breadcrumbs come from `__category` lookups in `resolveDataFromCollection`
- `getAdjacentEntries`
- `getEntryUrl` - URLs come from the page group's URL prefix
