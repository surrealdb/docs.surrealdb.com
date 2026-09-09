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

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const CONTENT_DIR = "src/content";
const PAGES_DIR = "src/pages";
const OUTPUT_FILE = "public/llms.txt";
const SITE = "https://surrealdb.com";

/**
 * Character ceiling for the whole file.
 *
 * The readiness checks treat an llms.txt over 100,000 characters as too large
 * to be a useful index, and this file is close to that floor before a single
 * description is written: 1,000-odd pages at about 90 characters of URL and
 * title each. The remainder is what `describableUrls` has to spend, and the
 * margin below 100,000 is what stops a few dozen new pages from breaching it.
 */
const SIZE_BUDGET = 96_000;

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

/** Read a page's frontmatter without pulling in a YAML parser. */
function frontmatter(file) {
    const text = readFileSync(file, "utf8");

    if (!text.startsWith("---")) return {};

    const end = text.indexOf("\n---", 3);
    if (end === -1) return {};

    const meta = {};

    for (const line of text.slice(3, end).split("\n")) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (!match) continue;

        const [, key, raw] = match;
        meta[key] = raw.trim().replace(/^["'](.*)["']$/, "$1");
    }

    return meta;
}

/**
 * Mirrors `github-slugger` for the shapes that appear in these paths.
 *
 * Underscores survive - they are word characters, so the slugger keeps them.
 * Stripping them here produced `listenlive` for `listen_live.mdx`, a URL that
 * 404s, and the depth cap used to hide the mistake by never listing the page.
 */
function slugify(segment) {
    return segment
        .toLowerCase()
        .replace(/[^a-z0-9\s\-_]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

function walk(dir) {
    const found = [];

    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);

        if (statSync(full).isDirectory()) {
            found.push(...walk(full));
        } else if (entry.endsWith(".mdx") || entry.endsWith(".md")) {
            found.push(full);
        }
    }

    return found;
}

/**
 * Collection ids and URL prefixes, taken from the router rather than restated.
 * A group without an explicit prefix serves the collection under its own id.
 */
function readCollections() {
    const collections = new Map();

    for (const file of findDataFiles(PAGES_DIR)) {
        if (!file.endsWith("+data.ts")) continue;

        const source = readFileSync(file, "utf8");
        const call = source.match(
            /resolveDataFromCollection\(\s*context\s*,\s*"([^"]+)"(?:\s*,\s*"([^"]*)")?/,
        );

        if (!call) continue;

        const [, id, prefix] = call;
        collections.set(id, prefix ?? id);
    }

    return collections;
}

function findDataFiles(dir) {
    const found = [];

    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);

        if (statSync(full).isDirectory()) {
            found.push(...findDataFiles(full));
        } else if (entry === "+data.ts") {
            found.push(full);
        }
    }

    return found;
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
 * Shallowest first, then by URL.
 *
 * Compared by code unit rather than `localeCompare`, because collation varies
 * with the runtime's locale and this ordering has to be reproducible on any
 * machine that runs `prebuild`.
 */
function byDepthThenUrl(a, b) {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.url < b.url ? -1 : a.url > b.url ? 1 : 0;
}

function pagesFor(id, prefix) {
    const root = join(CONTENT_DIR, id);

    if (!existsSync(root)) return [];

    const pages = [];

    for (const file of walk(root)) {
        const rel = relative(root, file).replace(/\.(mdx|md)$/, "");

        if (rel.includes("__category")) continue;

        const segments = rel.split("/").map(slugify);

        if (segments.at(-1) === "index") segments.pop();

        const meta = frontmatter(file);

        if (meta.hidden === "true") continue;
        if (!meta.title) continue;

        const path = [prefix, ...segments].filter(Boolean).join("/");

        pages.push({
            url: `${SITE}/docs${path ? `/${path}` : ""}`,
            title: meta.title,
            description: meta.description ?? "",
            // Counted on the URL rather than on the slug, because a section
            // holds several collections and a slug's depth is measured from
            // its own collection root. `/docs/learn/data-models` is that
            // collection's index, so its slug depth is 0, which sorted it
            // above `/docs/learn` - the hub that introduces it.
            depth: path ? path.split("/").length : 0,
        });
    }

    return pages.sort(byDepthThenUrl);
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
        .sort(byDepthThenUrl);

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
