/**
 * Reports, for each feature in `scripts/features.ts`, every part of it that the
 * inventories hold, the releases it was in, and whether the docs cover it.
 *
 *   bun scripts/check-features.ts [feature...]
 *
 * The inventories are `public/cli-history/data.json` (commands, flags and
 * settings), and `src/data/` for routes, RPC methods and functions. Each part is
 * documented when a page mentions it: a command or setting by its name, a flag on
 * a page that names its command, a route by its path, an RPC method as code on
 * the RPC page and a function by its path. A feature whose last release is older
 * than the newest has ended, and a page that still mentions a part of it should
 * say that it is gone.
 *
 * It only reports, so that what a feature covers can be read before any of it
 * is enforced.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { FEATURES, type Feature, OUT_OF_SCOPE } from "./features";

const ROOT = join(import.meta.dir, "..");
const CONTENT = join(ROOT, "src/content");

interface Ranged {
    ranges: [number, number][];
}

const readJson = async <T>(file: string) => (await Bun.file(join(ROOT, file)).json()) as T;

const cliData = await readJson<{
    tags: { name: string }[];
    items: (Ranged & { key: string; kind: string; command?: string })[];
}>("public/cli-history/data.json");
const routeData = await readJson<{ tags: string[]; items: (Ranged & { name: string })[] }>(
    "src/data/route-history.json",
);
const rpcData = await readJson<{ tags: string[]; items: (Ranged & { name: string })[] }>(
    "src/data/rpc-history.json",
);
const functionData = await readJson<{ tags: string[]; items: (Ranged & { name: string })[] }>(
    "src/data/function-history.json",
);

function files(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
            ? files(join(dir, entry.name))
            : /\.mdx?$/.test(entry.name)
              ? [join(dir, entry.name)]
              : [],
    );
}

const pages = files(CONTENT).map((file) => ({
    file: file.slice(CONTENT.length + 1),
    text: readFileSync(file, "utf8"),
}));

const mentioning = (needle: string) => pages.filter(({ text }) => text.includes(needle));

/** The database commands are the `db` component of the launcher, so the docs write `surreal db mcp` for the `surreal mcp` of the source. */
const mentioningCommand = (command: string) =>
    pages.filter(({ text }) =>
        [command, command.replace(/^surreal /, "surreal db ")].some((variant) =>
            text.includes(variant),
        ),
    );

/** What a page says when a thing has gone. */
const GONE =
    /removed|no longer|3\.x (?:only|and earlier)|before (?:SurrealDB )?4\.0|up to (?:SurrealDB )?3\./i;

interface Part {
    surface: string;
    label: string;
    first: string;
    last: string;
    documented: boolean;
    /** Pages that mention the part. */
    pages: string[];
}

const major = (tag: string) => Number(tag.slice(1).split(".")[0]);

function span(tags: string[], item: Ranged): { first: string; last: string } {
    const first = tags[item.ranges[0]?.[0] ?? 0] as string;
    const last = tags[item.ranges.at(-1)?.[1] ?? 0] as string;

    return { first: major(first) < 3 ? "before 3.0" : first, last };
}

