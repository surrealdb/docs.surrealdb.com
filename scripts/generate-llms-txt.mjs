/**
 * Builds `public/llms.txt` from the content tree.
 *
 * The file used to be maintained by hand and had drifted badly: a quarter of
 * its links pointed at routes that no longer existed, and its section headings
 * described a navigation we replaced. Since agents now read this file as a
 * primary way into the docs, it has to be derived rather than remembered.
 *
 * Two things are generated:
 *
 *   - the section map, from each collection's `__category.json`
 *   - the links, from every page's frontmatter title and description
 *
 * Collection ids and their URL prefixes are read out of the page groups'
 * `+data.ts` calls, so a renamed collection cannot silently produce dead links
 * here - the same source the router uses is the source this reads.
 *
 * Every page is listed. Descriptions are not: they are spent shallowest-first
 * out of what is left under `SIZE_BUDGET`, so the file stays inside the size an
 * index is read at however much the documentation grows.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { byDepthThenUrl, CONTENT_DIR, pagesFor, readCollections, SITE } from "./lib/docs-pages.mjs";

const OUTPUT_FILE = "public/llms.txt";

/**
 * Character ceiling for the whole file.
 *
 * The readiness checks are `agent-ecosystem/afdocs`, which scores llms.txt size
 * in three bands: pass at 50,000 characters or under, warn to 100,000, fail
 * above it. Listing every page costs about 88,000 characters in links and
 * titles alone, so **pass is unreachable** while the index stays complete, and
 * warn is the permanent state. Descriptions are spent out of what is left.
 *
 * 99,000 is therefore chosen against the fail threshold rather than the pass
 * one: it is the most description budget available without leaving the band the
 * file already sits in. Every character between here and 100,000 is free, and
 * the 1,000 left over is roughly eleven new pages of runway at about 87
 * characters of floor each.
 *
 * Raising it past 100,000 is a real option rather than a broken one - nothing
 * fails to work, the check simply scores fail - but it buys less than it looks:
 * 110,000 describes about 31% of pages and 120,000 about 45%, while describing
 * all of them needs roughly 160,000. Splitting per section does not help the
 * score either, because afdocs only ever looks at `{base}/llms.txt`,
 * `{origin}/llms.txt` and `{origin}/docs/llms.txt` - a nested index file is
 * never discovered.
 */
const SIZE_BUDGET = 99_000;

/** Collections that are not part of the documentation tree. */
const SKIP_COLLECTIONS = new Set(["labs-items"]);

/**
 * Pages that exist as routes but not as entries in a documentation collection,
 * so the walk below cannot find them.
 *
 * `/docs/labs` renders the `labs-items` collection as a listing rather than
 * being a page in it, which left it in the sitemap and absent from the index.
 * Keyed by section so it lands under the right heading.
 */
const EXTRA_PAGES = {
    explore: [
        {
            url: `${SITE}/docs/labs`,
            title: "SurrealDB Labs",
            description: "Talks, videos and experiments from the team and the community.",
            depth: 1,
        },
    ],
};

/**
 * Preamble. Prose, so it stays hand-written - it is the only part of this file
 * a person should edit.
 */
const PREAMBLE = `# SurrealDB Documentation

SurrealDB is a [multi-model database](${SITE}/features) that stores relational, document, graph, time-series, vector, full-text and key-value data in one place, queried through [SurrealQL](${SITE}/docs/reference/query-language). It runs embedded in an application, as a single node, or as a distributed cluster, and is also available as [SurrealDB Agent Memory](${SITE}/docs/agent-memory), a memory and knowledge layer for AI agents.

> Markdown for agents: every documentation page is also available as markdown. Append ".md" to any page path to fetch it directly, for example "${SITE}/docs/reference/query-language/statements/select.md". The same document is served on the page's own URL to a request sending an "Accept: text/markdown" header, with "Content-Type: text/markdown" and an "x-markdown-tokens" estimate. HTML stays the default for browsers. Links inside a markdown page already point at the ".md" variants, so following them keeps an agent in markdown. The complete documentation is also available as a single markdown document at "${SITE}/docs/llms-full.txt".

This index lists every documentation page. Section landing pages carry a short description; the rest are titles only, so that the whole site fits in one index rather than a curated part of it. A missing description means nothing about the page - fetch any entry with ".md" appended to read it, or "${SITE}/docs/llms-full.txt" for everything at once.

Working notes:

- SurrealQL is the native query language. [GraphQL](${SITE}/docs/learn/querying/graphql/overview), [HTTP](${SITE}/docs/reference/rest-api/http-protocol), [RPC](${SITE}/docs/reference/rest-api/rpc-protocol) and [CBOR](${SITE}/docs/reference/rest-api/cbor-protocol) are also available.
- Live queries push changes to subscribers rather than requiring polling.
- The same database serves documents, graphs, vectors and time series inside one ACID transaction, so joins across models do not need a second store.
`;

