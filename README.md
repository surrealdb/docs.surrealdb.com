
<p align="center">
    <a href="https://surrealdb.com#gh-dark-mode-only" target="_blank">
        <img width="300" src="https://surrealdb.com/static/logo/dark.svg" alt="SurrealDB Logo">
    </a>
	<a href="https://surrealdb.com#gh-light-mode-only" target="_blank">
        <img width="300" src="https://surrealdb.com/static/logo/light.svg" alt="SurrealDB Logo">
    </a>
</p>

<p align="center">The documentation for <a href="https://github.com/surrealdb/surrealdb" target="_blank">SurrealDB</a> and SurrealDB Agent Memory, served at <a href="https://surrealdb.com/docs" target="_blank">surrealdb.com/docs</a>.</p>

<br>

<p align="center">
    <a href="https://surrealdb.com/discord"><img src="https://img.shields.io/discord/902568124350599239?label=discord&style=flat-square&color=5a66f6"></a>
    &nbsp;
    <a href="https://twitter.com/surrealdb"><img src="https://img.shields.io/badge/twitter-follow_us-1d9bf0.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://dev.to/surrealdb"><img src="https://img.shields.io/badge/dev-join_us-86f7b7.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://www.linkedin.com/company/surrealdb/"><img src="https://img.shields.io/badge/linkedin-connect_with_us-0a66c2.svg?style=flat-square"></a>
    &nbsp;
    <a href="https://www.youtube.com/channel/UCjf2teVEuYVvvVC-gFZNq6w"><img src="https://img.shields.io/badge/youtube-subscribe-ff0000.svg?style=flat-square"></a>
</p>

<p align="center">
    <a href="https://surrealdb.com/blog"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/blog-dark.svg"><img height="24" src=".github/readme/blog-light.svg" alt="Blog"></picture></a>
    &nbsp;
    &nbsp;
    <a href="https://github.com/surrealdb/surrealdb"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/github-dark.svg"><img height="24" src=".github/readme/github-light.svg" alt="GitHub"></picture></a>
    &nbsp;
    &nbsp;
    <a href="https://www.linkedin.com/company/surrealdb/"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/linkedin-dark.svg"><img height="24" src=".github/readme/linkedin-light.svg" alt="LinkedIn"></picture></a>
    &nbsp;
    &nbsp;
    <a href="https://twitter.com/surrealdb"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/x-dark.svg"><img height="24" src=".github/readme/x-light.svg" alt="X"></picture></a>
    &nbsp;
    &nbsp;
    <a href="https://www.youtube.com/channel/UCjf2teVEuYVvvVC-gFZNq6w"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/youtube-dark.svg"><img height="24" src=".github/readme/youtube-light.svg" alt="YouTube"></picture></a>
    &nbsp;
    &nbsp;
    <a href="https://dev.to/surrealdb"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/dev-dark.svg"><img height="24" src=".github/readme/dev-light.svg" alt="DEV"></picture></a>
    &nbsp;
    &nbsp;
    <a href="https://surrealdb.com/discord"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/discord-dark.svg"><img height="24" src=".github/readme/discord-light.svg" alt="Discord"></picture></a>
    &nbsp;
    &nbsp;
    <a href="https://stackoverflow.com/questions/tagged/surrealdb"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/readme/stack-overflow-dark.svg"><img height="24" src=".github/readme/stack-overflow-light.svg" alt="Stack Overflow"></picture></a>
</p>

<br>

## Contents

