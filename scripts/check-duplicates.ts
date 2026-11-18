/**
 * Warns when a change makes two pages repeat each other: a new page whose prose
 * mostly appears on an existing page, or an example copied from another page.
 *
 * Two comparisons run over every page in `src/content`:
 *
 * - **Prose.** Each page's text, without frontmatter, code, tags and link
 *   targets, is cut into runs of five words. A pair of pages is similar when at
 *   least half the runs of the shorter page appear on the longer one. Pages
 *   with fewer than 100 runs are skipped, because short reference pages share
 *   their boilerplate and nothing else.
 * - **Examples.** Each code block of three lines or more, other than an output
 *   fence or a `text`, `json` or `syntax` block, is cut into runs of four
 *   tokens after dropping test configs, comments and `//-` result lines. Two
 *   blocks on different pages are duplicates when 80% of their runs match.
 *
 * Pages that are meant to look alike, such as the Actix and Axum guides or the
 * `ALTER` statements, stay similar on every run. So by default the check only
 * reports a pair that the change made similar: one page of it is new or
 * edited, and the pair was not similar on the base branch. The base is
 * `origin/<GITHUB_BASE_REF>` in a pull request and `origin/main` otherwise, or
 * the ref given with `--base`.
 *
 * It only warns, and always exits 0: a similar pair can be a deliberate pair
 * of pages, and the person making the change decides. In GitHub Actions each
 * warning is an annotation on the changed file.
 *
 * Usage:
 *   bun scripts/check-duplicates.ts             pairs this branch made similar
 *   bun scripts/check-duplicates.ts --base REF  the same, against REF
 *   bun scripts/check-duplicates.ts --all       every similar pair in the docs
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const CONTENT = "src/content";

const PROSE_RUN = 5;
const PROSE_MIN_RUNS = 100;
const PROSE_SHARE = 0.5;
const CODE_RUN = 4;
const CODE_MIN_LINES = 3;
const CODE_SHARE = 0.8;
/** A run that appears on more pages than this is a common phrase, not a copy. */
const COMMON = 30;

const NOT_EXAMPLES = /^(text|json|syntax)$|title="[^"]*(output|response|result)/i;

type Runs = Set<string>;

function runs(tokens: string[], size: number): Runs {
    const found = new Set<string>();
    for (let i = 0; i + size <= tokens.length; i++) found.add(tokens.slice(i, i + size).join(" "));
    return found;
}