function allParts(feature: Feature): Part[] {
    const found: Part[] = [];
    const cliTags = cliData.tags.map((tag) => tag.name);

    for (const item of cliData.items) {
        const { first, last } = span(cliTags, item);

        if (major(last) < 3) continue;

        const isSetting = item.kind === "env" || item.kind === "config";

        if (isSetting && feature.settings?.test(item.key)) {
            const where = mentioning(item.key);

            found.push({
                surface: "settings",
                label: item.key,
                first,
                last,
                documented: where.length > 0,
                pages: where.map((p) => p.file),
            });
        }

        if (!isSetting && feature.cli?.test(item.key)) {
            const command = item.command ?? item.key.replace(/\s+[<[].*$/, "");
            // A command is looked up by its name, without the placeholders of an argument.
            const onCommand = mentioningCommand(command);

            if (item.kind === "flag") {
                const flag = item.key.slice(command.length).trim();
                const where = onCommand.filter(({ text }) => text.includes(flag));

                found.push({
                    surface: "flags",
                    label: item.key,
                    first,
                    last,
                    documented: where.length > 0,
                    pages: where.map((p) => p.file),
                });
            } else {
                found.push({
                    surface: "commands",
                    label: item.key,
                    first,
                    last,
                    documented: onCommand.length > 0,
                    pages: onCommand.map((p) => p.file),
                });
            }
        }
    }

    for (const item of routeData.items) {
        if (!feature.routes?.test(item.name)) continue;

        const path = item.name
            .split(" ")
            .slice(1)
            .join(" ")
            .replace(/\/?\{[^}]*\}/g, "");
        const where = mentioning(path);

        found.push({
            surface: "routes",
            label: item.name,
            ...span(routeData.tags, item),
            documented: where.length > 0,
            pages: where.map((p) => p.file),
        });
    }

    for (const item of rpcData.items) {
        if (!feature.rpc?.test(item.name)) continue;

        const where = mentioning(`\`${item.name}\``).filter((p) => p.file.includes("rpc"));

        found.push({
            surface: "rpc",
            label: item.name,
            ...span(rpcData.tags, item),
            documented: where.length > 0,
            pages: where.map((p) => p.file),
        });
    }

    for (const item of functionData.items) {
        if (!feature.functions?.test(item.name)) continue;

        const where = mentioning(item.name);

        found.push({
            surface: "functions",
            label: item.name,
            ...span(functionData.tags, item),
            documented: where.length > 0,
            pages: where.map((p) => p.file),
        });
    }

    for (const term of feature.terms ?? []) {
        const where = mentioning(term);

        found.push({
            surface: "terms",
            label: term,
            first: "-",
            last: "-",
            documented: where.length > 0,
            pages: where.map((p) => p.file),
        });
    }

    return found;
}

const newest = routeData.tags.at(-1) as string;

const partId = (part: Part) => `${part.surface}|${part.label}`;

/** The parts that are not tracked, each with the reason. They are in no feature and in no report. */
const outOfScope = new Map<string, string>(
    OUT_OF_SCOPE.flatMap((rule) =>
        allParts({ name: rule.why, ...rule }).map((part) => [partId(part), rule.why] as const),
    ),
);

/** The parts of a feature, without the ones that are out of scope. */
function parts(feature: Feature): Part[] {
    return allParts(feature).filter((part) => !outOfScope.has(partId(part)));
}

/** Every part that any inventory holds since 3.0, which the features have to cover between them. */
const universe = parts({
    name: "everything",
    cli: /./,
    settings: /./,
    routes: /./,
    rpc: /./,
    functions: /./,
});

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One feature for each command, and one for each function namespace, so that none can be left out. */
function automatic(): Feature[] {
    const commands = new Set(
        universe
            .filter((part) => part.surface === "commands" || part.surface === "flags")
            .map((part) => {
                const [, word] = part.label.split(" ");

                return word && !word.startsWith("-") && !word.startsWith("<")
                    ? `surreal ${word}`
                    : "surreal";
            }),
    );
    const namespaces = new Set(
        universe
            .filter((part) => part.surface === "functions")
            .map((part) =>
                part.label.includes("::") ? (part.label.split("::")[0] as string) : "",
            ),
    );

    return [
        ...[...commands].map(
            (command): Feature => ({
                name:
                    command === "surreal"
                        ? "command: surreal (global flags)"
                        : `command: ${command}`,
                cli:
                    command === "surreal"
                        ? /^surreal (--|-\w)/
                        : new RegExp(`^${escape(command)}( |$)`),
            }),
        ),
        ...[...namespaces].map(
            (namespace): Feature => ({
                name: namespace ? `functions: ${namespace}` : "functions: no namespace",
                functions: namespace ? new RegExp(`^${namespace}::`) : /^[^:]+$/,
            }),
        ),
    ];
}

