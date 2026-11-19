/**
 * Writes `generated/last-modified.json`: when each documentation page last
 * changed, taken from the git history of its source file.
 *
 * The dates feed the sitemap's `<lastmod>`, the "Last updated" line under each
 * page, `dateModified` in its `TechArticle` JSON-LD and `last_modified` in the
 * frontmatter of its markdown rendering. A page's date is the committer date
 * of the newest commit that added or changed its file. Labs, which is a
 * listing rather than a file, takes the newest of the two data files it lists.
 *
 * A shallow clone needs care. Vercel clones with `--depth=10` and CI checks out
 * one commit, and in a shallow history the oldest commit appears to add every
 * file, so its date would be given to every page that has not changed since.
 * So, in a shallow clone:
 *
 *   1. The script fetches the rest of the history first, commits and trees
 *      only (`--filter=blob:none`), which takes about a second for this
 *      repository. `DOCS_LAST_MODIFIED_FETCH=0` skips this.
 *   2. If the history is still shallow, because the fetch failed or was
 *      skipped, a file whose newest commit is a shallow boundary gets no date
 *      rather than a wrong one. Every file changed inside the history that is
 *      there keeps its real date.
 *
 * A page with no date leaves the date out of every place listed above. Without
 * git at all the file is written empty. It never fails the build.
 *
 * Run by `prebuild` and `build:cloudflare`. Output is gitignored (`generated/`).
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import { CONTENT_DIR, readCollections, slugify, walk } from "./lib/docs-pages.mjs";

const OUTPUT_FILE = "generated/last-modified.json";

/** Pages that are not content files, and the files whose changes they show. */
const EXTRA_PAGES = {
    "/labs": ["src/data/labs.json", "src/data/labs-blog.json"],
};

function git(args, options = {}) {
    return execFileSync("git", args, {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
        ...options,
    });
}

function isShallow() {
    return git(["rev-parse", "--is-shallow-repository"]).trim() === "true";
}

/** Fetches the history a shallow clone is missing, or reports why it could not. */
function deepen() {
    if (process.env.DOCS_LAST_MODIFIED_FETCH === "0") {
        return "skipped (DOCS_LAST_MODIFIED_FETCH=0)";
    }

    try {
        git(["fetch", "--quiet", "--unshallow", "--filter=blob:none", "origin"], {
            timeout: 120_000,
        });
        return isShallow() ? "fetched, still shallow" : "fetched the full history";
    } catch (error) {
        const reason = String(error.stderr || error.message)
            .trim()
            .split("\n")[0];
        return `could not fetch the full history: ${reason}`;
    }
}

/** The commits at the edge of a shallow history, whose dates mean nothing. */
function shallowBoundaries() {
    const file = git(["rev-parse", "--git-path", "shallow"]).trim();

    if (!existsSync(file)) return new Set();

    return new Set(readFileSync(file, "utf8").split("\n").filter(Boolean));
}

/**
 * The newest commit date of each file under `paths`, keyed by the file's path
 * from the repository root. Renames are not followed, so a moved file dates
 * from its move, the last time its URL changed.
 */
function newestCommits(paths) {
    const log = git([
        "log",
        "--no-renames",
        "--diff-filter=ACM",
        "--format=commit %H %cI",
        "--name-only",
        "HEAD",
        "--",
        ...paths,
    ]);

    const newest = new Map();
    let current;

    for (const line of log.split("\n")) {
        if (line.startsWith("commit ")) {
            const [, hash, date] = line.split(" ");
            current = { hash, date };
            continue;
        }

        if (!line || !current) continue;

        const known = newest.get(line);

        if (!known || Date.parse(current.date) > Date.parse(known.date)) {
            newest.set(line, current);
        }
    }

    return newest;
}

/** Every content page, including hidden ones, as a URL path without `/docs`. */
function contentPages() {
    const pages = new Map();

    for (const [id, prefix] of readCollections()) {
        const root = join(CONTENT_DIR, id);

        if (!existsSync(root)) continue;

        for (const file of walk(root)) {
            const rel = relative(root, file).replace(/\.(mdx|md)$/, "");

            if (rel.includes("__category")) continue;

            const segments = rel.split("/").map(slugify);

            if (segments.at(-1) === "index") segments.pop();

            const path = [prefix, ...segments].filter(Boolean).join("/");

            pages.set(`/${path}`, [file]);
        }
    }

    for (const [path, files] of Object.entries(EXTRA_PAGES)) pages.set(path, files);

    return pages;
}

function write(result) {
    mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
    writeFileSync(OUTPUT_FILE, `${JSON.stringify(result, null, 1)}\n`);
}

const pages = contentPages();

try {
    let note = "full history";

    if (isShallow()) {
        note = `shallow clone, ${deepen()}`;
    }

    const shallow = isShallow();
    const boundaries = shallow ? shallowBoundaries() : new Set();
    const commits = newestCommits([CONTENT_DIR, ...Object.values(EXTRA_PAGES).flat()]);
    const dates = {};
    let undated = 0;

    for (const [path, files] of [...pages].sort(([a], [b]) => (a < b ? -1 : 1))) {
        const known = files
            .map((file) => commits.get(file))
            .filter((commit) => commit && !boundaries.has(commit.hash))
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

        // A file last touched by a boundary commit has an unknown date, and so
        // does a page any of whose files has one.
        const unknown = files.some((file) => boundaries.has(commits.get(file)?.hash));

        if (!known.length || unknown) {
            undated++;
            continue;
        }

        dates[path] = new Date(known[0].date).toISOString().replace(".000Z", "Z");
    }

    write({ shallow, pages: dates });
    console.log(
        `[last-modified] ${Object.keys(dates).length} pages dated, ${undated} without a date (${note}) -> ${OUTPUT_FILE}`,
    );
} catch (error) {
    write({ shallow: false, pages: {} });
    console.warn(`[last-modified] no dates, git is unavailable: ${error.message.split("\n")[0]}`);
}
