// Checks that every runnable SurrealQL example in the docs carries a test
// config, and that the config agrees with the result the page shows.
//
// The language-test runner in the SurrealDB repository reads the pages
// directly: built with its `docs` feature, it runs each `surql` code block that
// starts with a `/** ... */` config. That config is the test. This script keeps
// it in step with what a reader sees:
//
// - A block is a test when its language is `surql`, it is not marked `notest`,
//   and its title does not mark it as the output of the block above.
// - The page states a result in an adjacent `Output` fence (the value of the
//   last statement), an `Error output` fence (that it fails) or a `//-` line
//   (the value of the statement above it).
// - A test block needs a config, and every result the page states must match
//   the result its config expects.
//
// Usage: bun run check:doc-tests [--fix]
//   --fix  write a config into each block without one, from what its page
//          shows, and add `[env] clean = true` where a block needs it. A config that disagrees with its page is only reported,
//          because either side can be the one that is out of date.

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = join(import.meta.dir, "..", "..");
const CONTENT = join(ROOT, "src", "content");

/** A title that marks a fence as the result of the block above it. */
const OUTPUT_TITLE = /^(?:.*\boutput\b.*|(?:Response|Result)\b.*)$/i;
/** A record key of the form `CREATE` generates, which differs on every run. */
const GENERATED_KEY = /:[a-z0-9]{20}\b/;
/**
 * A statement that leaves something outside the namespace and database a test
 * runs in: another namespace or database, a definition on root, a system
 * setting, or an `ASYNC` event's queue. The runner drops the test's own
 * namespace after each test and checks that nothing else remains, so a block
 * with one of these needs a datastore of its own.
 */
const OUTSIDE_DATABASE =
    /\b(?:USE\s+(?:NS|NAMESPACE|DB|DATABASE)|(?:DEFINE|REMOVE|ALTER)\s+(?:NAMESPACE|DATABASE)|ON\s+ROOT|DEFINE\s+CONFIG\s+DEFAULT|ALTER\s+SYSTEM|ASYNC)\b/i;
/** A block's own config: a doc comment at its very start. */
// The comment ends at the first `*/`, as the runner reads it, so a stray `*`
// before it is part of the config and fails to parse here as it does there.
const CONFIG = /^\s*\/\*\*([\s\S]*?)\*\/\n?/;

interface Fence {
    info: string;
    body: string[];
    /** 1-based line of the opening fence. */
    line: number;
    /** 0-based index of the closing fence line. */
    end: number;
}