- [Getting started](#getting-started)
- [Commands](#commands)
- [Before you open a pull request](#before-you-open-a-pull-request)
- [What CI checks](#what-ci-checks)
- [Writing documentation](#writing-documentation)
- [Tested examples](#tested-examples)
- [Labs](#labs)
- [File structure](#file-structure)

## Getting started

The site is built with [Vike](https://vike.dev/) and React, and its pages are Markdown and MDX files in `src/content`. You need [Bun](https://bun.sh/) 1.3 or later, and Node.js 24 for the build.

```bash
git clone https://github.com/surrealdb/docs.surrealdb.com.git
cd docs.surrealdb.com
bun install
bun run dev
```

The development server runs at [http://localhost:4321/docs](http://localhost:4321/docs) and reloads as you edit a page.

The style guide, the conventions for SurrealQL examples, and how the site is put together are in [`AGENTS.md`](AGENTS.md). Read it before your first change, whether you write by hand or with a coding agent. For a first contribution, the [good first issues](https://github.com/surrealdb/docs.surrealdb.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) have a limited scope.

## Commands

### Everyday

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the development server. |
| `bun run qa` | Format and fix what Biome can fix safely. |
| `bun run qc` | Check formatting and lint without changing anything. |
| `bun run qts` | Type-check with TypeScript. |
| `bun run check:links` | Check every internal link, anchor and short URL in `src/content`, including links that only reach their page through a redirect, the pages the product switch links to, and the cards of each section hub. |
| `bun run check:doc-tests` | Check that every SurrealQL example carries a test config that agrees with the result its page shows. `--fix` adds a config to each example without one. |
| `bun run check:cli-reference` | Check the environment variables page and the command pages against the newest stable release in the version history data: every setting has a row, every row names a real setting, or says with a `<Since>` badge which newer version it is for, and the defaults agree. |
| `bun run check:duplicates` | List the pages and examples that this branch made repeat another page, compared with `main`. `--all` lists every similar pair in the docs, and `--base REF` compares with another branch. It only warns. |
| `bun run check:sdk-parity` | Check that the SDK references share the addresses of their concept pages, so the language in `/docs/reference/<sdk>/concepts/<concept>` can be swapped: every SDK needs the concepts that all of them have, and a missing page that most SDKs have must be recorded as a gap with its reason in `scripts/check-sdk-parity.ts`. Shared pages need the same title and sidebar position in every SDK, and no two pages of one SDK may share a position. |
| `bun run check:sdk-snippets` | Check that the language tabs on the docs home page still match the quickstarts they copy: every line of code in a tab has to appear in a page the tab links to, and every quickstart needs a tab. |
| `bun run check:search-text` | Check that the search crawler extracts the text of every page, so search matches what pages say and not only their titles. |
| `bun run check:content` | Warn about the lines this branch added that break a mechanical writing rule from `AGENTS.md`: dashes, American spellings, idioms, Title Case headings, wrapped paragraphs, the old record ID brackets, `IF ... THEN ... END`, bare `//` comments, `Response` titles on SurrealQL results, `root` passwords, `<SurrealistMini>` embeds that render empty, an `<iframe>`, an unknown callout kind, an image with no alt text, a misplaced `<Since>` badge, version tabs with the older version first, and a link repeated on a short page or in one section of a long one. `--all` reads every page, `--base REF` compares with another ref, and `--strict` exits 1 when anything is found. |
| `bun run check:staleness` | List the pages whose content has not changed for 180 days, by section, with the oldest first. `--days N` changes the age, `--limit N` the length of the list and `--exclude PREFIX` leaves a part of `src/content` out. A commit that changes more than 40 pages counts as a sweep and does not date a page, and `--bulk N` changes that number. |
| `bun run build` | Build the site. |
| `bun run preview` | Build the site and serve the build. |

### Generated files

These write files that are committed, so run them and commit the result with the change that needs them.

| Command | When to run it |
| --- | --- |
| `bun run generate:llms` | After a page is added, moved or renamed, or its `description` changes. Writes `public/llms.txt`. |
| `bun run generate:related` | To refresh the related University lessons and blog posts shown at the end of a page. Writes `src/data/related.json`. |
| `bun run generate:labs` | After an entry is merged in awesome-surreal, to list it in Labs. Writes `src/data/labs.json`. |
| `bun run generate:labs-blog` | After blog posts are published, to list them in Labs. Writes `src/data/labs-blog.json`. |
| `bun run generate:cli-history` | After a SurrealDB release is tagged, to update the environment variable and flag history chart. |

### Diagrams and screenshots

| Command | What it does |
| --- | --- |
| `bun run diagrams:render [name]` | Draw a figure from `scripts/diagrams/figures` as light and dark WebP files. |
| `bun run diagrams:check` | List the figures whose page sections changed since they were drawn. Use `--accept <name>` when a figure still matches. |
| `bun run diagrams:share` | Copy the figures listed in `scripts/diagrams/shared.json` to `public/diagrams`, where SurrealDB University lessons link to them. `diagrams:render` does this as well. |
| `bun run screenshots:check` | List the Studio screenshots whose interface has changed, from a local clone of surrealdb/studio. |
| `bun run screenshots:capture` | Take the scripted Studio screenshots again. |

### Search and deployment

| Command | What it does |
| --- | --- |
| `bun run search:serve` | Serve the search API locally. |
| `bun run search:index` | Index the content into the search database. Needs the search database credentials. |
| `bun run build:cloudflare` | Build the Cloudflare Worker. Vercel serves production, and the Worker serves previews. |
| `bun run test:routes` | Check the route table compiled from `vercel.ts` and `redirects.ts`. |
| `bun run generate:last-modified` | Write `generated/last-modified.json`, the date each page last changed, from the git history. `prebuild` runs it, so run it by hand only to see the dates in `bun run dev`. |

`bun run build` ends with `postbuild`, which indexes the content for search. It skips itself on Vercel previews and in CI. On your own machine, without the search database credentials, it reports an error after the build has finished, and the build output is still complete.

## Before you open a pull request

Run these, and fix what they report:

```bash
bun run qa
bun run qc
bun run check:links
bun run check:doc-tests
bun run check:cli-reference
bun run check:duplicates
bun run check:content
bun run check:search-text
bun run check:sdk-snippets
bun run check:sdk-parity
bun run diagrams:check
```

When `check:doc-tests` reports an example with no config, run `bun run check:doc-tests --fix` to add one. For every figure that `diagrams:check` lists, either update the figure or accept it, as [Keeping figures accurate](AGENTS.md#keeping-figures-accurate) describes.

## What CI checks

The CI workflow runs on every push, including pushes to a pull request's branch. Merging into `main` needs an approving review, but a failing job does not block the merge, so check that every job has passed before you merge.

| Job | Runs | Fails when | To fix it |
| --- | --- | --- | --- |
| Code Quality | `bun run qau` | Biome finds a formatting or lint error that it cannot fix itself. | Run `bun run qa`, then `bun run qc`, and fix what remains. |
| Build docs | `bun run build` | A page does not build: for example a frontmatter key that `src/utils/schema.ts` does not allow, an `icon` that does not exist, or a component used wrongly. | Run `bun run build` and read the first error. |
| Route table | `bun run test:routes` | A rule in `redirects.ts` or `vercel.ts` compiles to a route that the Worker would serve differently from Vercel. | Run `bun run test:routes`. |
| Content checks | `bun run check:links` | A link points at a page that does not exist, or at an address that redirects: a moved page, a short URL, a trailing slash, a `.html` file, or a folder with no page of its own. Also when a link is relative, an anchor names no heading on its page, a short URL is broken or missing, a pair in `src/utils/product-counterparts.ts` names a page that does not exist, or a section hub's cards drift from its sidebar: a group with no card, a card for a group that does not exist, or a card with no `description` or `picto`. | Link the address the message names. A renamed heading changes its anchor, so update every link to it. A moved page in a product switch pair needs its new path in that file. A new collection under a section needs its `description` and `picto` in `__category.json`, and a hub that lists its groups by `paths` needs the new group added there. |
| Content checks | `bun run check:doc-tests` | A SurrealQL example has no test config, or its config expects a different result from the one its page shows. | Run `bun run check:doc-tests --fix` for a missing config. For a disagreement, run the example and correct whichever of the two is wrong. |
| Content checks | `bun run check:cli-reference` | A `SURREAL_` variable or a flag in the newest stable release is not documented, a row names a variable no release has had and its `<Since>` badge does not name a newer version, a row for a removed variable gives no version, or a documented default differs from the source. Also when an entry in one of the script's lists no longer applies. | Add the row or mention the flag. A variable or flag that is not a setting for users goes in `INTERNAL` or `HIDDEN_FLAGS` in `scripts/check-cli-reference.ts`, with the reason. |
| Content checks | `bun run check:duplicates` | Fails only when the committed `public/llms.txt` differs from the one regenerated from the content. The content rules never fail: they warn, as an annotation on the changed file, when the change adds a page whose prose mostly appears on another page, or copies an example from another page. | Link to the page that already covers it, or merge the two. Leave the warning where the two pages are meant to match, such as the `ALTER` pages for a database and a namespace. |
| Content checks | `bun run check:content`, and `bun run generate:llms` followed by `git diff --exit-code public/llms.txt` | Never: it warns, as an annotation on the changed line, when a line the change adds breaks one of the writing rules that `AGENTS.md` states mechanically. | For `llms.txt`, run `bun run generate:llms` and commit the result. For a content warning, fix the line it names. A rule can bend where a page quotes something, and the person making the change decides. `bun run check:content --all` shows every line in the docs that breaks a rule. |
| Content checks | `bun run check:sdk-parity` | An SDK lacks a concept page that every SDK has, a gap is not recorded in `scripts/check-sdk-parity.ts`, a recorded gap has been filled, a page uses another spelling of a shared slug, a shared page has a different title or position, or two pages of one SDK share a position. | Write the page, or rename it to the shared slug. Record a gap only with its reason. |
| Content checks | `bun run check:sdk-snippets` | A line of code in a language tab on the docs home page is not in a page the tab links to, a tab links to no quickstart, or a quickstart has no tab. | Change the quickstart first, then copy the lines to the tab in `src/content/index/index.mdx`. |
| Content checks | `bun run check:search-text` | A fixed markdown sample no longer extracts to the expected text, or a page yields no text for the search index. | Fix the text extraction in `search/scripts/crawler.ts`. The message shows what the sample extracted to. |

A push to `main` also starts the **Re-index docs search** workflow, which updates search from the new content. It can be started by hand for staging from the Actions tab.

The **Stale pages** workflow runs every Monday, and by hand from the Actions tab. It runs `bun run check:staleness` and shows the pages unchanged for 180 days in the job summary. It reports and never fails.

## Writing documentation

Each folder under `src/content` with a `+Content.ts` file is a collection, and each `.md` or `.mdx` file in it is a page. The frontmatter takes `title`, `description`, `position`, `icon` and `hidden`, and nothing else: the schema in `src/utils/schema.ts` refuses an unknown key. A folder's `__category.json` gives the section its title, position and icon in the sidebar.

- Set `position` on every page you add or move. Positions are whole numbers.
- A page that moves needs a redirect in `redirects.ts` from its old URL.
- The `description` does not appear on the page. It is used for search, for `llms.txt` and for the page's meta description, so the first paragraph of the page has to introduce it.
- Raw HTML is removed when a page renders. Use the components that `AGENTS.md` lists, such as `<YouTube>` for a video.

Adding a collection, the redirect rules, the components and the writing conventions are all described in [`AGENTS.md`](AGENTS.md).

## Tested examples

Every SurrealQL example in the documentation is a test. Each one starts with a `/**[test] ... */` config, which the site does not show, and the language-test runner in the SurrealDB repository reads the pages and runs every example that has one against the engine.

- An example has to run as written on an empty database. Put any setup it needs at the top of the block, under a `-- Setup` line, followed by a blank line.
- A result goes in a fence titled `Output` directly below the example, or on a `//-` line below the statement that returns it. The config states the same result, and `bun run check:doc-tests --fix` writes it from the page for a new example.
- Mark a block `notest` (```` ```surql notest ````) only when it cannot run on its own, such as a template whose values an application supplies.
- A signature such as `math::abs(number) -> number` goes in a ```` ```syntax ```` fence, which is never a test.

[Tested examples](AGENTS.md#tested-examples) in `AGENTS.md` has the full rules.

## Labs

[Labs](https://surrealdb.com/docs/labs) lists projects, articles and videos from SurrealDB and the community. Its entries live in the [awesome-surreal](https://github.com/surrealdb/awesome-surreal) repository, one YAML file per entry, and the same files generate that repository's README. To add an entry, follow its [contribution guide](https://github.com/surrealdb/awesome-surreal/blob/main/CONTRIBUTING.md).

This repository keeps a copy of the entries in `src/data/labs.json`, which `bun run generate:labs` writes from awesome-surreal. Run it after an entry is merged there. Blog posts in Labs come from `src/data/labs-blog.json` instead.

### Railroad diagrams

This repo renders SVG railroad diagrams using the JS library by Tab Atkins ([JS README](https://tabatkins.github.io/railroad-diagrams/README-js.html), [project page](https://tabatkins.github.io/railroad-diagrams/)).

- Component: `RailroadDiagram` from `@surrealdb/ui`
- Wired up as an MDX shortcode in `src/utils/markdown.tsx`, so no import is needed inside content files

Usage in MDX/Markdown content:

```mdx
<RailroadDiagram ast='{
  "type": "Diagram",
  "padding": [10, 20, 10, 20],
  "children": [
    { "type": "Start", "startType": "simple", "label": "statement" },
    {
      "type": "Sequence",
      "children": [
        { "type": "NonTerminal", "text": "ACCESS" },
        { "type": "Choice", "index": 1, "children": [
          { "type": "Terminal", "text": "ON" },
          { "type": "Terminal", "text": "TO" }
        ]},
        { "type": "NonTerminal", "text": "resource" }
      ]
    },
    { "type": "End" }
  ]
}' />
```

The `ast` prop is passed as a JSON string and parsed by the shortcode wrapper before being handed to the underlying `RailroadDiagram` component.

## File structure

```md
src/
    assets/      # Images, including the rendered diagrams
    components/  # React components, with co-located *.module.scss files
    content/     # The pages, one folder per collection
    data/        # Generated data, such as related links and Labs blog posts
    lib/         # Shared API and data helpers, including the search and feedback handlers
    pages/       # Vike routes: +Page.tsx, +data.ts, +config.ts and so on
    utils/       # Markdown pipeline, navigation, schemas and collection helpers
scripts/         # The commands above
search/          # The search schema, crawler and handler
tests/           # The generated doc tests
```
