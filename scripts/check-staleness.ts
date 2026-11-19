/**
 * Reports the pages whose content has not changed for a long time, so that
 * someone can read each one again against the product as it is now.
 *
 * A page's date is the committer date of the newest commit that changed what
 * the page says. A commit that only moves a file does not count, so a page
 * that was moved in a restructure keeps the date of its last edit. The history
 * of a file continues under its old name, through any number of moves.
 *
 * It reports and never fails: an old page can be correct, and a new page can be
 * wrong. Pages with `hidden: true` are left out, and so are the upgrade guides,
 * which describe one version change each and are not meant to be revised.
 * `--exclude` adds a path prefix under `src/content` to leave out.
 *
 * It needs the full history of the repository. In a shallow clone it fetches
 * the rest first, commits and trees only, and a page whose newest change is
 * still out of reach is left out of the report and counted.
 *
 * In GitHub Actions the report is also written to the job summary.
 *
 * Usage:
 *   bun scripts/check-staleness.ts                  pages unchanged for 180 days
 *   bun scripts/check-staleness.ts --days 90        the same, for another age
 *   bun scripts/check-staleness.ts --limit 100      list more than the oldest 50
 *   bun scripts/check-staleness.ts --bulk 100       treat only commits of 100 pages or more as sweeps
 *   bun scripts/check-staleness.ts --exclude learn/tutorials/demos/
 *   bun scripts/check-staleness.ts --json           the stale pages as JSON
 */

import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const CONTENT = "src/content";
const DAY = 24 * 60 * 60 * 1000;
/** A commit that changes more pages than this is a sweep, not an edit of each page. */
const DEFAULT_BULK = 40;

/** Upgrade guides each describe one version change and are not revised later. */
const DEFAULT_EXCLUDED = ["operate/upgrading/"];

function git(...args: string[]): string {
    return execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 512 * 1024 * 1024,
    });
}

function option(name: string): string | undefined {
    const at = process.argv.indexOf(name);
    return at === -1 ? undefined : process.argv[at + 1];
}

const days = Number(option("--days") ?? 180);
const limit = Number(option("--limit") ?? 50);
const json = process.argv.includes("--json");
const BULK = Number(option("--bulk") ?? DEFAULT_BULK);
const excluded = [
    ...DEFAULT_EXCLUDED,
    ...process.argv.flatMap((a, n) => (a === "--exclude" ? [process.argv[n + 1]] : [])),
].filter(Boolean);

if (!existsSync(join(ROOT, ".git"))) {
    console.log("[staleness] this is not a git checkout, so there are no dates to read");
    process.exit(0);
}

/** Fetch the rest of a shallow history, which the dates need. */
function ensureHistory(): string | undefined {
    try {
        if (git("rev-parse", "--is-shallow-repository").trim() !== "true") return undefined;
        git("fetch", "--quiet", "--unshallow", "--filter=blob:none", "origin");
        return undefined;
    } catch (error) {
        return `could not fetch the full history: ${String((error as Error).message).split("\n")[0]}`;
    }
}
const historyNote = ensureHistory();

const pages = (readdirSync(join(ROOT, CONTENT), { recursive: true }) as string[])
    .filter((f) => /\.mdx?$/.test(f))
    .filter((f) => !excluded.some((prefix) => f.startsWith(prefix)))
    .filter(
        (f) =>
            !/^hidden:\s*true\s*$/m.test(
                readFileSync(join(ROOT, CONTENT, f), "utf8").split("\n---")[0],
            ),
    )
    .map((f) => join(CONTENT, f));

/**
 * When the content of each page last changed. The log runs from the newest
 * commit back, and each current file is followed through its renames: a
 * rename that keeps the content (`R100`) hands the file's identity to its old
 * name, and any other change sets the date and ends the search.
 *
 * A commit that changes more than `BULK` pages is a sweep, such as adding test
 * configs to every example or fixing one spelling everywhere, and says nothing
 * about whether anyone read a page again. A sweep does not set a date. A page
 * that only sweeps ever changed gets the date of the oldest one, which is when
 * it was added.
 */