const everyFeature = [...FEATURES, ...automatic()];
const claimed = new Set(
    everyFeature.flatMap((feature) =>
        parts(feature).map((part) => `${part.surface}|${part.label}`),
    ),
);
const unassigned = universe.filter((part) => {
    const id = `${part.surface}|${part.label}`;

    return !claimed.has(id) && !outOfScope.has(id);
});

const args = process.argv.slice(2);
const detail = args.filter((arg) => !arg.startsWith("--"));

function marked(part: Part): boolean {
    return part.pages.every((page) =>
        GONE.test(pages.find((candidate) => candidate.file === page)?.text ?? ""),
    );
}

if (args.includes("--unassigned")) {
    console.log(
        `${unassigned.length} parts that no feature claims, and ${outOfScope.size} that are out of scope:`,
    );

    for (const part of unassigned)
        console.log(`  ${part.surface.padEnd(9)} ${part.label}  (${part.first}..${part.last})`);
} else if (detail.length === 0) {
    // One line for each feature.
    console.log(
        `${everyFeature.length} features, ${universe.length} parts since 3.0, ${outOfScope.size} out of scope, ${unassigned.length} claimed by none`,
    );
    console.log("\nfeature".padEnd(40) + "parts  undocumented  ended  unmarked-pages");

    for (const feature of everyFeature) {
        const all = parts(feature);
        const missing = all.filter(
            (part) =>
                (!part.documented && part.last === newest) ||
                (!part.documented && part.last === "-"),
        );
        const ended = all.filter((part) => part.last !== "-" && part.last !== newest);
        const unmarked = new Set(
            ended.flatMap((part) =>
                part.pages.filter(
                    (page) => !GONE.test(pages.find((c) => c.file === page)?.text ?? ""),
                ),
            ),
        );

        console.log(
            `${feature.name.padEnd(39)} ${String(all.length).padStart(4)}  ${String(missing.length).padStart(12)}  ${String(ended.length).padStart(5)}  ${String(unmarked.size).padStart(14)}`,
        );
    }

    console.log(
        "\nbun scripts/check-features.ts <feature>  for the parts, or --unassigned for what no feature claims",
    );
} else {
    for (const feature of everyFeature.filter((candidate) => detail.includes(candidate.name))) {
        const all = parts(feature);
        const ended = all.filter((part) => part.last !== "-" && part.last !== newest);
        const surfaces = [...new Set(all.map((part) => part.surface))];

        console.log(`\n== ${feature.name} ==`);

        for (const surface of surfaces) {
            const of = all.filter((part) => part.surface === surface);
            const undocumented = of.filter((part) => !part.documented);
            const lasts = [...new Set(of.map((part) => part.last))];

            console.log(
                `  ${surface.padEnd(10)} ${String(of.length).padStart(3)} parts, ${of.length - undocumented.length} documented, last in ${lasts.join(" / ")}`,
            );

            for (const part of undocumented) {
                console.log(
                    `      not documented: ${part.label}${part.last !== newest && part.last !== "-" ? " (ended)" : ""}`,
                );
            }
        }

        if (ended.length > 0) {
            const lasts = [...new Set(ended.map((part) => part.last))].join(", ");
            const unmarked = new Map<string, string[]>();

            for (const part of ended) {
                for (const page of part.pages) {
                    if (
                        !GONE.test(pages.find((candidate) => candidate.file === page)?.text ?? "")
                    ) {
                        unmarked.set(page, [...(unmarked.get(page) ?? []), part.label]);
                    }
                }
            }

            console.log(
                `  ended: ${ended.length} parts, which ${newest} no longer has (last releases: ${lasts})`,
            );

            for (const [page, labels] of unmarked) {
                console.log(
                    `      ${page} mentions ${labels.length} of them and says nothing about their removal`,
                );
            }
        }
    }
}

// A part that no feature claims means that a release added something this file does not know about.
if (unassigned.length > 0) {
    console.error(
        `${unassigned.length} parts are in no feature and not out of scope: see the header of scripts/features.ts`,
    );
    process.exit(1);
}

void marked;