/** What the page states about one statement, or `undefined` when it states nothing. */
type Stated = { kind: "value"; text: string } | { kind: "error" } | undefined;

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
    // Where the last code seen ends, so a final statement without a `;` ends
    // there rather than after the comments and `//-` lines that follow it.
    let codeEnd = 0;
    let i = 0;

    while (i < query.length) {
        const c = query[i] as string;
        const next = query[i + 1];

        if ((c === "-" && next === "-") || (c === "/" && next === "/") || c === "#") {
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
            codeEnd = i;
            continue;
        }
        if (c === "⟨") {
            const close = query.indexOf("⟩", i + 1);
            i = close < 0 ? query.length : close + 1;
            content = true;
            codeEnd = i;
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
        if (!/\s/.test(c)) {
            content = true;
            codeEnd = i + 1;
        }
        i++;
    }

    if (content) ends.push(codeEnd);
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

/**
 * A value as the config writes it: a multi-line literal string when it spans
 * lines, so the config keeps the layout the page shows, and a basic string
 * otherwise.
 */
function tomlValue(value: string): string {
    const literal = value.includes("\n") && !value.includes("'''") && !value.endsWith("'");
    return literal ? `'''\n${value}'''` : toml(value);
}

/**
 * What the page states for each statement of a block, or `parse` when the
 * page shows that the block does not parse.
 */
function stated(
    code: string,
    below?: Fence,
): { statements: number; results: Stated[] } | "parse" | null {
    const ends = statementEnds(code);
    if (ends.length === 0) return null;
    const results: Stated[] = ends.map(() => undefined);

    let offset = 0;
    for (const line of code.split("\n")) {
        const marker = /^\s*\/\/-(.*)$/.exec(line);
        if (marker) {
            const index = ends.filter((end) => end < offset).length - 1;
            if (index >= 0) results[index] = { kind: "value", text: (marker[1] ?? "").trim() };
        }
        offset += line.length + 1;
    }

    const shown = below && title(below.info);
    const last = results.length - 1;
    if (shown && /^(?:expected )?output$/i.test(shown)) {
        results[last] = { kind: "value", text: below.body.join("\n").trim() };
    } else if (shown && /^error output/i.test(shown)) {
        if (/^\s*parse error/i.test(below.body.join("\n"))) return "parse";
        results[last] = { kind: "error" };
    }
    return { statements: ends.length, results };
}

// Whether a stated value can be compared. A transcript of several queries, or
// an Output fence that labels several values with comments, holds no single
// value, and a closing comment marker would end the config early.
function comparable(text: string): boolean {
    return (
        text !== "" &&
        !text.includes("-------- Query") &&
        !text.includes("*/") &&
        !/^\s*--/m.test(text)
    );
}

/** The `[[test.results]]` entry for what the page states about one statement. */
function entry(result: Stated): string {
    if (!result) return "error = false";
    if (result.kind === "error") return "error = true";
    const value = result.text;
    if (!comparable(value)) return "error = false";
    // A page shows an error as the message the server reports, so a stated
    // string also matches an error with that message.
    if (/^(['"]).*\1$/s.test(value) && !value.includes("\n")) {
        return `match = ${toml(`$result = ${value} OR $error = ${value}`)}`;
    }
    const lines = [`value = ${tomlValue(value)}`];
    if (GENERATED_KEY.test(value)) lines.push("skip-record-id-key = true");
    return lines.join("\n");
}

/** A config for a block without one, from what its page shows. */
function newConfig(code: string, below?: Fence): string | null {
    const page = stated(code, below);
    if (!page) return null;
    const parts = ["/**[test]", ""];
    if (OUTSIDE_DATABASE.test(code)) parts.push("[env]", "clean = true", "");
    if (code.includes("eval::")) parts.push("[env.capabilities]", "allow-eval-query = true", "");
    if (page === "parse") parts.push("[test.results]", "parsing-error = true");
    else parts.push(page.results.map((r) => `[[test.results]]\n${entry(r)}`).join("\n\n"));
    parts.push("", "*/");
    return parts.join("\n");
}

/**
 * A value in a form that ignores layout: whitespace outside strings is
 * dropped, and a generated record key matches any other.
 */
function canonical(text: string): string {
    let out = "";
    for (let i = 0; i < text.length; i++) {
        const c = text[i] as string;
        if (c === "'" || c === '"' || c === "`") {
            const end = quoteEnd(text, i, c);
            const inner = text.slice(i + 1, end - 1);
            // A string in JSON form, as an older page shows it, is the same value.
            out += c === '"' && !inner.includes("'") ? `'${inner}'` : text.slice(i, end);
            i = end - 1;
        } else if (!/\s/.test(c)) out += c;
    }
    return out
        .replace(new RegExp(GENERATED_KEY.source, "g"), ":#")
        .replace(/'([A-Za-z_][A-Za-z0-9_]*)':/g, "$1:")
        .replace(/\b(?:NULL|null)\b/g, "NULL");
}

/** The results a config expects, one entry per statement, as the runner reads them. */
/** Whether a config runs its test on a datastore of its own. */
function isClean(config: string): boolean {
    try {
        const parsed = Bun.TOML.parse(config) as { env?: { clean?: unknown } };
        return parsed.env?.clean === true;
    } catch {
        return false;
    }
}

/** A config with `clean = true` added to its `[env]` table, or a new one. */
function withClean(config: string): string {
    if (/^\[env\]\s*$/m.test(config)) return config.replace(/^\[env\]\s*$/m, "[env]\nclean = true");
    return config.replace(/\n?\*+\/\n?$/, "\n[env]\nclean = true\n\n*/\n");
}

function configResults(config: string): Record<string, unknown>[] | null {
    try {
        const parsed = Bun.TOML.parse(config) as { test?: { results?: unknown } };
        const results = parsed.test?.results;
        if (Array.isArray(results)) return results as Record<string, unknown>[];
        return results && typeof results === "object" ? [results as Record<string, unknown>] : [];
    } catch {
        return null;
    }
}

/** Whether a config's entry for a statement agrees with what the page states. */
function agrees(
    result: Exclude<Stated, undefined>,
    expected: Record<string, unknown> | undefined,
): boolean {
    if (!expected) return false;
    if (result.kind === "error") return expected.error !== undefined && expected.error !== false;
    if (!comparable(result.text)) return true;
    if (typeof expected.value === "string") {
        // The parts of a value that the config tells the runner to ignore are
        // ignored here too, since the page shows them from one sample run.
        const skip = (text: string) => {
            let out = canonical(text);
            if (expected["skip-record-id-key"] === true) {
                // A key followed by a quote is a field holding a value such as
                // `at: d'...'`, not a record id, so it is left alone.
                out = out.replace(/\b([A-Za-z_]\w*):(?:`[^`]*`|⟨[^⟩]*⟩|\w+(?!['\w]))/g, "$1:#");
            }
            if (expected["skip-datetime"] === true) {
                out = out.replace(/d'[^']*'|'\d{4}-\d{2}-\d{2}T[^']*'/g, "d'#'");
            }
            if (expected["skip-uuid"] === true)
                out = out.replace(/u'[^']*'|'[0-9a-f]{8}-[0-9a-f-]{27}'/g, "u'#'");
            return out;
        };
        return skip(expected.value) === skip(result.text);
    }
    if (typeof expected.match === "string") {
        // Only a condition of the form this script writes restates the page.
        const own = /^\$result = (.*) OR \$error = \1$/s.exec(expected.match);
        return !own || canonical(own[1] ?? "") === canonical(result.text);
    }
    if (typeof expected.error === "string")
        return (
            canonical(expected.error) === canonical(result.text.replace(/^(['"])(.*)\1$/s, "$2"))
        );
    // A config that checks the result some other way, such as with `match` on
    // part of a value, is the author's choice and is not compared.
    return true;
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

const fix = process.argv.includes("--fix");
const problems: string[] = [];
let tests = 0;
let added = 0;
let cleaned = 0;

for await (const path of pages(CONTENT)) {
    const where = (line: number) => `src/content/${relative(CONTENT, path)}:${line}`;
    const lines = (await readFile(path, "utf8")).split("\n");
    const all = fences(lines);
    // Edits are made from the last block up, so earlier line numbers stay valid.
    const edits: { at: number; remove?: number; insert: string[] }[] = [];

    for (let f = 0; f < all.length; f++) {
        const fence = all[f] as Fence;
        if (!isTest(fence.info)) continue;

        const next = all[f + 1];
        const adjacent =
            next && lines.slice(fence.end + 1, next.line - 1).every((l) => l.trim() === "");
        const below = adjacent && next && isOutputFence(next.info) ? next : undefined;
        const body = fence.body.join("\n");
        const own = CONFIG.exec(body);

        if (!own) {
            const config = newConfig(body, below);
            if (!config) continue;
            tests++;
            if (fix) {
                edits.push({ at: fence.line, insert: config.split("\n") });
                added++;
            } else {
                problems.push(`${where(fence.line)}: no test config`);
            }
            continue;
        }

        tests++;
        const code = body.slice(own[0].length);
        if (OUTSIDE_DATABASE.test(code) && !isClean(own[1] ?? "")) {
            if (fix) {
                const configLines = own[0].replace(/\n$/, "").split("\n").length;
                edits.push({
                    at: fence.line,
                    remove: configLines,
                    insert: withClean(own[0]).replace(/\n$/, "").split("\n"),
                });
                cleaned++;
            } else {
                problems.push(
                    `${where(fence.line)}: reaches outside its database, so its config needs [env] clean = true`,
                );
            }
        }
        const page = stated(code, below);
        if (!page || page === "parse") continue;
        const expected = configResults(own[1] ?? "");
        // Bun's TOML parser accepts a stray `*` from a comment closed as `**/`,
        // but the runner's does not, and leaves the page unloaded.
        if (!expected || /\*\s*$/.test(own[1] ?? "")) {
            problems.push(`${where(fence.line)}: the test config is not valid TOML`);
            continue;
        }

        page.results.forEach((result, i) => {
            if (!result || agrees(result, expected[i])) return;
            problems.push(
                `${where(fence.line)}: result ${i + 1} of the config differs from what the page shows`,
            );
        });
    }

    if (edits.length > 0) {
        for (const edit of edits.reverse()) lines.splice(edit.at, edit.remove ?? 0, ...edit.insert);
        await writeFile(path, lines.join("\n"));
    }
}

if (fix) {
    console.log(
        `[doc-tests] ${tests} tests: added ${added} configs, and clean = true to ${cleaned}`,
    );
}
if (problems.length > 0) {
    for (const problem of problems) console.error(problem);
    console.error(
        `[doc-tests] ${problems.length} problem${problems.length === 1 ? "" : "s"} in ${tests} tests.${fix ? "" : " Run `bun run check:doc-tests --fix` to add the missing configs."}`,
    );
    process.exit(1);
}
if (!fix) console.log(`[doc-tests] ${tests} tests, every one with a config that matches its page`);
