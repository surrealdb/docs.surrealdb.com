/**
 * Checks the environment variables page and the `surreal db` command pages
 * against the newest stable release in `public/cli-history/data.json`, which
 * `bun run generate:cli-history` reads from the engine source at each tag.
 *
 * It fails when:
 *
 * - a `SURREAL_` variable in the release has no row on the environment
 *   variables page, and is not listed in `INTERNAL`;
 * - a row names a variable that no tagged release has had, which is usually a
 *   typo, unless the row's `<Since>` badge names a version newer than the
 *   release (see below);
 * - a row names a variable the release no longer has, and neither the row nor
 *   the opening of its section says which versions it applies to;
 * - a row's default and the source's default are both numbers and differ.
 *   `1 << 20`, `1 MiB` and `1,048,576` are the same number, so only a real
 *   disagreement is reported;
 * - a flag in the release is not mentioned on its command's page, and is not
 *   listed in `HIDDEN_FLAGS`;
 * - an entry in `INTERNAL` or `HIDDEN_FLAGS` no longer applies, so the lists
 *   only ever hold what is still true.
 *
 * The two lists are for what is not a setting for users, each with the
 * reason. A setting a user can change is documented, not listed.
 *
 * The data covers tagged releases only, so a setting added on a branch for an
 * unreleased version is checked once that version is tagged and the data is
 * regenerated. A row for such a setting says so with a `<Since>` badge that
 * names a version newer than the release, and the check lists it as waiting
 * instead of reporting it.
 *
 * Usage: bun scripts/check-cli-reference.ts
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const ENV_PAGE = "src/content/reference/cli/db/environment-variables.mdx";
const COMMANDS = "src/content/reference/cli/db/commands";

/** Variables the release reads that are not settings for a user, with the reason. */
const INTERNAL: Record<string, string> = {
    SURREAL_BUILD_ID: "read at compile time, when the engine is built",
    SURREAL_BUILD_VERSION: "read at compile time by the build script",
    SURREAL_COMPILE_CACHE_STATS: "a measurement switch for engine development",
    SURREAL_HOLD_CREATES: "a benchmark switch for engine development",
    SURREAL_INVOKED_AS: "set by the Surreal CLI itself when it runs the database",
    SURREAL_MORSEL_LOOPBACK_PLACES: "a conformance setting for testing the host-place contract",
    SURREAL_MORSEL_NEEDS_VIEW: "a test setting that runs the parallel merge on every backend",
    SURREAL_MORSEL_STEAL_ALWAYS: "a test setting that forces the most work stealing a run can see",
    SURREAL_ONLINE_VERSION_CHECK: "accepted so old invocations parse; it has no effect",
    SURREAL_SURREALISM_REFETCH_AFTER_REFUSAL: "read only by debug builds, for integration tests",
    SURREAL_TELEMETRY_RPC_LIVE_ID: "accepted but no longer applied; the server logs a warning",
    SURREAL_TRACE_COMPILES: "a tracing switch for engine development",
    SURREAL_VM_LEAF: "a debugging report for engine development",
};

/** Flags the release hides from `--help`, with the reason. */
const HIDDEN_FLAGS: Record<string, string> = {
    "surreal start --key": "hidden; not currently in use",
    "surreal start --no-banner": "hidden; the database prints no banner",
    "surreal start --planner-strategy": "hidden; retired, and refused with an error",
    "surreal sql --planner-strategy": "hidden; retired, and refused with an error",
    "surreal mcp --planner-strategy": "hidden; retired, and refused with an error",
};

/**
 * A command whose page sends the reader to another command's page for a shared
 * group of flags: `mcp.mdx` says the database flags of `surreal db start` are
 * available through the same option group.
 */
const SHARES_FLAGS_WITH: Record<string, string> = { "surreal mcp": "surreal start" };

/** Command pages whose file name differs from the command. */
const PAGE_FOR: Record<string, string> = { "surreal is-ready": "isready" };

interface Tag {
    name: string;
    pre: boolean;
    released: boolean;
}

interface Item {
    key: string;
    kind: "arg" | "env" | "config" | "flag";
    ranges: [number, number][];
    command?: string;
    env?: string;
    help?: string;
    defaults?: [number, string | null][];
}

