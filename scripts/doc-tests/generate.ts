// Writes every runnable SurrealQL example in the docs to one file of ordinary
// language tests, `tests/doc-examples.surql`, for the language-test runner in
// the SurrealDB repository.
//
// Each test in the file starts with a marker line naming the path it splits
// into, `-- ===== test <path>.surql`, and what follows up to the next marker is
// a complete test file: a `/** ... */` config and the example's statements.
// The docs' own conventions for showing a result are resolved here, so the
// runner only sees the format the rest of its tests use:
//
// - A fence is a test when its language is `surql`, it is not marked
//   `notest`, and its title does not mark it as the output of the block above.
// - A block with its own `/** [test] */` config keeps it.
// - Otherwise each statement is expected to return a value, not an error. An
//   adjacent `Output` fence states the value of the last statement, `Error
//   output` that it fails, and a `//-` line the value of the statement above it.
// - Every test runs on a datastore of its own, and one that calls `eval::` is
//   allowed to.
//
// Usage: bun run generate:doc-tests [--check]
//   --check  fail if the committed file is out of date, as CI does

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import GithubSlugger from "github-slugger";

const ROOT = join(import.meta.dir, "..", "..");
const CONTENT = join(ROOT, "src", "content");
const OUTPUT = join(ROOT, "tests", "doc-examples.surql");
const MARKER = "-- ===== test ";

/** A title that marks a fence as the result of the block above it. */
const OUTPUT_TITLE = /^(?:.*\boutput\b.*|(?:Response|Result)\b.*)$/i;
/** A record key of the form `CREATE` generates, which differs on every run. */
const GENERATED_KEY = /:[a-z0-9]{20}\b/;

interface Fence {
    info: string;
    body: string[];
    /** 1-based line of the opening fence. */
    line: number;
    /** 0-based index of the closing fence line. */
    end: number;
}

function title(info: string): string | undefined {
    return /\btitle="([^"]*)"/.exec(info)?.[1];
}

function isOutputFence(info: string): boolean {
    const t = title(info);
    return t !== undefined && OUTPUT_TITLE.test(t);
}

function isTest(info: string): boolean {
    const words = info.trim().split(/\s+/);
    return words[0] === "surql" && !words.includes("notest") && !isOutputFence(info);
}

/**
 * The top-level statements of a query, as the offset each one ends at. A
 * statement ends at a `;` outside any string, comment or bracket, or at the end
 * of the query when text remains after the last `;`.
 */
export function statementEnds(query: string): number[] {
    const ends: number[] = [];
    let depth = 0;
    let content = false;
    let i = 0;

    while (i < query.length) {
        const c = query[i] as string;
        const next = query[i + 1];

        if (c === "-" && next === "-") {
            i = lineEnd(query, i);
            continue;
        }
        if (c === "/" && next === "/") {
            i = lineEnd(query, i);
            continue;
        }
        if (c === "#") {
            i = lineEnd(query, i);
            continue;
        }
        if (c === "/" && next === "*") {
            const close = query.indexOf("*/", i + 2);
            i = close < 0 ? query.length : close + 2;
            continue;
        }
        if (c === "'" || c === '"' || c === "`") {
            i = quoteEnd(query, i, c);
            content = true;
            continue;
        }
        if (c === "⟨") {
            const close = query.indexOf("⟩", i + 1);
            i = close < 0 ? query.length : close + 1;
            content = true;
            continue;
        }
        if (c === "(" || c === "[" || c === "{") depth++;
        else if (c === ")" || c === "]" || c === "}") depth = Math.max(0, depth - 1);
        else if (c === ";" && depth === 0) {
            if (content) ends.push(i);
            content = false;
            i++;
            continue;
        }
        if (!/\s/.test(c)) content = true;
        i++;
    }

    if (content) ends.push(query.length);
    return ends;
}

function lineEnd(text: string, from: number): number {
    const nl = text.indexOf("\n", from);
    return nl < 0 ? text.length : nl;
}

function quoteEnd(text: string, from: number, quote: string): number {
    let i = from + 1;
    while (i < text.length) {
        if (text[i] === "\\") i += 2;
        else if (text[i] === quote) return i + 1;
        else i++;
    }
    return text.length;
}

/** A TOML basic string. JSON's escapes are all valid TOML escapes. */
function toml(value: string): string {
    return JSON.stringify(value);
}

