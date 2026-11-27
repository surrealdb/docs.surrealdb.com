/**
 * Regenerates `src/data/function-history.json`: every built-in function and
 * constant path the language recognised in each stable release since 3.0.
 *
 *   bun run generate:function-history
 *
 * Reads a local clone of surrealdb/surrealdb, at ~/surrealdb or SURREALDB_REPO,
 * with git only, as `generate:cli-history` does. Fetch its tags first
 * (`git -C ~/surrealdb fetch --tags`).
 *
 * Each release has one table of paths, `PATHS`, which the parser uses to
 * resolve a name such as `array::add`. It has moved between files, so the file
 * is found by its `static PATHS` declaration. An entry's key is the current path.
 * An entry that carries a rename holds the name the path had before, which the
 * parser uses to point a reader of old code at the new path, so it is recorded
 * as the path's `formerly` and the old name is not a path of its own.
 *
 * The table holds `a::b` paths only. A function with no namespace, such as
 * `count()`, and the methods of a value, such as `.len()`, are not in it.
 */
import { join } from "node:path";
import { git, ranges, releaseTags } from "../lib/surrealdb-releases";

const ROOT = join(import.meta.dir, "../..");
const OUT = join(ROOT, "src/data/function-history.json");
const FIRST_MAJOR = 3;

/** The file that declares `PATHS` at a tag. */
function tableFile(tag: string): string {
    const found = git("grep", "-l", "static PATHS", tag, "--", "*.rs")
        .split("\n")
        .filter(Boolean)
        .map((line) => line.slice(tag.length + 1));

    if (found.length !== 1) {
        throw new Error(`${tag}: expected one file with \`static PATHS\`, found ${found.length}`);
    }

    return found[0] as string;
}

/**
 * One entry of the table. From 4.0 an entry has a third item, the release that
 * the path first shipped in, and `FIRST` stands for every release before the
 * table recorded one.
 */
const ENTRY =
    /UniCase::ascii\("([^"]+)"\)\s*=>\s*\(\s*PathKind::(Function|Constant\([^)]*\))\s*,\s*(None|Some\(\s*UniCase::ascii\("([^"]+)"\)\s*\))\s*(?:,\s*([\w:]+)\s*)?\)/g;

interface Entry {
    kind: "function" | "constant";
    formerly?: string;
    /** The release the 4.0 table declares for the path, when it is not `FIRST`. */
    declared?: string;
}

function entries(tag: string): Map<string, Entry> {
    const text = git("show", `${tag}:${tableFile(tag)}`);
    const found = new Map<string, Entry>();

    for (const match of text.matchAll(ENTRY)) {
        found.set((match[1] as string).toLowerCase(), {
            kind: match[2] === "Function" ? "function" : "constant",
            formerly: match[4]?.toLowerCase(),
            declared: match[5] && match[5] !== "FIRST" ? match[5] : undefined,
        });
    }

    return found;
}

const tags = releaseTags(FIRST_MAJOR);
const items = new Map<
    string,
    { kind: string; formerly?: string; declared?: string; present: boolean[] }
>();

tags.forEach((tag, index) => {
    for (const [name, entry] of entries(tag)) {
        const item = items.get(name) ?? {
            kind: entry.kind,
            formerly: entry.formerly,
            present: tags.map(() => false),
        };

        item.present[index] = true;
        item.formerly ??= entry.formerly;
        item.declared ??= entry.declared;
        items.set(name, item);
    }

    console.log(`[fn] ${tag}: ${entries(tag).size} paths`);
});

const data = {
    note: "Each item is a path from the parser's PATHS table at the release tags listed, as [first, last] tag indices. `formerly` is the name the path had before the release that renamed it.",
    tags,
    items: [...items]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, item]) => ({
            name,
            kind: item.kind,
            ...(item.formerly ? { formerly: item.formerly } : {}),
            ...(item.declared ? { declared: item.declared } : {}),
            ranges: ranges(item.present),
        })),
};

await Bun.write(OUT, `${JSON.stringify(data, null, 1)}\n`);
console.log(`[fn] ${data.items.length} paths across ${tags.length} releases -> ${OUT}`);
