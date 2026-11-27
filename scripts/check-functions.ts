/**
 * Compares the built-in functions of every stable release since 3.0, from
 * `src/data/function-history.json`, with the headings of the function pages.
 * `bun run generate:function-history` writes the data from the engine source.
 *
 * It reports:
 *
 * - functions and constants in the newest release that no function page
 *   mentions, and those that a page mentions but gives no section of their own;
 * - headings that name a path no release since 3.0 has had, which is a typo, a
 *   function from before 3.0 or one that is not in a release yet;
 * - functions that were removed after 3.0, and whether a heading still covers
 *   them for the readers on the versions that have them;
 * - a function first added after 3.0.0 whose section carries no `<Since>`
 *   badge, or one that names another version;
 * - where `src/data/function-runtime.json` has a version, the functions that the
 *   binary reports and the parser table does not, and the reverse. The two are
 *   independent sources, so a difference is a function that one of them misses;
 * - where `src/data/function-probe.json` has a version, the names that the engine
 *   cannot run although a list has them, found by calling each one.
 *
 * Usage: bun scripts/check-functions.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const FUNCTIONS = join(ROOT, "src/content/reference/query-language/functions");

interface Item {
    name: string;
    kind: "function" | "constant";
    formerly?: string;
    ranges: [number, number][];
}

const data = (await Bun.file(join(ROOT, "src/data/function-history.json")).json()) as {
    tags: string[];
    items: Item[];
};
const newest = data.tags.length - 1;

function pages(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
            ? pages(join(dir, entry.name))
            : entry.name.endsWith(".mdx")
              ? [join(dir, entry.name)]
              : [],
    );
}

/** The path a heading names, such as `array::add` from ``## `array::add()` ``. */
const HEADING = /^#{2,6}\s+`([A-Za-z_]\w*(?:::\w+)+)\(?[^`]*`/;

interface Documented {
    file: string;
    since?: string;
}

const documented = new Map<string, Documented>();

for (const file of pages(FUNCTIONS)) {
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    const namespace = basename(file, ".mdx");

    // A page that is new as a whole carries one badge under its frontmatter or its title.
    const body = text
        .replace(/^---[\s\S]*?\n---\n/, "")
        .trimStart()
        .replace(/^# .*\n+/, "");
    const pageSince = /^<Since\s+v="([^"]+)"/.exec(body)?.[1];

    lines.forEach((line, index) => {
        // A method heading such as ``## `.chain()` `` on the `value` page documents `value::chain`.
        const method = /^#{2,6}\s+`\.(\w+)\(/.exec(line);
        const match = HEADING.exec(line) ?? (method ? [line, `${namespace}::${method[1]}`] : null);

        if (!match) return;

        // A `<Since>` badge sits on its own line directly under the heading.
        const next = lines.slice(index + 1, index + 4).find((candidate) => candidate.trim() !== "");
        const since = (next ? /<Since\s+v="([^"]+)"/.exec(next)?.[1] : undefined) ?? pageSince;

        documented.set((match[1] as string).toLowerCase(), {
            file: file.slice(ROOT.length + 1),
            since,
        });
    });
}

// A path counts as mentioned when a function page names it anywhere, such as
// the alias of another function. A function with no namespace is documented by
// the page that carries its name.
const pageText = pages(FUNCTIONS)
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
const mentioned = (name: string) =>
    name.includes("::")
        ? new RegExp(`(?<![\\w:])${name.replace(/::/g, "::")}(?![\\w:])`, "i").test(pageText)
        : pages(FUNCTIONS).some((file) => file.endsWith(`/${name}.mdx`));

const live = (item: Item) => item.ranges.at(-1)?.[1] === newest;
const known = new Set(data.items.map((i) => i.name));

const unheaded = data.items.filter(
    (item) =>
        live(item) &&
        !documented.has(item.name) &&
        // A function with no namespace has a page named after it.
        (item.name.includes("::") || !mentioned(item.name)),
);
const missing = unheaded.filter((item) => !mentioned(item.name));
const mentionOnly = unheaded.filter((item) => mentioned(item.name));
// Model calls such as `ml::name<1.0.0>` are not in the table of built-in paths.
const unknown = [...documented.keys()].filter(
    (name) => !known.has(name) && !name.startsWith("ml::"),
);
const removed = data.items.filter((item) => !live(item));

/** The release a function first shipped in, when that is after 3.0.0. */
function addedIn(item: Item): string | undefined {
    const first = item.ranges[0]?.[0] ?? 0;

    return first > 0 ? data.tags[first] : undefined;
}