/** Longest description this file will carry for one entry. */
const DESCRIPTION_BUDGET = 70;

/**
 * Shorten a page description to what an index entry needs.
 *
 * A frontmatter description is written to be a meta description, where three
 * clauses are fine. Across a thousand entries those later clauses are what
 * pushes the file past the size an agent will read, and they are the least
 * load-bearing part of the line: the index only has to support the choice of
 * which page to fetch, and the first sentence already settles that.
 *
 * So: first sentence, then a word-boundary cut if that sentence is still long.
 * The cut keeps whole words because a truncated identifier is worse than a
 * missing one - an agent can act on `array::distinct` and cannot act on
 * `array::dist`.
 *
 * A sentence ends at a full stop followed by a capital, and at nothing else.
 * Matching `!` and `?` too cut "The embed_schema! macro bakes your .surql
 * schema files into the Rust binary" down to "The embed_schema!", which looks
 * like a finished description and is not - Rust macros, and any method whose
 * name ends in `?`, all read as sentence ends. Requiring a capital after the
 * stop also leaves `.surql` and version numbers alone. Where no boundary
 * matches, the budget below still trims, and a visible `...` is honest in a
 * way a confident half-sentence is not.
 */
function summariseDescription(description) {
    const sentence = (description.match(/^.*?\.(?=\s+[A-Z])/)?.[0] ?? description).trim();

    if (sentence.length <= DESCRIPTION_BUDGET) return sentence;

    const cut = sentence.slice(0, DESCRIPTION_BUDGET);
    const boundary = cut.lastIndexOf(" ");

    return `${(boundary > 0 ? cut.slice(0, boundary) : cut).replace(/[,;:.]$/, "")}...`;
}

function collectionPosition(id) {
    const file = join(CONTENT_DIR, id, "__category.json");

    if (!existsSync(file)) return 999;

    try {
        return JSON.parse(readFileSync(file, "utf8")).position ?? 999;
    } catch {
        return 999;
    }
}

/**
 * Orders the queue that `describableUrls` spends its budget down.
 *
 * Separate from `byDepthThenUrl` on purpose: that one fixes the order pages
 * are *listed* in, which is the reader's path through the index and should not
 * move because a page was marked important. This one decides only which pages
 * are offered a description before the budget runs out.
 */
function byPriorityThenDepth(a, b) {
    // Defaulted here rather than trusted from the page object, because
    // `EXTRA_PAGES` is written by hand and carries no `priority`. Subtracting
    // an absent one gives `NaN`, and a comparator that returns `NaN` sorts
    // arbitrarily - which showed up as unrelated pages trading descriptions.
    const pa = a.priority ?? Number.POSITIVE_INFINITY;
    const pb = b.priority ?? Number.POSITIVE_INFINITY;

    if (pa !== pb) return pa - pb;

    return byDepthThenUrl(a, b);
}

/** The sections, in the order they are written. */
const ORDER = ["index", "learn", "build", "manage", "explore", "reference", "agent-memory"];

/** Group collections by their first path segment, which is the top-level nav. */
function sectionOf(id) {
    return id === "index" ? "index" : id.split("/")[0];
}

/**
 * The section a page is listed under.
 *
 * The collection id decides normally, but the five section hubs - `/docs/learn`,
 * `/docs/build` and the rest - live in the root `index` collection, because a
 * `+Content.ts` one level up would recurse into the collections beneath it and
 * index every page twice. Their id therefore says "Get started" while their URL
 * says otherwise, and an agent scanning `## Learn` for the Learn hub did not
 * find it there.
 *
 * So the URL wins where its leading segment names a section, and the id is the
 * fallback - which is what keeps the rest of the `index` collection
 * (`/docs/languages/*`, `/docs/running/*`, `/docs/frameworks/*`) under Get
 * started, where it belongs and where no section heading would take it.
 */
