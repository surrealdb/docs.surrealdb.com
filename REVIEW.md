# AI Code Review Checklist

Use this document when reviewing changes to the SurrealDB docs codebase. Work
through each section and flag anything that does not conform. See `CLAUDE.md`
for quick-reference conventions and `AGENTS.md` for full architectural detail.

---

## 1. Quality gates

- [ ] `bun run qa` (Biome lint + format with auto-fix) has been run.
- [ ] `bun run qc` (Biome check, read-only) passes without errors.
- [ ] `bun run qts` (TypeScript `--noEmit`) reports no type errors.
- [ ] No secrets, `.env` values, or credentials are included in the diff.

## 2. Language

- [ ] All user-facing text uses **British English** spelling:
  `-ise` (not `-ize`), `-our` (not `-or`), `-re` (not `-er`),
  `-ogue` (not `-og`).

## 3. SOLID principles

- [ ] **Single Responsibility** — each module, component, or function has one
  reason to change.
- [ ] **Open/Closed** — behaviour is extended through composition and props, not
  by modifying existing code.
- [ ] **Liskov Substitution** — components sharing an interface are
  interchangeable without breaking consumers.
- [ ] **Interface Segregation** — prop interfaces and type definitions are
  focused; no large catch-all types.
- [ ] **Dependency Inversion** — code depends on abstractions (types,
  interfaces, callbacks) rather than concrete implementations.

## 4. Component and UI conventions

- [ ] Mantine (`@mantine/core`) and `@surrealdb/ui` components are used before
  creating new ones.
- [ ] `<Box>` is used instead of `<div>`. Semantic elements use
  `<Box component="section|nav|main|footer">`.
- [ ] `<Anchor>` is used instead of `<a>`.
- [ ] Mantine styling props (`mt`, `fz`, `gap`, `display`, etc.) are preferred
  over custom CSS.
- [ ] SCSS modules are named `style.module.scss` with **kebab-case** class
  names.
- [ ] No inline `style` attributes for static styling — only for truly dynamic
  values.
- [ ] Shared UI that could benefit other SurrealDB frontends belongs in
  `@surrealdb/ui`, not duplicated in this repo.

## 5. Styling

- [ ] Global styles are limited to `src/assets/styles/` (`global.scss` and
  `markdown.scss`).
- [ ] Component styles use SCSS modules (`style.module.scss`), imported as
  `import classes from "./style.module.scss"`.
- [ ] Dark/light mode is handled via the `@include light { … }` mixin from
  `@surrealdb/ui/mixins`.
- [ ] Mantine CSS variables are used where possible (`--mantine-color-*`,
  `--mantine-spacing-*`, `--surreal-*`).
- [ ] CSS class names are kebab-case in SCSS (auto-converted to camelCase in
  JS).

## 6. TypeScript and imports

- [ ] The path alias `~/` (mapped to `src/`) is used for imports.
- [ ] Strict mode is respected — no untyped `any` without clear justification.
- [ ] No unused imports (Biome `noUnusedImports` rule).
- [ ] `useEffect` / `useCallback` dependencies are exhaustive (Biome
  `useExhaustiveDependencies` rule). `useInputState` and `useStable` are
  registered as stable hooks and do not need to appear in dependency arrays.

## 7. Content collection changes

- [ ] Frontmatter matches the schema in `src/content/config.ts`:
  - Docs → `abstractDoc` (`title`, `description`, `sidebar_position`,
    `sidebar_label`, `no_page_headings`, `no_sidebar` — all optional).
  - Labs → `labCollection` (`title` required; `url`, `category`, `author`,
    `topics`, `languages` optional).
- [ ] New markdown files are placed under the correct
  `src/content/<collection>/` folder.
- [ ] Sidebar ordering uses `sidebar_position` in frontmatter and
  `_category_.json` files in subdirectories.
- [ ] Content slugs are derived automatically — no manual slug field is added.
- [ ] If a **new doc collection** is introduced:
  - `urlForCollection` in `src/content/config.ts` is updated.
  - A corresponding `+Content.ts` file exists in the new collection folder.
  - Redirect logic is updated as noted in the `src/content/config.ts` comment.

## 8. Page and data loading patterns

- [ ] Doc `+data.ts` files follow the standard pipeline:
  1. `getCollectionPartsFromURL(urlPathname, sliceIndex)`
  2. `getCollectionEntry(id, slug)` — 404 if not found
  3. `resolveMarkdown(entry.content)` — produces `{ ast, headings }`
  4. `getSidebarItemsFromCollection(id)` — builds the sidebar tree
  5. Returns `{ ast, headings, sidebar, contentPath }`
- [ ] `+Page.tsx` renders via `<RenderMarkdown>` with
  `registerMarkdownComponents()` and `getMarkdownScope()`.
- [ ] `+onBeforePrerenderStart.ts` maps all collection entries to their URL
  paths when new content pages are added.
- [ ] The correct `sliceIndex` is used in `getCollectionPartsFromURL`:
  - `2` for top-level doc sections (surrealdb, cloud, etc.)
  - `3` for SDK paths (`/docs/sdk/<name>/…`)

## 9. APIs from vike-content-collection

The project intentionally **does not** use the following APIs — flag any
introduction of them:

| API                  | Reason not used                                                              |
| -------------------- | ---------------------------------------------------------------------------- |
| `renderEntry`        | Rendering uses `@surrealdb/ui`'s `parseMarkdown` → AST → `RenderMarkdown`.  |
| `extractHeadings`    | Custom heading extraction in `src/lib/markdown.ts` using `github-slugger`.   |
| `getBreadcrumbs`     | Breadcrumbs are sidebar-based, not collection-hierarchy based.               |
| `getAdjacentEntries` | Prev/next follows sidebar tree order with `_category_.json`.                 |
| `getEntryUrl`        | Collection names don't match URL paths; `urlForCollection` is used instead.  |
| `getCollectionTree`  | Sidebar uses `_category_.json` for structure.                                |

## 10. Common pitfalls

- [ ] Raw HTML elements (`<div>`, `<a>`, `<section>`, `<nav>`, etc.) used
  instead of Mantine equivalents.
- [ ] `+onBeforePrerenderStart.ts` not updated after adding new content pages.
- [ ] Wrong `sliceIndex` in `getCollectionPartsFromURL` — causes 404s.
- [ ] American English spelling in user-facing strings.
- [ ] Inline styles used where Mantine props or SCSS modules would suffice.
- [ ] New component created without first checking Mantine / `@surrealdb/ui`
  for an existing solution.
- [ ] Comments that merely narrate what the code does instead of explaining
  non-obvious intent.

## Key files reference

| File                        | Purpose                            |
| --------------------------- | ---------------------------------- |
| `CLAUDE.md`                 | Quick-reference conventions        |
| `AGENTS.md`                 | Full architecture detail           |
| `src/content/config.ts`     | Content schemas and URL mapping    |
| `src/utils/markdown.tsx`    | Markdown rendering pipeline        |
| `src/utils/sidebar.ts`      | Sidebar tree building              |
| `src/utils/collection.ts`   | URL-to-slug parsing                |
| `src/lib/categories.ts`     | `_category_.json` loader           |
| `src/lib/markdown.ts`       | Heading extraction                 |
| `src/pages/+config.ts`      | Vike root config                   |
| `biome.json`                | Linter and formatter rules         |
