/**
 * Checks every internal link in `src/content` against the pages that exist.
 *
 * A link is an absolute `/docs/...` path or a same-page `#anchor`, written as a
 * markdown link or an `href` attribute. Each one has to land on a content page,
 * a folder that resolves to one, a static page, a route the server answers, a
 * file in `public/`, or a redirect in `redirects.ts`. A link with an anchor also has to name a heading
 * on the page it lands on, after any redirect.
 *
 * Heading ids come from the UI kit's own `extractHeadings`, the function the
 * renderer uses, so the check agrees with the rendered page, including the
 * numeric suffix on a repeated heading (`setup`, `setup-1`).
 *
 * The build does not catch these: a broken link renders, and a broken anchor
 * scrolls nowhere. An audit in November 2026 found 16 dead anchors and a link to
 * a page that had moved, all of which had shipped.
 *
 * Usage: bun scripts/check-links.ts
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { extractHeadings, markdownSourceFromString, parseMarkdownTree } from "@surrealdb/ui";
import { resolveRedirect } from "../redirects";
import { CONTENT_DIR, PAGES_DIR, readCollections, slugify, walk } from "./lib/docs-pages.mjs";

const PUBLIC_DIR = "public";

interface Page {
    file: string;
    url: string;
}

interface Problem {
    file: string;
    line: number;
    link: string;
    reason: string;
}

/** `/docs/a/b/` and `/docs/a/b.md` both name the page `/docs/a/b`. */
function normalise(path: string): string {
    const trimmed = path.replace(/\/+$/, "").replace(/\.md$/, "");
    return trimmed === "" ? "/docs" : trimmed;
}

function urlFor(segments: string[], prefix: string): string {
    const path = [prefix, ...segments].filter(Boolean).join("/");
    return normalise(`/docs${path ? `/${path}` : ""}`);
}

/**
 * Every content page and every folder inside a collection, keyed by URL.
 *
 * Hidden pages count: they still build and answer by URL. A folder counts
 * because the router sends a folder without a page of its own to its first
 * child (`resolveFolderLanding` in `src/utils/navigation.ts`).
 */
function contentRoutes(): { pages: Map<string, Page>; folders: Set<string> } {
    const pages = new Map<string, Page>();
    const folders = new Set<string>();

    for (const [id, prefix] of readCollections()) {
        const root = join(CONTENT_DIR, id);

        if (!existsSync(root)) continue;

        for (const file of walk(root)) {
            const rel = relative(root, file).replace(/\.(mdx|md)$/, "");

            if (rel.includes("__category")) continue;

            const segments = rel.split("/").map(slugify);

            if (segments.at(-1) === "index") segments.pop();

            pages.set(urlFor(segments, prefix), { file, url: urlFor(segments, prefix) });

            for (let depth = 1; depth < segments.length; depth++) {
                folders.add(urlFor(segments.slice(0, depth), prefix));
            }
        }
    }

    return { pages, folders };
}

/** Page folders under `src/pages` that are served as they are, without a route function. */
function staticRoutes(dir = PAGES_DIR, found = new Set<string>()): Set<string> {
    const entries = readdirSync(dir);

    if (entries.some((entry) => entry.startsWith("+Page.")) && !entries.includes("+route.ts")) {
        found.add(normalise(`/docs/${relative(PAGES_DIR, dir)}`));
    }

    for (const entry of entries) {
        const full = join(dir, entry);

        if (statSync(full).isDirectory() && !entry.startsWith("_") && !entry.startsWith("@")) {
            staticRoutes(full, found);
        }
    }

    return found;
}

/**
 * Literal paths the server answers itself, such as `/docs/llms-full.txt`, read
 * from `src/pages/+server.ts` rather than restated. A route with a parameter is
 * left out, because a link to it cannot be checked without running it.
 */
