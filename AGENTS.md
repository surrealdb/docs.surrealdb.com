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

That opening sentence is the only orientation a reader gets, because the
frontmatter `description` is **not rendered on the page**. It feeds
`<meta name="description">`, the search index and `llms.txt`, all of which want
dense front-loaded terms, and it was displayed as a subtitle between April and
September 2026. Rendering it gave every page two openers, and on an eighth of
them the description restated the first `##` sitting directly beneath it. So
write the description for a search result and an index, and write the first
paragraph for the reader - a page that dives straight into its first `##` now
has nothing to orient anyone. `bun run generate:llms` regenerates the index
after a description changes.

**Prose style.** Short paragraphs, mostly declarative sentences. Define terms on
first use. Prefer concrete claims ("datetimes drop from nanoseconds to
milliseconds") over vague importance ("crucial for modern workflows"). Use
tables when comparing options (codecs, deployment modes, auth methods). Link to
related pages inline rather than duplicating full explanations.

**Examples.** Runnable code with realistic data. SurrealQL reference pages often
include inline test assertions and response blocks. SDK pages show imports,
configuration, and the trade-off when an option changes behaviour. Tutorials
include verification steps so readers can confirm the setup worked. A
`DEFINE FUNCTION` example carries an explicit `-> type` return annotation
matching the value the body actually produces, except where the example
demonstrates that the annotation is optional or the function exists only for
its side effects.

**Example credentials.** A password in an example should look like a password.
Using `root` for both the username and the password suggests the value has
something to do with being a root user, and makes the two hard to tell apart in
a command line or a connection string. The default is `secret`; where an example
needs a second one, or a more realistic one, anything obviously a password works
(`hunter123`, `strongPassword`). The username itself stays `root` where that is
the user being signed in as. This one drifts back easily, so check the
surrounding examples rather than copying whichever is nearest.

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

**`IF` blocks.** Always write a conditional as `IF @condition { … }`, with any
`ELSE IF` and `ELSE` taking blocks of their own. The older
`IF @condition THEN @expression ELSE @expression END` form still parses, but it
is kept for compatibility rather than recommended, and no example should teach
it. Its branch holds a single expression rather than a block, so a branch cannot
take a `LET`, a `THROW`, a `BREAK`, a `CONTINUE`, or two statements separated by
`;`. Adding a second statement reports
`Parse error: Unexpected token 'CREATE', expected if to end`, which points at
the wrong token and names a construct the reader never wrote. The form also
persists: a `DEFINE FUNCTION`, `DEFINE FIELD` or `DEFINE EVENT` keeps a body in
the schema, and the stored form is never normalised, so `INFO FOR DB` and
`surreal export` both emit `THEN … END` again and `surreal import` has to parse
it back. That round trip is what keeps the parse path in the server, so treat
the syntax as permanent and simply never teach it.

The word `THEN` is unrelated and correct in `DEFINE EVENT … THEN`,
`DEFINE API … THEN` and `REFERENCE ON DELETE THEN`, where it is the only syntax.
Leave those, and leave historical `THEN … END` in release notes and migration
pages, which stay chronological.

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

**Showing output.** An example's result goes in its own fence directly below the
code, titled `Output`:

```surql
math::sum([ 26.164, 13.746189, 23, 16.4, 41.42 ]);
```

```surql title="Output"
120.730189f
```

The renderer joins an adjacent pair into one block with a divider, so the pair
costs about two lines more than a trailing comment while staying unambiguous.
Nothing to write for that: `wrapOutputPairs` inserts the `<CodeWithOutput>`
wrapper while parsing, and the raw `.md` endpoints keep both fences so an agent
can tell which half is runnable.

`Output` is the plain label, and `Response` is kept only on the HTTP and RPC
pages, where it is the counterpart of a `Request` block. Anything with the word
`output` in it pairs and renders in full, so reach for a qualifier whenever the
value shown is one of several a reader might see - `Sample output` and
`Possible output` for a generated record id, a datetime or a live API,
`Expected output` for a value a test asserts, `Error output` for a failure, or a
condition spelled out as in `title="Output when $transfer_amount set to 150"`.
`Response` and `Result` only pair at the start of a title, because a code block
titled for what it does with a response (`Handle Individual Responses`,
`Map results onto a dataclass`) would otherwise be joined to the example above
it as though it were its output.

The language names the format of the bytes, so `surql` for SurrealQL value
notation, `json` for HTTP JSON, `text` or `bash` for terminal output.

Where several statements in one block each have a result, the result stays a
comment, marked `//-` so it is not read as commentary:

```surql
array::all([ 1, 2, 3, NONE, 'SurrealDB', 5 ]);
//- false

["all", "clear"].all();
//- true
```

`//-` refers to the statement directly above it, always, and a `--` label
describes the statement directly below it. That is what makes either signal
decodable on its own: position and marker say the same thing, so a reader or an
agent that goes by one of them lands in the same place. A result above its
statement, or a label below it, breaks that.

Everything after `//-` is the value, verbatim, and nothing else - no `Returns`,
no trailing note, no parenthetical. The marker already says the line is a
result, so `Returns` is always redundant, and a note riding along behind the
value leaves the value unextractable: a reader cannot take the rest of the line,
and no delimiter helps, because a value can itself end in `)`. Put the remark on
a `--` label above the statement, where it has room:

```surql
-- Not inside an array, unlike a SELECT
CREATE ONLY cat:one;
//- { id: cat:one }
```

Because `//-` asserts that the statement returned this, a value a rerun would
not reproduce needs the label above to say so - the inline counterpart of the
`Possible output` and `Sample output` fence titles:

```surql
-- Possible output, since the timeout may or may not be exceeded
sequence::nextval('mySeq3');
//- 'The query was not executed because it exceeded the timeout'
```

Reserve that for when the varying thing *is* the value: a random datetime, a
live query id, a timeout that may or may not fire. A generated record id sitting
inside a returned record is incidental - the reader sees the same shape with a
different suffix - and caveating those would put a note on most examples in the
docs while telling the reader nothing they cannot see.

SurrealQL takes `--`, `//` and `#` as line comments, all equivalent to the
parser, and the docs spend two of them: **`--` for prose, `//-` for a result.**
Reserve `//-` for a value the server returned or an error it raised; prose about
the statement, a numbered step, or commented-out alternative code stays on `--`.
A bare `//` therefore means something was missed, which makes the convention
auditable with a single grep.

Three reasons the two roles take different tokens rather than `--` and `-->`:

- `--` is a **prefix** of `-->`, so any matcher has to test the longer form
  first, and getting that ordering wrong fails in the worse direction - a prose
  detector keyed on `^--` swallows results and reads them as commentary. `--`
  and `//-` differ at the first character, so no ordering is involved.
- A `>` is **entity-encoded in the rendered page**. A marker containing one
  appears as `--&gt;` in the HTML a reader sees, so grepping the rendered page
  for it silently finds nothing - the same trap this guide documents for
  `" />`. `//-` escapes to nothing, so one string matches in the source, in the
  raw `.md` and in the rendered HTML alike, and a check written once holds on
  all three surfaces.
- `-->` is already SurrealDB's own parse-error location pointer (` --> [3:12]`),
  which appears inside error output on about ten pages. A marker that collides
  with something the server prints is ambiguous exactly where output is being
  quoted.

Three places keep `//` and must not be swept onto `--`: the exact strings
`// highlight-next-line`, `// highlight-start` and `// highlight-end`, which the
viewer's highlighter matches literally; comments inside an embedded JavaScript
`function() { … }` body, where `--` is a syntax error; and the
[Comments](src/content/reference/query-language/language-primitives/comments.mdx)
page, whose subject is the three forms themselves. Where a comment states an outcome without
showing a value ("2: Statement will fail because the value for email was not
valid"), it is narration and stays on `--`.

A single result at the end of a block is a fence, not a comment, and the
dividing line is attribution. With one statement there is nothing a fence can
attribute wrongly, so it costs no clarity and gains two things: its copy button
yields the query alone, where an inline `//-` would ride along as a comment
holding a value that drifts, and `title="Output"` needs no legend in the raw
`.md` a per-page fetch returns, where `//-` relies on the agent inferring it.
With several statements each returning something, no fence can say which value
came from which statement without restating them, so the marker is the only form
that keeps the pairing - and it keeps the block paste-and-run, with its expected
values alongside for an agent to diff against.

On a block that sets up its data first, the fence labels the **last** statement,
the same convention `RETURN` follows: three `CREATE`s and then the `SELECT`
whose result is shown is one fence pair, not four.

**Callouts.** Use `> [!NOTE]`, `> [!WARNING]`, and `> [!IMPORTANT]` for
exceptions, security caveats, and breaking or easy-to-miss details.

**Page length.** The median page is around 480 words and the 90th percentile
around 1,700. Those are the working range, not a rule: what matters is that the
length follows from the page's job.

The failure to watch for is at the short end, because it is the one that looks
harmless. A page under about 200 words that carries no example of its own is
usually a heading that escaped its parent, and it costs more than it looks:
another sidebar row, another entry in `llms.txt`, another click, and a search
result that answers nothing. Fold it into the page above it. There were 259 of
these in September 2026, a quarter of the site.

Length on its own is not a reason to split. A reference index - every
environment variable, every function in a family, every method on a client - is
one page on purpose: a reader scanning it can search within it, and an agent
fetches it once. Splitting it means guessing which of five pages holds
`SURREAL_HTTP_MAX_SQL_BODY_SIZE`. Split when a page has stopped being about one
thing, not when it passes a word count.

**One home per topic.** Where a subject genuinely needs both a guide and a
reference, write both, and give them titles that survive being seen apart -
"Python quickstart" against "Python SDK", "Authenticating surrealctl" against
"Authentication reference". Two pages called "Authentication" are
indistinguishable in a search result, in `llms.txt`, and to an agent choosing
which to fetch. Whichever page is not the authority on a mechanism summarises it
in a sentence and links; the mechanism is written out once.

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

### Section hubs

`build`, `explore`, `learn`, `manage` and `reference` are directories full of
collections, not collections themselves - a `+Content.ts` at that level would
recurse into the collections beneath it and index every page twice. So the hub
page for each lives in the **root `index` collection**: `src/content/index/learn.mdx`
is what serves `/docs/learn`.

Each is also the `href` on its `NavMenuGroup` in `src/components/Layout/nav.ts`,
which is what makes the top-nav label a link rather than a menu opener. Adding a
section means adding both, or the label goes back to naming a page that does not
exist. All five 404'd until September 2026, which left the sections unlinkable,
unrankable, and unguessable by an agent constructing a path.

### Adding content

1. Create a `.md` or `.mdx` file in the appropriate `src/content/<collection>/` folder.
2. Add YAML frontmatter matching `pageSchema`.
3. Ordering comes from `position` in frontmatter for pages and from
   `__category.json` for folders. Both default to `0` and ties fall back to
   filesystem order, so set `position` explicitly on anything you add or move.
4. Never name a file after the folder it sits in. `authentication/authentication`
   says the same word twice in the URL and reads as a mistake; if the page is the
   folder's landing page it is `index`, and otherwise it is named after itself.

### Adding, renaming, or moving a collection

The content side needs `src/content/<id>/+Content.ts` and `__category.json`. The
page group `src/pages/<url-prefix>/` needs `+route.ts`, `+data.ts`, `+Page.tsx`,
`+Layout.tsx` and `+sitemapUrls.ts`. Then update:

- `src/utils/collections.ts` - `COLLECTION_ROUTES` powers the raw `.md` endpoint.
  Most specific prefix first; the `{ prefix: "", id: "index" }` catch-all stays last.
- `src/components/Layout/nav.ts` - top-nav hrefs are hardcoded.
- `redirects.ts` - old URLs to new URLs (see below).
- `public/llms.txt` - generated by `scripts/generate-llms-txt.mjs` from the
  content tree, on `prebuild` and via `bun run generate:llms`. Do not edit it by
  hand; the only hand-written part is the script's `PREAMBLE`. It reads
  collection ids and URL prefixes out of the page groups' `+data.ts` calls, so a
  renamed collection cannot silently leave dead links here - but regenerate and
  commit the result in the same change.
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

Markdown pages can use a small set of React components. Most are registered in
`registerMarkdownComponents` (`src/utils/markdown.tsx`); `<YouTube>` and
`<SurrealistMini>` come from `@surrealdb/ui` instead, so do not expect to find
every component in that file.

| Component                        | Use                                                           |
| -------------------------------- | ------------------------------------------------------------- |
| `<Synopsis>`                     | Usage or signature line for a command or method.              |
| `<OptionsTable>`                 | Reference table of CLI options, arguments, or SDK parameters. |
| `<Boxes>` with `<IconBox>`       | Card grid of links, used on section landing pages.            |
| `<Edition value="enterprise" />` | Community or Enterprise badge.                                |
| `<Version sdk="…" />`            | Inline current version number for an SDK.                     |
| `<YouTube code="…" />`           | Embedded video. The `code` is the YouTube id.                 |
| `<SurrealistMini query="…" />`   | Runnable query embed of a live editor.                        |

`<CodeWithOutput>` is absent from that table on purpose: `wrapOutputPairs` inserts
it around an output pair while parsing, and no page writes it by hand.

> [!IMPORTANT]
> Braced attribute values are parsed as **JSON**, not JavaScript. Object keys and
> strings need double quotes; an invalid value is dropped with a console warning.

> [!WARNING]
> **Raw HTML is stripped, silently.** The markdown pipeline renders registered
> components only, so a hand-written `<iframe>` produces nothing at all - no error,
> no empty box, and the tag's contents still appear in the page source, so grepping
> for `youtube` finds a video that no reader can see. Two pages carried a dead
> `<iframe>` this way until a reader reported one of them. Always embed a video with
> `<YouTube code="…" />`, and leave a blank line between the preceding paragraph and
> the tag so it parses as its own block.

### `<SurrealistMini>`

Pass the SurrealQL as a **`query`** attribute, with display options as sibling attributes:

```mdx
<SurrealistMini orientation="horizontal" query="CREATE person:john SET name = 'John';
SELECT * FROM person;
" />
```

Pick the attribute delimiter the query itself does not contain: `"` normally, or `'` where the SurrealQL uses double-quoted strings.

> [!WARNING]
> **Do not use a `url` attribute.** `url` is a valid key on the component's config type, but the markdown path drops it when it builds the iframe source, so the embed renders as an **empty editor** with no error. Neither the URL nor the `?query=` inside it survives. Eight pages carried a dead embed this way until a reader reported one of them, and the page still looked right because the iframe was there at its full size.

A `url` embed also costs the raw `.md` endpoints. The converter in `src/utils/mdx-to-markdown.ts` recovers the query from `?query=` as a fallback, but it then also emits the whole percent-encoded URL as a "Run this example" link - between 500 and 1,700 characters of unreadable blob per embed. The `query` form emits a clean ` ```surql ` fence and nothing else.

> [!WARNING]
> **No blank lines inside the attribute.** MDX ends a JSX flow element at a blank line, so a query containing one closes the attribute early: the editor gets the first part, and the rest of the query plus the literal `" />` render as body text on the page. Separate sections of a long query with `--` comments instead. This is the one failure here that is visible to a reader, and it still passed review twice because the leaked text reads like prose at a glance.

> [!WARNING]
> **Never write `` query={`…`} ``.** A braced value must be JSON, and a template literal is not, so the value is dropped and the embed renders as an empty editor. Four embeds on one page were dead this way. Use a quoted string.

Every one of these failures renders an iframe at full size, so a page looks correct whether or not the editor has anything in it. Reading the page is not a check. Compare the iframe count against the number carrying a query:

```bash
curl -s http://localhost:4321/docs/<path> \
  | grep -o '<iframe[^>]*src="[^"]*"' | tee /dev/stderr | grep -c 'query='
```

Any iframe without `query=` is a dead embed. To sweep for leaked attribute text, search the rendered page for `&quot; /&gt;` rather than `" />` - the page serves it entity-encoded, and grepping for the raw form finds nothing.

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
3. `wrapOutputPairs` - wrap a code fence and the `title="Output"` fence below it in
   `<CodeWithOutput>` so the pair renders as one block. Render-only:
   `composeRawMarkdown` shares steps 1 and 2 but not this one, so the `.md`
   endpoints keep the two fences separate.
4. `inlineSynopsisCommands` - move `<Synopsis>` bodies into the `command` attribute.
5. `injectIconScope` - quote `icon={{ … }}` keys and resolve icon identifiers to URLs.
6. `parseMarkdownTree` and `extractHeadings` (both from `@surrealdb/ui`) for the page aside.

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

## Markdown for agents

Four things advertise the markdown rendering, and they are easy to break one at
a time:

| What                                                      | Where                                                   |
| --------------------------------------------------------- | ------------------------------------------------------- |
| `<link rel="describedby">` and `rel="llms-txt"`           | `src/pages/+Head.tsx`                                   |
| `Link:` header on every response                          | the `app.use("*")` middleware in `src/pages/+server.ts` |
| `> Full SurrealDB documentation index: …` atop each `.md` | `withIndexPointer` in `src/utils/collections.ts`        |
| The index itself                                          | `public/llms.txt`                                       |

The first three exist because the fourth is useless to an agent that never
learns it is there. Content negotiation, `.md` URLs, `x-markdown-tokens` and
`llms-full.txt` were all shipped and none of them was announced, so a trace of
Claude Code looking for our authentication docs read rendering-heavy HTML for
602k tokens and 25 steps (September 2026).

`llms.txt` lists **every** page. It used to cap depth, which quietly excluded
568 of 1,013 pages, so the index described 44% of the documentation with nothing
to say which 44%. Descriptions are the part that flexes: `generate-llms-txt.mjs`
spends them shallowest-first out of what is left under `SIZE_BUDGET`. Do not
reintroduce a rule that drops pages - a page missing from the index is invisible
in a way a page missing its description is not.

The budget is a real constraint, not a formality. About 90 characters of URL and
title per page is the floor, so at the current page count most of the ceiling is
already spent before a description is written. If the file needs to get smaller,
the lever is fewer pages or shorter URLs, not a shorter preamble.

## Link graph

`search/schema.surql` carries a `links` relation next to the search tables: one
record per internal link, from the page holding it to the page it points at,
populated by `bun run search:links` (after `search:index`, since the endpoints
are `page` records). It exists to answer findability questions the search index
cannot - which pages nothing links to, and how much effort a reader spends
noticing the cheapest link that reaches them.

Each edge carries the link's `text`, its `kind` (`prose`, `card`, `table`,
`list`), how far into the page it sits (`offset_chars` and `offset_ratio`), and
a `weight` giving the effort to notice it. Two rules were learned the hard way
and are easy to reintroduce:

- **Weigh position for prose only.** The last row of a 32-row methods table sits
  at 97% of the page and is perfectly usable, because a reader there is scanning
  the table already. Penalising it ranks every long reference index as the worst
  page in the docs.
- **Weigh distance, not proportion.** 94% of a 2,400-character page is one
  scroll; 94% of a 124,000-character page is a different problem. The weight
  scales with characters past the first screenful, saturating at 30,000.

A line that is only links and separators (`→ [A] · [B] · [C]`) counts as
navigation rather than prose, and links a component renders rather than the
markdown spelling out - `<AgentPicker />` is the current case - are declared in
`COMPONENT_LINKS` in `search/scripts/links.ts`. Without that, a page whose only
route in is a component-rendered list looks unreachable.

### vike-content-collection APIs

**Used:** `defineCollection`, `getCollection`, `getCollectionEntry`,
`getCollectionTree`, `sortCollection`, `vikeContentCollectionPlugin`

**Not used:**

- `renderEntry` and the package's `extractHeadings` - rendering goes through `@surrealdb/ui`'s `parseMarkdownTree` + `MarkdownViewer`
- `getBreadcrumbs` - breadcrumbs come from `__category` lookups in `resolveDataFromCollection`
- `getAdjacentEntries`
- `getEntryUrl` - URLs come from the page group's URL prefix
