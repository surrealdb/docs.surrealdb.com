/**
 * The documentation pages and their URLs, derived from the content tree and the
 * router. Shared by the generators under `scripts/`, so that every generated
 * file agrees with the others and with the router about what a page's URL is.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const CONTENT_DIR = "src/content";
export const PAGES_DIR = "src/pages";
export const SITE = "https://surrealdb.com";

/** Read a page's frontmatter without pulling in a YAML parser. */
export function frontmatter(file) {
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
export function slugify(segment) {
    return segment
        .toLowerCase()
        .replace(/[^a-z0-9\s\-_]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

export function walk(dir) {
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
export function readCollections() {
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

export function findDataFiles(dir) {
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

/**
 * Shallowest first, then by URL.
 *
 * Compared by code unit rather than `localeCompare`, because collation varies
 * with the runtime's locale and this ordering has to be reproducible on any
 * machine that runs `prebuild`.
 */
export function byDepthThenUrl(a, b) {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.url < b.url ? -1 : a.url > b.url ? 1 : 0;
}

export function pagesFor(id, prefix) {
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
            file,
            title: meta.title,
            description: meta.description ?? "",
            // Unset sorts last, so an unprioritised page keeps the depth
            // ordering it had before this field existed.
            priority: Number.isFinite(Number(meta.priority))
                ? Number(meta.priority)
                : Number.POSITIVE_INFINITY,
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