const data: { tags: Tag[]; items: Item[] } = JSON.parse(
    readFileSync(join(ROOT, "public/cli-history/data.json"), "utf8"),
);
const latest = data.tags.findLastIndex((t) => !t.pre && t.released);
const release = data.tags[latest].name;
const inRelease = (item: Item) => item.ranges.some(([a, b]) => a <= latest && latest <= b);

/** Every item that reads a variable, by variable name. */
const byVariable = new Map<string, Item[]>();
for (const item of data.items) {
    const name = item.kind === "flag" || item.kind === "arg" ? item.env : item.key;
    if (!name?.startsWith("SURREAL_")) continue;
    byVariable.set(name, [...(byVariable.get(name) ?? []), item]);
}

/**
 * A default as a number, when the text is one: `1 << 20`, `10 * 1024 * 1024`,
 * `256 MiB`, `1,048,576 (1 MiB)` or `250_000`. Anything else is not compared.
 */
function asNumber(text: string): number | undefined {
    const value = text
        .replace(/`/g, "")
        .replace(/\s*\(.*$/s, "")
        .replace(/,\s*(at least|one in).*$/, "")
        .trim();
    const units: Record<string, number> = {
        b: 1,
        kb: 1024,
        kib: 1024,
        mb: 1024 ** 2,
        mib: 1024 ** 2,
        gb: 1024 ** 3,
        gib: 1024 ** 3,
    };
    const sized = value.match(/^(\d[\d_, ]*)\s*(b|kib|kb|mib|mb|gib|gb)$/i);
    if (sized) return Number(sized[1].replace(/[_, ]/g, "")) * units[sized[2].toLowerCase()];
    const shifted = value.match(/^(\d+)\s*<<\s*(\d+)$/);
    if (shifted) return Number(shifted[1]) * 2 ** Number(shifted[2]);
    if (/^\d+(\s*\*\s*\d+)+$/.test(value)) {
        return value.split("*").reduce((product, n) => product * Number(n), 1);
    }
    const plain = value.match(/^(\d[\d_, ]*)$/);
    return plain ? Number(plain[1].replace(/[_, ]/g, "")) : undefined;
}

/** The release's default for a variable, from its flag or from its help text. */
function sourceDefault(items: Item[]): string | undefined {
    const current = items.filter(inRelease);
    const run = current.flatMap((i) => i.defaults ?? []).filter(([tag]) => tag <= latest);
    const fromFlag = run.at(-1)?.[1];
    if (fromFlag != null) return fromFlag;
    return current.map((i) => i.help?.match(/default:\s*([^)]+)\)/)?.[1]).find(Boolean);
}

const problems: string[] = [];

// The environment variables page

const page = readFileSync(join(ROOT, ENV_PAGE), "utf8");
const rows = new Set<string>();

/** Rows for settings of a version that no tag has yet, which wait for that tag. */
const waiting: string[] = [];

/** The version a row's `<Since>` badge names, such as `4.0.2` for `<Since v="v4.0.2" />`. */
const sinceOf = (html: string) => html.match(/<Since v="v?(\d+\.\d+\.\d+)"/)?.[1];

/** Whether the version `a` is newer than the version `b`, each written as `4.0.2` or `v4.0.2`. */
const isNewer = (a: string, b: string) => {
    const parts = (v: string) => v.replace(/^v/, "").split(".").map(Number);
    const [pa, pb] = [parts(a), parts(b)];
    for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] > pb[i];
    return false;
};

for (const row of page.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    // Each cell's text by its column label, without its markup: the pieces
    // between its tags, joined. The text is only compared and printed, never
    // written into a page.
    const cells = new Map(
        [...row[1].matchAll(/<td[^>]*data-label="([^"]*)"[^>]*>([\s\S]*?)<\/td>/g)].map((m) => [
            m[1],
            m[2]
                .split(/<[^>]*>/)
                .join("")
                .trim(),
        ]),
    );
    if (cells.size === 0) continue;

    // The opening of the row's section: from its heading to its first table
    const before = page.slice(0, row.index);
    const heading = Math.max(before.lastIndexOf("\n## "), before.lastIndexOf("\n### "));
    const opening = before.slice(heading, before.indexOf("<table", heading));

    for (const name of (cells.get("Env var") ?? "").match(/SURREAL_[A-Z0-9_]+/g) ?? []) {
        rows.add(name);
        const items = byVariable.get(name);

        // A variable the release does not have, whose badge names a newer version
        const envCell = row[1].match(/data-label="Env var"[^>]*>([\s\S]*?)<\/td>/)?.[1] ?? "";
        const since = sinceOf(envCell);
        if (since && isNewer(since, release) && !items?.some(inRelease)) {
            waiting.push(`${name} (${since})`);
            continue;
        }

        if (!items) {
            problems.push(`${name} has a row, but no tagged release has had it`);
            continue;
        }

        if (!items.some(inRelease)) {
            // A `<Since>` badge, or a version named as one: `v3.2`, `3.x`, a
            // release such as `3.3.0` (an address such as `127.0.0.1` has four
            // parts), or "from", "before", "until" or "in" with a version
            const versioned =
                /<Since|\bv\d+\.\d+|\b\d+\.x\b|(?<![\d.])\d+\.\d+\.\d+(?![\d.])|\b(from|before|until|in|up to)( SurrealDB)? \d+\.\d+/i;
            if (!versioned.test(row[1]) && !versioned.test(opening)) {
                problems.push(
                    `${name} is not in ${release}, and neither its row nor its section says which versions it applies to`,
                );
            }
            continue;
        }

        const expected = sourceDefault(items);
        const documentedDefault = cells.get("Default") ?? "";
        const documented = asNumber(documentedDefault);
        const actual = expected === undefined ? undefined : asNumber(expected);
        if (documented !== undefined && actual !== undefined && documented !== actual) {
            problems.push(
                `${name} has the default ${documentedDefault}, but ${release} has ${expected}`,
            );
        }
    }
}

const current = [...byVariable].filter(([, items]) => items.some(inRelease)).map(([name]) => name);

for (const name of current) {
    if (rows.has(name) || name in INTERNAL) continue;
    problems.push(
        `${name} is in ${release} but has no row; document it, or list it in INTERNAL with the reason`,
    );
}

for (const name of Object.keys(INTERNAL)) {
    if (!current.includes(name)) {
        problems.push(`${name} is in INTERNAL, but ${release} does not have it`);
    } else if (rows.has(name)) {
        problems.push(`${name} is in INTERNAL, but it has a row`);
    }
}

// The command pages

const pages = readdirSync(join(ROOT, COMMANDS)).filter((f) => f.endsWith(".mdx"));
const pageText = (command: string) => {
    const name = PAGE_FOR[command] ?? command.replace(/^surreal ?/, "");
    const file = pages.find((f) => f === `${name}.mdx`);
    return file ? readFileSync(join(ROOT, COMMANDS, file), "utf8") : undefined;
};
const allPages = pages.map((f) => readFileSync(join(ROOT, COMMANDS, f), "utf8")).join("\n");
const flags = data.items.filter((i) => i.kind === "flag" && inRelease(i));

for (const flag of flags) {
    const command = flag.command ?? "surreal";
    const long = flag.key.split(" ").at(-1) ?? "";
    // A global flag of `surreal` is documented on the command pages it applies to
    const text =
        command === "surreal"
            ? allPages
            : [pageText(command), pageText(SHARES_FLAGS_WITH[command] ?? "")].join("\n");
    const documented = new RegExp(`${long}(?![\\w-])`).test(text);

    if (flag.key in HIDDEN_FLAGS) continue;
    if (!documented) {
        problems.push(
            `${flag.key} is in ${release} but its page does not mention it; document it, or list it in HIDDEN_FLAGS with the reason`,
        );
    }
}

const flagKeys = new Set(flags.map((f) => f.key));
for (const key of Object.keys(HIDDEN_FLAGS)) {
    if (!flagKeys.has(key))
        problems.push(`${key} is in HIDDEN_FLAGS, but ${release} does not have it`);
}

for (const problem of problems) console.error(problem);
if (waiting.length > 0) {
    console.log(
        `[cli] ${waiting.length} ${waiting.length === 1 ? "row is" : "rows are"} for versions after ${release}, and ${waiting.length === 1 ? "is" : "are"} checked once those are tagged: ${waiting.join(", ")}`,
    );
}
console.log(
    `[cli] ${release}: ${current.length} variables and ${flags.length} flags checked, ${problems.length} problems`,
);

if (problems.length > 0) process.exit(1);