const mismatched = data.items.flatMap((item) => {
    const added = addedIn(item);
    const doc = documented.get(item.name);

    if (!added || !doc || !live(item)) return [];

    // A patch release's badge may name the minor release that it first shipped in.
    const wanted = added.replace(/\.\d+$/, ".0");

    return doc.since === added || doc.since === wanted
        ? []
        : [`${item.name}: first in ${added}, page says ${doc.since ?? "nothing"}`];
});

const section = (title: string, rows: string[]) => {
    console.log(`\n${title}: ${rows.length}`);
    for (const row of rows) console.log(`  ${row}`);
};

console.log(
    `[functions] ${data.items.filter(live).length} functions and constants in ${data.tags.at(-1)}, ` +
        `${documented.size} with a heading, ${data.tags.length} releases from ${data.tags[0]}`,
);
const describe = (item: Item) =>
    `${item.name} (${item.kind}, since ${data.tags[item.ranges[0]?.[0] ?? 0]})`;

section("In the newest release and on no function page", missing.map(describe));
section("Mentioned on a function page, with no section of its own", mentionOnly.map(describe));
section(
    "Documented but in no release since 3.0",
    unknown.map((name) => `${name}  (${documented.get(name)?.file})`),
);
section(
    "Removed since 3.0",
    removed.map((item) => {
        const last = data.tags[item.ranges.at(-1)?.[1] ?? 0];
        const doc = documented.get(item.name);

        return `${item.name}: last in ${last}, ${doc ? `headed in ${doc.file}` : "no heading"}`;
    }),
);
section("Added after 3.0.0 with a missing or different badge", mismatched);

interface Runtime {
    versions: Record<string, string[]>;
}

const runtimeFile = Bun.file(join(ROOT, "src/data/function-runtime.json"));

/** Functions that a script cannot reach, so the runtime list lacks them whatever the version. */
const NOT_SCRIPTABLE = [
    { prefix: "rand::", why: "the `rand` functions are not in the script object" },
];

if (await runtimeFile.exists()) {
    const runtime = (await runtimeFile.json()) as Runtime;

    for (const [version, paths] of Object.entries(runtime.versions)) {
        // A release is compared with its own tag. An unreleased build is compared
        // with the newest release of its major version, so what it adds shows up too.
        const tag = data.tags.includes(`v${version}`)
            ? `v${version}`
            : data.tags
                  .filter((candidate) => candidate.startsWith(`v${version.split(".")[0]}.`))
                  .at(-1);

        if (!tag) continue;

        const index = data.tags.indexOf(tag);
        const table = new Set(
            data.items
                .filter(
                    (item) =>
                        item.kind === "function" &&
                        item.ranges.some(([first, last]) => first <= index && index <= last),
                )
                .map((item) => item.name),
        );
        const reported = new Set(paths);
        // A name that is a function and also a namespace, such as `array::sort`, is only one of them in a script.
        const shadowed = (name: string) => paths.some((path) => path.startsWith(`${name}::`));

        const runtimeOnly = paths.filter((path) => !table.has(path));
        const tableOnly = [...table].filter(
            (name) =>
                !reported.has(name) &&
                !shadowed(name) &&
                !NOT_SCRIPTABLE.some((rule) => name.startsWith(rule.prefix)),
        );
        const exact = tag === `v${version}`;
        const note = exact ? "" : ` (compared with ${tag}, so new functions show here)`;

        section(
            `Reported by ${version} and not in the parser table at ${tag}${note}`,
            runtimeOnly.map((path) => `${path}${mentioned(path) ? "" : "  (on no function page)"}`),
        );
        section(`In the parser table at ${tag} and not reported by ${version}`, tableOnly);
    }
}

interface Probe {
    versions: Record<
        string,
        {
            probed: number;
            missing: string[];
            unrecognised: string[];
            messages: Record<string, string>;
        }
    >;
}

const probeFile = Bun.file(join(ROOT, "src/data/function-probe.json"));

if (await probeFile.exists()) {
    const probe = (await probeFile.json()) as Probe;

    // Versions with the same failures are one row, so a long run of releases reads as a range.
    const groups = new Map<string, string[]>();

    for (const [version, result] of Object.entries(probe.versions)) {
        const key = JSON.stringify([result.missing, result.unrecognised]);

        groups.set(key, [...(groups.get(key) ?? []), version]);
    }

    for (const [key, versions] of groups) {
        const [missing, unrecognised] = JSON.parse(key) as [string[], string[]];
        const where = versions.join(", ");

        // `api::` functions only run inside an API route handler, so calling one on its own is not a fault.
        const apiOnly = (name: string) => name.startsWith("api::");

        section(
            `Called in ${where}: listed, and "not found in function registry"`,
            missing.map(
                (name) => `${name}${apiOnly(name) ? "  (only runs inside an API route)" : ""}`,
            ),
        );
        section(`Called in ${where}: listed, and refused by the parser`, unrecognised);
    }
}
