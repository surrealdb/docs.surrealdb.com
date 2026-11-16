
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
    <a href="https://surrealdb.com/blog"><img height="25" src="src/assets/img/logo/dark/blog.svg" alt="Blog"></a>
    &nbsp;
    <a href="https://github.com/surrealdb/surrealdb"><img height="25" src="src/assets/img/logo/dark/github.svg" alt="Github	"></a>
    &nbsp;
    <a href="https://www.linkedin.com/company/surrealdb/"><img height="25" src="src/assets/img/logo/dark/linkedin.svg" alt="LinkedIn"></a>
    &nbsp;
    <a href="https://twitter.com/surrealdb"><img height="25" src="src/assets/img/logo/dark/twitter.svg" alt="Twitter"></a>
    &nbsp;
    <a href="https://www.youtube.com/channel/UCjf2teVEuYVvvVC-gFZNq6w"><img height="25" src="src/assets/img/logo/dark/youtube.svg" alt="Youtube"></a>
    &nbsp;
    <a href="https://dev.to/surrealdb"><img height="25" src="src/assets/img/logo/dark/dev.svg" alt="Dev"></a>
    &nbsp;
    <a href="https://surrealdb.com/discord"><img height="25" src="src/assets/img/logo/dark/discrod.svg" alt="Discord"></a>
    &nbsp;
    <a href="https://stackoverflow.com/questions/tagged/surrealdb"><img height="25" src="src/assets/img/logo/dark/stack-overflow.svg" alt="StackOverflow"></a>
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
| `bun run check:links` | Check every internal link, anchor and short URL in `src/content`. |
| `bun run build` | Build the site. |
| `bun run preview` | Build the site and serve the build. |

### Generated files

These write files that are committed, so run them and commit the result with the change that needs them.

| Command | When to run it |
| --- | --- |
| `bun run generate:doc-tests` | After any change to a SurrealQL example. Writes `tests/doc-examples.surql`. |
| `bun run generate:llms` | After a page is added, moved or renamed, or its `description` changes. Writes `public/llms.txt`. |
| `bun run generate:related` | To refresh the related University lessons and blog posts shown at the end of a page. Writes `src/data/related.json`. |
| `bun run generate:labs-blog` | After blog posts are published, to list them in Labs. Writes `src/data/labs-blog.json`. |
| `bun run generate:cli-history` | After a SurrealDB release is tagged, to update the environment variable and flag history chart. |

### Diagrams and screenshots

| Command | What it does |
| --- | --- |
| `bun run diagrams:render [name]` | Draw a figure from `scripts/diagrams/figures` as light and dark WebP files. |
| `bun run diagrams:check` | List the figures whose page sections changed since they were drawn. Use `--accept <name>` when a figure still matches. |
| `bun run screenshots:check` | List the Studio screenshots whose interface has changed, from a local clone of surrealdb/studio. |
| `bun run screenshots:capture` | Take the scripted Studio screenshots again. |

### Search and deployment

| Command | What it does |
| --- | --- |
| `bun run search:serve` | Serve the search API locally. |
| `bun run search:index` | Index the content into the search database. Needs the search database credentials. |
| `bun run build:cloudflare` | Build the Cloudflare Worker. Vercel serves production, and the Worker serves previews. |
| `bun run test:routes` | Check the route table compiled from `vercel.ts` and `redirects.ts`. |

`bun run build` ends with `postbuild`, which indexes the content for search. It skips itself on Vercel previews and in CI. On your own machine, without the search database credentials, it reports an error after the build has finished, and the build output is still complete.

## Before you open a pull request

Run these, and fix what they report:

```bash
bun run qa
bun run qc
bun run check:links
bun run generate:doc-tests
bun run diagrams:check
```

Commit `tests/doc-examples.surql` if it changed. For every figure that `diagrams:check` lists, either update the figure or accept it, as [Keeping figures accurate](AGENTS.md#keeping-figures-accurate) describes.

## What CI checks

The CI workflow runs on every push, including pushes to a pull request's branch. Merging into `main` needs an approving review, but a failing job does not block the merge, so check that every job has passed before you merge.

| Job | Runs | Fails when | To fix it |
| --- | --- | --- | --- |
| Code Quality | `bun run qau` | Biome finds a formatting or lint error that it cannot fix itself. | Run `bun run qa`, then `bun run qc`, and fix what remains. |
| Build docs | `bun run build` | A page does not build: for example a frontmatter key that `src/utils/schema.ts` does not allow, an `icon` that does not exist, or a component used wrongly. | Run `bun run build` and read the first error. |
| Route table | `bun run test:routes` | A rule in `redirects.ts` or `vercel.ts` compiles to a route that the Worker would serve differently from Vercel. | Run `bun run test:routes`. |
| Internal links | `bun run check:links` | A link points at a page that does not exist, an anchor names no heading on its page, or a short URL is broken or missing. | Fix the link. A renamed heading changes its anchor, so update every link to it. |
| Internal links | `bun run generate:doc-tests --check` | `tests/doc-examples.surql` does not match the examples in `src/content`. | Run `bun run generate:doc-tests` and commit the file. |

A push to `main` also starts the **Re-index docs search** workflow, which updates search from the new content. It can be started by hand for staging from the Actions tab.

## Writing documentation

Each folder under `src/content` with a `+Content.ts` file is a collection, and each `.md` or `.mdx` file in it is a page. The frontmatter takes `title`, `description`, `position`, `icon` and `hidden`, and nothing else: the schema in `src/utils/schema.ts` refuses an unknown key. A folder's `__category.json` gives the section its title, position and icon in the sidebar.

- Set `position` on every page you add or move. Positions are whole numbers.
- A page that moves needs a redirect in `redirects.ts` from its old URL.
- The `description` does not appear on the page. It is used for search, for `llms.txt` and for the page's meta description, so the first paragraph of the page has to introduce it.
- Raw HTML is removed when a page renders. Use the components that `AGENTS.md` lists, such as `<YouTube>` for a video.

Adding a collection, the redirect rules, the components and the writing conventions are all described in [`AGENTS.md`](AGENTS.md).

## Tested examples

Every SurrealQL example in the documentation is a test. `bun run generate:doc-tests` writes them to `tests/doc-examples.surql`, and the language-test runner in the SurrealDB repository runs them against the engine.

- An example has to run as written on an empty database. Put any setup it needs at the top of the block, under a `-- Setup` line, followed by a blank line.
- A result goes in a fence titled `Output` directly below the example, or on a `//-` line below the statement that returns it.
- Mark a block `notest` (```` ```surql notest ````) only when it cannot run on its own, such as a template whose values an application supplies.
- A signature such as `math::abs(number) -> number` goes in a ```` ```syntax ```` fence, which is never a test.

[Tested examples](AGENTS.md#tested-examples) in `AGENTS.md` has the full rules.

## Labs

[Labs](https://surrealdb.com/docs/labs) lists projects, articles and videos from SurrealDB and the community. Each entry is a file in `src/content/labs-items`. `bun run make:lab` asks for the details and writes the file, or you can copy an existing entry. Blog posts in Labs come from `src/data/labs-blog.json` instead.

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