/** The `[[test.results]]` entry for a value a page states exactly. */
function exact(text: string): string {
    const value = text.trim();
    // A transcript of several queries holds no single value, and a `*/` would end
    // the test's config comment early, so neither is compared.
    if (value === "" || value.includes("-------- Query") || value.includes("*/")) {
        return "error = false";
    }
    // A page shows an error as the message the server reports, so a stated
    // string also matches an error with that message.
    if (/^(['"]).*\1$/s.test(value) && !value.includes("\n")) {
        return `match = ${toml(`$result = ${value} OR $error = ${value}`)}`;
    }
    const lines = [`value = ${toml(value)}`];
    if (GENERATED_KEY.test(value)) lines.push("skip-record-id-key = true");
    return lines.join("\n");
}

/** The test config for a block without one, from what its page shows. */
function deriveResults(code: string, below?: Fence): string[] | null {
    const ends = statementEnds(code);
    if (ends.length === 0) return null;

    const results: string[] = ends.map(() => "error = false");

    let offset = 0;
    for (const line of code.split("\n")) {
        const marker = /^\s*\/\/-(.*)$/.exec(line);
        if (marker) {
            const index = ends.filter((end) => end < offset).length - 1;
            if (index >= 0) results[index] = exact(marker[1] ?? "");
        }
        offset += line.length + 1;
    }

    const shown = below && title(below.info);
    const last = results.length - 1;
    if (shown && /^(?:expected )?output$/i.test(shown)) {
        results[last] = exact(below.body.join("\n"));
    } else if (shown && /^error output/i.test(shown)) {
        if (/^\s*parse error/i.test(below.body.join("\n"))) return ["parsing-error = true"];
        results[last] = "error = true";
    }

    return results.map((r) => (r === "parsing-error = true" ? r : `[[test.results]]\n${r}`));
}

function envConfig(code: string): string {
    const lines = ["[env]", "clean = true"];
    if (code.includes("eval::")) lines.push("", "[env.capabilities]", "allow-eval-query = true");
    return lines.join("\n");
}

/** A block's test file, or `null` when it has no statements to run. */
function testFile(fence: Fence, below: Fence | undefined): string | null {
    const body = fence.body.join("\n");
    const config = /^\s*\/\*\*([\s\S]*?)\*+\/\n?/.exec(body);

    if (config) {
        const code = body.slice(config[0].length);
        const own = (config[1] ?? "").replace(/^\s*\n/, "");
        return `/**\n${envConfig(code)}\n\n${own.trimEnd()}\n*/\n\n${code.trim()}\n`;
    }

    const results = deriveResults(body, below);
    if (!results) return null;
    const parsing = results[0] === "parsing-error = true";
    const tail = parsing ? "[test.results]\nparsing-error = true" : results.join("\n");
    return `/**\n${envConfig(body)}\n\n${tail}\n*/\n\n${body.trim()}\n`;
}

function fences(lines: string[]): Fence[] {
    const out: Fence[] = [];
    for (let i = 0; i < lines.length; i++) {
        const open = /^(`{3,})(.*)$/.exec(lines[i] ?? "");
        if (!open) continue;
        const marker = open[1] as string;
        let end = i + 1;
        while (end < lines.length && !new RegExp(`^${marker}\\s*$`).test(lines[end] ?? "")) end++;
        out.push({ info: open[2] ?? "", body: lines.slice(i + 1, end), line: i + 1, end });
        i = end;
    }
    return out;
}

async function* pages(dir: string): AsyncGenerator<string> {
    for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) =>
        a.name.localeCompare(b.name),
    )) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) yield* pages(path);
        else if (/\.mdx?$/.test(entry.name)) yield path;
    }
}

async function generate(): Promise<{ text: string; tests: number; pages: number }> {
    const parts: string[] = [];
    const bySection = new Map<string, number>();
    let pageCount = 0;

    for await (const path of pages(CONTENT)) {
        const rel = relative(CONTENT, path).replace(/\.mdx?$/, "");
        const lines = (await readFile(path, "utf8")).split("\n");
        const all = fences(lines);
        const slugger = new GithubSlugger();
        let section = "intro";
        const perSection = new Map<string, number>();
        let lineIndex = 0;
        let found = 0;

        for (let f = 0; f < all.length; f++) {
            const fence = all[f] as Fence;
            for (; lineIndex < fence.line - 1; lineIndex++) {
                const heading = /^#{1,6}\s+(.*)$/.exec(lines[lineIndex] ?? "");
                if (heading) section = slugger.slug((heading[1] ?? "").replace(/`/g, ""));
            }
            lineIndex = fence.end + 1;
            if (!isTest(fence.info)) continue;

            const next = all[f + 1];
            const adjacent =
                next && lines.slice(fence.end + 1, next.line - 1).every((l) => l.trim() === "");
            const file = testFile(
                fence,
                adjacent && next && isOutputFence(next.info) ? next : undefined,
            );
            if (!file) continue;
            if (file.split("\n").some((l) => l.startsWith(MARKER))) {
                throw new Error(`${rel}:${fence.line} contains the test marker line`);
            }

            const n = (perSection.get(section) ?? 0) + 1;
            perSection.set(section, n);
            parts.push(
                `${MARKER}${rel}/${section}-${n}.surql\n-- source: src/content/${relative(CONTENT, path)}:${fence.line}\n${file}`,
            );
            found++;
        }

        if (found > 0) {
            pageCount++;
            const key = rel.split("/").slice(0, 2).join("/");
            bySection.set(key, (bySection.get(key) ?? 0) + found);
        }
    }

    const summary = [...bySection]
        .sort((a, b) => b[1] - a[1])
        .map(([key, n]) => `--   ${String(n).padStart(5)}  ${key}`);
    const header = [
        `-- SurrealDB documentation examples: ${parts.length.toLocaleString("en-GB")} tests from ${pageCount} pages.`,
        "-- Generated by `bun run generate:doc-tests` from src/content. Do not edit by hand.",
        `-- Each test starts at a line beginning \`${MARKER.trim()}\`, which names the file it splits into.`,
        "--",
        ...summary,
        "",
    ];

    return {
        text: `${header.join("\n")}\n${parts.join("\n")}`,
        tests: parts.length,
        pages: pageCount,
    };
}

const { text, tests, pages: pageCount } = await generate();

if (process.argv.includes("--check")) {
    const current = await Bun.file(OUTPUT)
        .text()
        .catch(() => "");
    if (current !== text) {
        console.error("tests/doc-examples.surql is out of date. Run `bun run generate:doc-tests`.");
        process.exit(1);
    }
    console.log(`[doc-tests] up to date: ${tests} tests from ${pageCount} pages`);
} else {
    await Bun.write(OUTPUT, text);
    console.log(`[doc-tests] ${tests} tests from ${pageCount} pages -> tests/doc-examples.surql`);
}
