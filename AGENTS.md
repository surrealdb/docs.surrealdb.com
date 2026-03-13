# SurrealDB Frontend AGENTS.md

## Tech stack

- **Framework**: Vike (React) with Vite
- **Content**: vike-content-collection (Zod-validated markdown collections)
- **UI**: Mantine v8 (`@mantine/core`, `@mantine/hooks`) and SurrealDB UI Kit
  (`@surrealdb/ui`)
- **Styles**: SCSS modules, Mantine theme (from `@surrealdb/ui`)
- **Linting**: Biome
- **Auth**: Auth0

## References

- [Mantine](https://mantine.dev/llms.txt): UI
- [Vike](https://vike.dev/llms.txt): Framework
- [Vite](https://vite.dev/llms.txt): Build tool
- [Auth0](https://auth0.com/llms.txt): Authentication
- [vike-content-collection](https://raw.githubusercontent.com/welpie21/vike-content-collection/refs/heads/main/llms-full.txt): Content Collection API

## Content collections (vike-content-collection)

Content is managed through vike-content-collection. Schemas, slugs, and
collection metadata live in `src/content/config.ts`. Each collection has a
`+Content.ts` file in `src/content/<collection>/` that references the shared
config.

### Plugin configuration (`vite.config.ts`)

- `contentDir`: `"src/content"` — where `+Content.ts` files are scanned
- `lastModified`: `true` — populates `lastModified` from git history
- `drafts.field`: `"draft"`, `includeDrafts`: `false`
- `ssr.external`: includes `"vike-content-collection"`

### Collections

There are two kinds of collections:

| Kind | Schema | Collections |
| ---- | ------------- | ---------------------------------------------------------------- |
| Docs | `abstractDoc` | `doc-surrealdb`, `doc-cloud`, `doc-surrealist`, `doc-surrealml`, `doc-surrealkv`, `doc-surrealql`, `doc-integrations`, `doc-tutorials`, `doc-sdk-*` |
| Labs | `labCollection` | `labs-items` |

Every `+Content.ts` follows the same pattern:

```ts
import { abstractDoc, contentSlug } from "../config";

export const Content = {
    schema: abstractDoc,
    slug: contentSlug,
};
```

### Schemas (in `src/content/config.ts`)

- **`abstractDoc`** — `title`, `description`, `sidebar_position`,
  `sidebar_label`, `no_page_headings`, `no_sidebar` (all optional, strict
  object)
- **`labCollection`** — `title` (required), `url`, `category`, `author`,
  `topics`, `languages`
- **`contentSlug`** — custom slug function that strips the collection prefix
  from the file path and removes trailing `/index`

### URL mapping

`urlForCollection` in `src/content/config.ts` maps collection names to URL
prefixes:

- `doc-surrealdb` → `/surrealdb`
- `doc-sdk-javascript` → `/sdk/javascript`
- `labs-items` → `/labs`

### Adding content

1. Create a `.md` file in the appropriate `src/content/<collection>/` folder.
2. Add YAML frontmatter matching the collection's schema.
3. For docs, sidebar ordering uses `sidebar_position` in frontmatter and
   `_category_.json` files in subdirectories.

### Data loading pattern (`+data.ts`)

All doc pages follow the same pattern:

1. Resolve collection ID and slug from the URL
   (`getCollectionPartsFromURL` from `src/utils/collection.ts`)
2. Call `getCollectionEntry(id, slug)` — throw 404 if not found
3. Parse markdown with `resolveMarkdown(entry.content)` from
   `src/utils/markdown.tsx` (not `renderEntry`)
4. Build sidebar with `getSidebarItemsFromCollection(id)` from
   `src/utils/sidebar.ts`
5. Return `{ ast, headings, sidebar, contentPath }`

Labs uses `sortCollection(getCollection("labs-items"), "title", "asc")` to list
entries sorted by title.

### APIs used from vike-content-collection

- `getCollection` — prerender lists, sidebar building, labs listing
- `getCollectionEntry` — single doc/SDK page lookup, sitemap lastmod
- `sortCollection` — labs listing sort
- `vikeContentCollectionPlugin` — Vite plugin with `lastModified: true`

### APIs not used (and why)

- `renderEntry` / `extractHeadings` — rendering uses `@surrealdb/ui`'s
  `parseMarkdown` which produces an AST consumed by `RenderMarkdown`, not HTML
- `getBreadcrumbs` — breadcrumbs are sidebar-based, not collection-hierarchy
  based
- `getAdjacentEntries` — prev/next navigation follows sidebar tree order with
  `_category_.json`, not a simple metadata sort
- `getEntryUrl` — collection names (`doc-surrealdb`) don't match URL paths
  (`/surrealdb`); the project uses `urlForCollection` for mapping
- `getCollectionTree` — sidebar uses `_category_.json` for structure

### Rendering

Markdown is rendered through `@surrealdb/ui`'s `parseMarkdown` which produces
an AST consumed by `RenderMarkdown`. The pipeline lives in
`src/utils/markdown.tsx` (`resolveMarkdown`):

1. `parseMarkdown` → AST
2. Strip leading H1
3. `resolveAstImages` — resolve image URLs
4. `extractHeadings` — extract headings from the AST (custom, uses
   `github-slugger`)

### Sidebar generation

`getSidebarItemsFromCollection` in `src/utils/sidebar.ts` builds nested sidebar
trees from `getCollection(id)` plus `_category_.json` files loaded via
`getCategories` from `src/lib/categories.ts`.

### Prerendering

Each doc section has `+onBeforePrerenderStart.ts` that maps all collection
entries to URL paths:

```ts
export default function onBeforeRenderStart() {
    return getCollection("doc-surrealdb").map((entry) =>
        entry.slug === "index" ? "/surrealdb" : `/surrealdb/${entry.slug}`,
    );
}
```

### Sitemap lastmod

`vite.config.ts` uses `getCollectionEntry` to look up content entries by URL
and returns `entry.lastModified` for sitemap generation. Falls back to
`getLastModFromGit` for non-content pages.

### Important: when adding a new doc collection

The comment in `src/content/config.ts` warns: when adding a new doc, you
**must** also update redirect logic in `aws/viewer-request/index.js`.

## UI and components

### Prefer existing components

- **Mantine**: Prefer Mantine components and styling props. Use the docs as
  reference: [Mantine Core](https://mantine.dev/core/package/).
- **SurrealDB UI Kit**: Use components and assets from `@surrealdb/ui` where
  possible (e.g. `Icon`, pictos, brand assets, `RenderMarkdown`, `useSwitch`,
  `clsx`, `Spacer`). Check the package exports before introducing alternatives
  or new abstractions.

### Avoid creating new components when not needed

- Prefer composing Mantine and `@surrealdb/ui` rather than adding new custom
  components.
- If a new component would be shared across SurrealDB frontends, suggest adding
  it to the SurrealDB UI Kit instead of implementing it only in this repo.

## Layout and semantics

- **No raw `<div>`**: Use Mantine’s `<Box>` for generic layout/containers.
- **Semantic elements**: Use `<Box component="element">` for semantics, e.g.
  `<Box component="section">`, `<Box component="footer">`,
  `<Box component="main">`, `<Box component="nav">`
- **Links**: Use `<Anchor>` instead of `<a>` for links.

## Styling

- **Prefer Mantine styling props** over custom CSS when possible, e.g.
  `mt="xl"`, `fz="sm"`, `display="flex"`, `gap="md"`.
- **Prefer SCSS modules** over inline styles. Name modules `style.module.scss`
  and import as:
  ```ts
  import classes from "./style.module.scss";
  ```
- Class names in CSS should be in kebab-case, and are automatically converted to
  camelCase when used in JavaScript.
- Use `className={classes.xyz}` for module-driven layout and visuals; keep
  inline styles only when necessary (e.g. dynamic values).

## Tips

- Use `bun run qa` to run the linter and formatter without making changes.
- Use `bun run qau` to run the linter and formatter and make changes.

## Summary

### Do's

- Use Mantine + `@surrealdb/ui` first
- Use `<Box>` and `<Box component="…">`
- Use Mantine props (`mt`, `fz`, etc.)
- Use SCSS modules `style.module.scss`
- Suggest UI Kit for shared components

### Don'ts

- Add new components without checking existing ones
- Use plain `<div>`, `<section>`, etc.
- Reach for inline `style` or one-off CSS when props suffice
- Rely on inline styles for static styling
- Implement shared UI only in this repo