function proseRuns(source: string): Runs {
    const words = source
        .replace(/^---[\s\S]*?---/, "")
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\]\([^)]*\)/g, "]")
        .replace(/[^a-z0-9' ]+/gi, " ")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
    return runs(words, PROSE_RUN);
}

interface Block {
    line: number;
    runs: Runs;
}

function exampleRuns(source: string): Block[] {
    const blocks: Block[] = [];
    const lines = source.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const open = lines[i].match(/^\s*```(\S*)(.*)$/);
        if (!open) continue;
        const start = i;
        const body: string[] = [];
        for (i++; i < lines.length && !/^\s*```\s*$/.test(lines[i]); i++) body.push(lines[i]);
        if (NOT_EXAMPLES.test(open[1]) || NOT_EXAMPLES.test(open[2])) continue;
        const code = body
            .join("\n")
            .replace(/\/\*\*\s*\[test\][\s\S]*?\*\//g, "")
            .split("\n")
            .filter((l) => !/^\s*(--|\/\/|#)/.test(l) && l.trim() !== "");
        if (code.length < CODE_MIN_LINES) continue;
        const tokens = code.join(" ").match(/\w+|[^\s\w]/g) ?? [];
        blocks.push({ line: start + 1, runs: runs(tokens, CODE_RUN) });
    }
    return blocks;
}

function overlap(a: Runs, b: Runs): number {
    let shared = 0;
    const [small, large] = a.size <= b.size ? [a, b] : [b, a];
    for (const run of small) if (large.has(run)) shared++;
    return shared;
}

/** Share of the shorter page's runs that appear on the other page. */
const proseShare = (a: Runs, b: Runs) => overlap(a, b) / Math.min(a.size, b.size);

/** Runs the two blocks share, out of all the runs either has. */
const codeShare = (a: Runs, b: Runs) => {
    const shared = overlap(a, b);
    return shared / (a.size + b.size - shared);
};

function git(...args: string[]): string {
    return execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
    });
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const baseArg = args[args.indexOf("--base") + 1];
const base =
    args.includes("--base") && baseArg
        ? baseArg
        : `origin/${process.env.GITHUB_BASE_REF || "main"}`;

const files = (readdirSync(join(ROOT, CONTENT), { recursive: true }) as string[])
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => join(CONTENT, f));
const read = (file: string) => readFileSync(join(ROOT, file), "utf8");

/** The pages this branch added or changed, or every page with `--all`. */
let changed: Set<string>;
let mergeBase = "";
if (all) {
    changed = new Set(files);
} else {
    try {
        mergeBase = git("merge-base", base, "HEAD").trim();
        changed = new Set(
            git("diff", "--name-only", "--diff-filter=AMR", mergeBase, "--", CONTENT)
                .split("\n")
                .filter((f) => /\.mdx?$/.test(f)),
        );
    } catch {
        console.log(`[duplicates] ${base} is not available here, so nothing was compared`);
        process.exit(0);
    }
}

/** A page's text on the base branch, or undefined for a page the branch added. */
function atBase(file: string): string | undefined {
    try {
        return git("show", `${mergeBase}:${file}`);
    } catch {
        return undefined;
    }
}

/** Pairs of keys that share at least one run that is not common. */
function candidates(sets: Map<string, Runs>, wanted: (a: string, b: string) => boolean) {
    const index = new Map<string, string[]>();
    for (const [key, set] of sets)
        for (const run of set) index.set(run, [...(index.get(run) ?? []), key]);
    const pairs = new Set<string>();
    for (const keys of index.values()) {
        if (keys.length > COMMON) continue;
        for (let i = 0; i < keys.length; i++) {
            for (let j = i + 1; j < keys.length; j++) {
                if (wanted(keys[i], keys[j])) pairs.add(`${keys[i]}\n${keys[j]}`);
            }
        }
    }
    return [...pairs].map((p) => p.split("\n") as [string, string]);
}

/** A value the index was built from, so it is always there. */
function get<K, V>(map: Map<K, V>, key: K): V {
    const value = map.get(key);
    if (value === undefined) throw new Error(`No entry for ${String(key)}`);
    return value;
}

const warnings: { file: string; line?: number; text: string }[] = [];
const percent = (n: number) => `${Math.round(n * 100)}%`;
/** Page pairs reported for their prose, with how many examples they also share. */
const similarPages = new Map<string, { warning: (typeof warnings)[number]; examples: number }>();
const pairKey = (a: string, b: string) => [a, b].sort().join("\n");

// Prose

const prose = new Map<string, Runs>();
for (const file of files) {
    const set = proseRuns(read(file));
    if (set.size >= PROSE_MIN_RUNS) prose.set(file, set);
}

for (const [a, b] of candidates(prose, (x, y) => changed.has(x) || changed.has(y))) {
    const share = proseShare(get(prose, a), get(prose, b));
    if (share < PROSE_SHARE) continue;
    if (!all) {
        const [baseA, baseB] = [atBase(a), atBase(b)];
        if (baseA !== undefined && baseB !== undefined) {
            const before = proseShare(proseRuns(baseA), proseRuns(baseB));
            if (before >= PROSE_SHARE) continue;
        }
    }
    const file = changed.has(a) ? a : b;
    const other = file === a ? b : a;
    const warning = {
        file,
        text: `${percent(share)} of the prose of the shorter page also appears on ${other}. Link to one page from the other, or merge them.`,
    };
    warnings.push(warning);
    similarPages.set(pairKey(a, b), { warning, examples: 0 });
}

// Examples

const examples = new Map<string, Runs>();
const blockAt = new Map<string, { file: string; line: number }>();
for (const file of files) {
    for (const block of exampleRuns(read(file))) {
        const key = `${file}:${block.line}`;
        examples.set(key, block.runs);
        blockAt.set(key, { file, line: block.line });
    }
}
const fileOf = (key: string) => get(blockAt, key).file;

for (const [a, b] of candidates(
    examples,
    (x, y) => fileOf(x) !== fileOf(y) && (changed.has(fileOf(x)) || changed.has(fileOf(y))),
)) {
    const share = codeShare(get(examples, a), get(examples, b));
    if (share < CODE_SHARE) continue;
    if (!all) {
        // A copy the base branch already had is an old pair, not this change's
        const [baseA, baseB] = [atBase(fileOf(a)), atBase(fileOf(b))];
        if (baseA !== undefined && baseB !== undefined) {
            const before = exampleRuns(baseA).map((x) => x.runs);
            const other = exampleRuns(baseB).map((x) => x.runs);
            if (before.some((x) => other.some((y) => codeShare(x, y) >= CODE_SHARE))) continue;
        }
    }
    // A page already reported as a copy gets one warning, with the count of
    // its examples, rather than one for every example it repeats
    const pages = similarPages.get(pairKey(fileOf(a), fileOf(b)));
    if (pages) {
        pages.examples++;
        continue;
    }
    const [first, second] = [get(blockAt, a), get(blockAt, b)];
    const [here, there] = changed.has(first.file) ? [first, second] : [second, first];
    warnings.push({
        file: here.file,
        line: here.line,
        text: `This example is ${percent(share)} the same as ${there.file}:${there.line}. Keep it on one page and link to it from the other.`,
    });
}

for (const { warning, examples } of similarPages.values()) {
    if (examples === 0) continue;
    warning.text = warning.text.replace(
        ". Link",
        `, and ${examples} of its examples are the same. Link`,
    );
}

warnings.sort((x, y) => x.file.localeCompare(y.file) || (x.line ?? 0) - (y.line ?? 0));

for (const w of warnings) {
    if (process.env.GITHUB_ACTIONS) {
        console.log(`::warning file=${w.file}${w.line ? `,line=${w.line}` : ""}::${w.text}`);
    } else {
        console.log(`${w.file}${w.line ? `:${w.line}` : ""}\n    ${w.text}`);
    }
}
console.log(
    `[duplicates] ${all ? "every page" : `${changed.size} changed pages against ${base}`}: ${warnings.length} similar pairs`,
);