function sectionForPage(url, fallback) {
    const [first] = url.slice(`${SITE}/docs`.length).replace(/^\//, "").split("/");

    return ORDER.includes(first) ? first : fallback;
}

const collections = readCollections();
const sections = new Map();

for (const [id, prefix] of collections) {
    if (SKIP_COLLECTIONS.has(id)) continue;

    const fallback = sectionOf(id);

    for (const page of pagesFor(id, prefix)) {
        const key = sectionForPage(page.url, fallback);
        const group = sections.get(key) ?? { pages: [], position: collectionPosition(id) };

        group.pages.push(page);
        sections.set(key, group);
    }
}

for (const [key, pages] of Object.entries(EXTRA_PAGES)) {
    const group = sections.get(key);

    if (!group) {
        console.warn(`[llms.txt] EXTRA_PAGES names section "${key}", which has no collections`);
        continue;
    }

    group.pages.push(...pages);
}

const SECTION_TITLES = {
    index: "Get started",
    learn: "Learn",
    build: "Build",
    manage: "Manage",
    explore: "Explore",
    reference: "Reference",
    "agent-memory": "Agent Memory",
};

/** Section list, deduplicated. */
const rendered = ORDER.filter((key) => sections.has(key)).map((key) => {
    const seen = new Set();

    // Sorted here rather than relying on `pagesFor`, which only orders one
    // collection at a time. A section concatenates several - `learn` is five -
    // in the order `readCollections` walked `src/pages`, which is `readdirSync`
    // order and so depends on the filesystem. Without this the file is stable
    // on the checkout that generated it and reordered on another, and
    // `prebuild` rewrites it on every machine whose directory order differs.
    // `EXTRA_PAGES` is appended after grouping, so it is placed here too.
    return {
        key,
        heading: `\n## ${SECTION_TITLES[key] ?? key}\n\n`,
        pages: [...sections.get(key).pages].sort(byDepthThenUrl).filter((page) => {
            if (seen.has(page.url)) return false;
            seen.add(page.url);
            return true;
        }),
    };
});

const bareLine = (page) => `- [${page.title}](${page.url})\n`;

/**
 * Decide which entries can afford a description.
 *
 * Every page is listed either way, so the floor is fixed: about 90 characters
 * of URL and title per page, which at the current page count is most of the
 * budget on its own. Descriptions are what is left over, and they are spent
 * shallowest-first, because a section landing page is what an agent reads to
 * decide where to go and a leaf is what it reads once it has decided.
 *
 * Spending a computed remainder rather than applying a fixed depth rule is what
 * keeps this from breaking quietly. The previous rule capped which pages
 * appeared at all, and left 568 of 1,013 unlisted - an agent reading the index
 * saw 44% of the documentation with nothing to say so. A fixed depth would have
 * the same failure mode against the size ceiling instead: correct when written,
 * silently over it a few dozen pages later. This degrades to title-only, which
 * costs detail and never costs coverage.
 */
function describableUrls() {
    const headings = rendered.reduce((n, section) => n + section.heading.length, 0);
    const bare = rendered.reduce(
        (n, section) => n + section.pages.reduce((m, page) => m + bareLine(page).length, 0),
        0,
    );

    let spent = PREAMBLE.length + headings + bare;
    const chosen = new Set();

    const candidates = rendered
        .flatMap((section) => section.pages)
        .filter((page) => page.description)
        .sort(byPriorityThenDepth);

    for (const page of candidates) {
        const cost = `: ${summariseDescription(page.description)}`.length;

        if (spent + cost > SIZE_BUDGET) continue;

        spent += cost;
        chosen.add(page.url);
    }

    return chosen;
}

const described = describableUrls();

let out = PREAMBLE;
let count = 0;

for (const section of rendered) {
    out += section.heading;

    for (const page of section.pages) {
        out += described.has(page.url)
            ? `- [${page.title}](${page.url}): ${summariseDescription(page.description)}\n`
            : bareLine(page);
        count += 1;
    }
}

for (const [key, group] of sections) {
    if (ORDER.includes(key)) continue;
    console.warn(
        `[llms.txt] collection group "${key}" is not in ORDER; ${group.pages.length} pages omitted`,
    );
}

writeFileSync(OUTPUT_FILE, out);
console.log(
    `[llms.txt] ${count} links across ${rendered.length} sections, ${described.size} described, ${out.length} characters`,
);
