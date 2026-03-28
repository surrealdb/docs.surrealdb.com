# Pages (Vike filesystem routing)

Each page directory follows Vike conventions with these files:

- `+Page.tsx` — React component
- `+data.ts` — server-side data loading
- `+Head.tsx` — SEO meta tags
- `+onBeforePrerenderStart.ts` — prerender URL list

## Data loading pattern

All doc pages follow the same five-step flow:

1. Resolve collection ID and slug from the URL (`getCollectionPartsFromURL` from `src/utils/collection.ts`)
2. Call `getCollectionEntry(id, slug)` — throw 404 if not found
3. Parse markdown with `resolveMarkdown(entry.content)` from `src/utils/markdown.tsx`
4. Build sidebar with `getSidebarItemsFromCollection(id)` from `src/utils/sidebar.ts`
5. Return `{ ast, headings, sidebar, contentPath }`

## Prerendering

Each doc section has a `+onBeforePrerenderStart.ts` that maps all collection entries to URL paths using `getCollection`.

## SEO

Every page should have a `+Head.tsx` providing appropriate `title` and `description` meta tags.
