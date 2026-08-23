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
 * Depth is capped: this is an index, not an inventory. Deeper pages are reached
 * by following the sections, and every page is available as markdown by
 * appending `.md`, which the preamble explains.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const CONTENT_DIR = "src/content";
const PAGES_DIR = "src/pages";
const OUTPUT_FILE = "public/llms.txt";
const SITE = "https://surrealdb.com";

/**
 * How many path segments below a collection root to list.
 *
 * Two for the narrative sections, where the second level is where the actual
 * subjects live. One for reference, whose twelve SDK trees and the SurrealQL
 * statement list would otherwise account for most of the file - their landing
 * pages carry a reader onward, and every page is reachable as markdown anyway.
 */
const DEPTH = { default: 2, reference: 1 };

/** Collections that are not part of the documentation tree. */
const SKIP_COLLECTIONS = new Set(["labs-items"]);

/**
 * Preamble. Prose, so it stays hand-written - it is the only part of this file
 * a person should edit.
 */
const PREAMBLE = `# SurrealDB Documentation

SurrealDB is a [multi-model database](${SITE}/features) that stores relational, document, graph, time-series, vector, full-text and key-value data in one place, queried through [SurrealQL](${SITE}/docs/reference/query-language). It runs embedded in an application, as a single node, or as a distributed cluster, and is also available as [SurrealDB Agent Memory](${SITE}/docs/agent-memory), a memory and knowledge layer for AI agents.

> Markdown for agents: every documentation page is also available as markdown. Append ".md" to any page path to fetch it directly, for example "${SITE}/docs/reference/query-language/statements/select.md". The same document is served on the page's own URL to a request sending an "Accept: text/markdown" header, with "Content-Type: text/markdown" and an "x-markdown-tokens" estimate. HTML stays the default for browsers. Links inside a markdown page already point at the ".md" variants, so following them keeps an agent in markdown.

Working notes:

- SurrealQL is the native query language. [GraphQL](${SITE}/docs/learn/querying/graphql/overview), [HTTP](${SITE}/docs/reference/rest-api/http-protocol), [RPC](${SITE}/docs/reference/rest-api/rpc-protocol) and [CBOR](${SITE}/docs/reference/rest-api/cbor-protocol) are also available.
- Live queries push changes to subscribers rather than requiring polling.
- The same database serves documents, graphs, vectors and time series inside one ACID transaction, so joins across models do not need a second store.
`;

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

/** Mirrors `github-slugger` for the shapes that appear in these paths. */
function slugify(segment) {
    return segment
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
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

function pagesFor(id, prefix, maxDepth) {
    const root = join(CONTENT_DIR, id);

    if (!existsSync(root)) return [];

    const pages = [];

    for (const file of walk(root)) {
        const rel = relative(root, file).replace(/\.(mdx|md)$/, "");

        if (rel.includes("__category")) continue;

        const segments = rel.split("/").map(slugify);

        if (segments.at(-1) === "index") segments.pop();
        if (segments.length > maxDepth) continue;

        const meta = frontmatter(file);

        if (meta.hidden === "true") continue;
        if (!meta.title) continue;

        const path = [prefix, ...segments].filter(Boolean).join("/");

        pages.push({
            url: `${SITE}/docs${path ? `/${path}` : ""}`,
            title: meta.title,
            description: meta.description ?? "",
            depth: segments.length,
        });
    }

    return pages.sort((a, b) => a.depth - b.depth || a.url.localeCompare(b.url));
}

/** Group collections by their first path segment, which is the top-level nav. */
function sectionOf(id) {
    return id === "index" ? "index" : id.split("/")[0];
}

const collections = readCollections();
const sections = new Map();

for (const [id, prefix] of collections) {
    if (SKIP_COLLECTIONS.has(id)) continue;

    const key = sectionOf(id);
    const pages = pagesFor(id, prefix, DEPTH[key] ?? DEPTH.default);
    if (!pages.length) continue;

    const group = sections.get(key) ?? { pages: [], position: collectionPosition(id) };

    group.pages.push(...pages);
    sections.set(key, group);
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

const ORDER = ["index", "learn", "build", "manage", "explore", "reference", "agent-memory"];

let out = PREAMBLE;
let count = 0;

for (const key of ORDER) {
    const group = sections.get(key);
    if (!group) continue;

    const seen = new Set();
    const pages = group.pages.filter((page) => {
        if (seen.has(page.url)) return false;
        seen.add(page.url);
        return true;
    });

    out += `\n## ${SECTION_TITLES[key] ?? key}\n\n`;

    for (const page of pages) {
        out += page.description
            ? `- [${page.title}](${page.url}): ${page.description}\n`
            : `- [${page.title}](${page.url})\n`;
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
    `[llms.txt] ${count} links across ${ORDER.filter((k) => sections.has(k)).length} sections`,
);