function contentDates(): Map<string, number> {
    const log = git(
        "log",
        "--date-order",
        "-M",
        "--diff-filter=AMR",
        "--name-status",
        "--format=commit %cI",
        "HEAD",
        "--",
        CONTENT,
    );

    const commits: { date: number; entries: string[][] }[] = [];
    for (const line of log.split("\n")) {
        if (line.startsWith("commit ")) {
            commits.push({ date: Date.parse(line.slice("commit ".length)), entries: [] });
        } else if (line && commits.length > 0) {
            commits[commits.length - 1].entries.push(line.split("\t"));
        }
    }

    const following = new Map<string, string>(pages.map((p) => [p, p]));
    const dates = new Map<string, number>();
    const sweepDates = new Map<string, number>();

    for (const { date, entries } of commits) {
        const changes = entries.filter(([status]) => status !== "R100").length;
        const sweep = changes > BULK;

        for (const [status, first, second] of entries) {
            const renamed = status.startsWith("R");
            const target = following.get(renamed ? second : first);
            if (target === undefined) continue;

            const edited = !renamed || Number(status.slice(1)) < 100;
            if (renamed) {
                following.delete(second);
                following.set(first, target);
            }
            if (!edited) continue;

            if (sweep) {
                sweepDates.set(target, date);
            } else {
                dates.set(target, date);
                following.delete(first);
            }
        }
    }

    for (const [page, date] of sweepDates) if (!dates.has(page)) dates.set(page, date);
    return dates;
}

const dates = contentDates();
const now = Date.now();

interface Entry {
    file: string;
    age: number;
    date: string;
}

const undated = pages.filter((p) => !dates.has(p)).length;
const all: Entry[] = pages
    .filter((p) => dates.has(p))
    .map((file) => {
        const time = dates.get(file) as number;
        return {
            file,
            age: Math.floor((now - time) / DAY),
            date: new Date(time).toISOString().slice(0, 10),
        };
    });
const stale = all.filter((e) => e.age >= days).sort((a, b) => b.age - a.age);

/** The part of the content tree a page belongs to, such as `reference/cli`. */
function section(file: string): string {
    const parts = file.slice(CONTENT.length + 1).split("/");
    return parts.length <= 2 ? parts[0] : `${parts[0]}/${parts[1]}`;
}

if (json) {
    console.log(JSON.stringify(stale, null, 2));
    process.exit(0);
}

const sections = new Map<string, { pages: number; stale: number; oldest: number }>();
for (const e of all) {
    const key = section(e.file);
    const row = sections.get(key) ?? { pages: 0, stale: 0, oldest: 0 };
    row.pages++;
    if (e.age >= days) {
        row.stale++;
        row.oldest = Math.max(row.oldest, e.age);
    }
    sections.set(key, row);
}
const staleSections = [...sections]
    .filter(([, r]) => r.stale > 0)
    .sort((a, b) => b[1].stale - a[1].stale);

const lines: string[] = [];
lines.push(
    `[staleness] ${all.length} pages, ${stale.length} unchanged for ${days} days or more${stale.length ? ` (the oldest for ${stale[0].age} days)` : ""}`,
);
if (undated > 0) lines.push(`${undated} pages have no date, because their history is out of reach`);
if (historyNote) lines.push(historyNote);

if (stale.length > 0) {
    lines.push("", "By section (stale of all pages, oldest in days):");
    for (const [name, r] of staleSections) {
        lines.push(
            `  ${name.padEnd(40)} ${String(r.stale).padStart(4)} of ${String(r.pages).padEnd(4)} ${r.oldest}`,
        );
    }
    lines.push("", `The oldest ${Math.min(limit, stale.length)} pages:`);
    for (const e of stale.slice(0, limit)) {
        lines.push(
            `  ${String(e.age).padStart(5)} days  ${e.date}  ${e.file.slice(CONTENT.length + 1)}`,
        );
    }
}
console.log(lines.join("\n"));

const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
    const md: string[] = [
        `## Pages unchanged for ${days} days or more`,
        "",
        `${stale.length} of ${all.length} pages${stale.length ? `, the oldest for ${stale[0].age} days` : ""}.`,
        "",
    ];
    if (stale.length > 0) {
        md.push("| Section | Stale | Pages | Oldest (days) |", "| --- | ---: | ---: | ---: |");
        for (const [name, r] of staleSections)
            md.push(`| \`${name}\` | ${r.stale} | ${r.pages} | ${r.oldest} |`);
        md.push(
            "",
            `### The oldest ${Math.min(limit, stale.length)}`,
            "",
            "| Days | Last changed | Page |",
            "| ---: | --- | --- |",
        );
        for (const e of stale.slice(0, limit)) {
            md.push(`| ${e.age} | ${e.date} | \`${e.file.slice(CONTENT.length + 1)}\` |`);
        }
    }
    appendFileSync(summary, `${md.join("\n")}\n`);
}