function serverRoutes(): Set<string> {
    const source = readFileSync(join(PAGES_DIR, "+server.ts"), "utf8");
    const routes = new Set<string>();

    for (const match of source.matchAll(/app\.(?:get|all)\(`\$\{BASE\}(\/[^`]+)`/g)) {
        if (!match[1].includes(":")) routes.add(normalise(`/docs${match[1]}`));
    }

    return routes;
}

function isPublicFile(path: string): boolean {
    const rel = path.replace(/^\/docs\/?/, "");
    return (
        rel !== "" && existsSync(join(PUBLIC_DIR, rel)) && statSync(join(PUBLIC_DIR, rel)).isFile()
    );
}

/** Where a path ends up after redirects, or undefined when no redirect matches. */
function followRedirects(path: string): string | undefined {
    let current = path;

    for (let hop = 0; hop < 10; hop++) {
        const match = resolveRedirect(current) ?? resolveRedirect(current.replace(/^\/docs/, ""));

        if (!match) return hop === 0 ? undefined : current;

        current = normalise(match.destination.split("#")[0].split("?")[0]);
    }

    return current;
}

/**
 * The page body as the renderer sees it, without the leading `#` title.
 *
 * Mirrors `stripLeadingH1` in `src/utils/markdown.tsx`, which is not imported
 * because that module pulls in the React components. Every heading level gets
 * an id on the page, and a repeated heading is numbered across all levels, so
 * the title has to be gone before the slugs are counted.
 */
function withoutLeadingH1(markdown: string): string {
    const first = parseMarkdownTree(markdown).topNode.firstChild;

    if (first?.name !== "ATXHeading1") return markdown;

    const source = markdownSourceFromString(markdown);
    return source.slice(source.lineAt(first.from).to, source.length).replace(/^\n+/, "");
}

const anchorCache = new Map<string, Set<string>>();

/** The heading ids a page renders, plus any `id` it sets explicitly. */
function anchorsFor(file: string): Set<string> {
    const cached = anchorCache.get(file);
    if (cached) return cached;

    const body = withoutLeadingH1(readFileSync(file, "utf8").replace(/^---\n[\s\S]*?\n---\n/, ""));
    const ids = new Set(
        extractHeadings(parseMarkdownTree(body), markdownSourceFromString(body), {
            depths: [1, 2, 3, 4, 5, 6],
        }).map((heading) => heading.id),
    );

    for (const match of body.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(match[1]);

    anchorCache.set(file, ids);
    return ids;
}

const LINK_PATTERNS = [
    /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g,
    /\bhref=\{?["']([^"']+)["']\}?/g,
];

/** Internal links on each line of a file, outside fenced code blocks and inline code. */
function* linksIn(file: string): Generator<{ line: number; link: string }> {
    const lines = readFileSync(file, "utf8").split("\n");
    let fence: string | undefined;

    for (const [index, raw] of lines.entries()) {
        const marker = raw.match(/^\s*(`{3,}|~{3,})/)?.[1];

        if (marker) {
            if (!fence) fence = marker;
            else if (marker.startsWith(fence[0]) && marker.length >= fence.length)
                fence = undefined;
            continue;
        }

        if (fence) continue;

        const text = raw.replace(/`[^`]*`/g, "");

        for (const pattern of LINK_PATTERNS) {
            for (const match of text.matchAll(pattern)) {
                const link = match[1];
                if (link.startsWith("/docs") || link.startsWith("#")) {
                    yield { line: index + 1, link };
                }
            }
        }
    }
}

const { pages, folders } = contentRoutes();
const statics = new Set([...staticRoutes(), ...serverRoutes()]);
const problems: Problem[] = [];
let checked = 0;

/** The content page a path lands on, if it is one. */
function pageAt(path: string): Page | undefined {
    return pages.get(path);
}

for (const page of pages.values()) {
    for (const { line, link } of linksIn(page.file)) {
        checked++;

        const [target, anchor] = link.split("#") as [string, string | undefined];
        const path = target === "" ? page.url : normalise(target.split("?")[0]);
        const report = (reason: string) =>
            problems.push({ file: relative(CONTENT_DIR, page.file), line, link, reason });

        let landing = pageAt(path);

        if (!landing && !folders.has(path) && !statics.has(path) && !isPublicFile(path)) {
            const redirected = followRedirects(path);

            if (!redirected) {
                report("no page, folder, static file or redirect at this path");
                continue;
            }

            landing = pageAt(redirected);

            if (!landing && !folders.has(redirected) && !statics.has(redirected)) {
                report(`redirects to ${redirected}, which does not exist`);
                continue;
            }
        }

        if (anchor && landing && !anchorsFor(landing.file).has(anchor)) {
            report(`no heading with the id "${anchor}" on ${landing.url}`);
        }
    }
}

for (const problem of problems) {
    console.error(`${problem.file}:${problem.line}  ${problem.link}\n    ${problem.reason}`);
}

console.log(
    `[links] ${checked} internal links checked across ${pages.size} pages, ${problems.length} broken`,
);

if (problems.length > 0) process.exit(1);
