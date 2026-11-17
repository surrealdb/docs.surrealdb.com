/**
 * Regenerates public/cli-history/data.json, the data behind the "Environment
 * variables and flags by version" page (reference/cli/db/version-history).
 *
 *   bun run generate:cli-history
 *
 * Reads every release tag of a local clone of surrealdb/surrealdb, at
 * ~/surrealdb or SURREALDB_REPO, with git only (nothing is checked out). Fetch
 * the clone's tags first (`git -C ~/surrealdb fetch --tags`), and have `gh`
 * signed in, since release dates come from the GitHub releases. Intermediate
 * files go in generated/cli-history.
 *
 * Steps: releases.json (gh) -> extract.ts (snapshots.json) -> aggregate.ts
 * (public-data.json) -> drop the 1.0.0 pre-releases -> data.json.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "../..");
const WORK = join(ROOT, "generated/cli-history");
const OUT = join(ROOT, "public/cli-history/data.json");

mkdirSync(WORK, { recursive: true });
process.chdir(WORK);

const releases = Bun.spawnSync(
    [
        "gh",
        "release",
        "list",
        "-R",
        "surrealdb/surrealdb",
        "--limit",
        "300",
        "--json",
        "tagName,publishedAt",
    ],
    { stderr: "inherit" },
);
if (releases.exitCode !== 0) throw new Error("gh release list failed");
await Bun.write("releases.json", releases.stdout);

// Both read and write their files in the working directory
await import("./extract.ts");
await import("./aggregate.ts");

type Item = { ranges: [number, number][]; defaults?: [number, unknown][] };
const data = await Bun.file("public-data.json").json();

// The 1.0.0 pre-releases are left out: indices shift down, a range that starts
// in a pre-release starts at 1.0.0, and an item seen only in them is dropped
const first = data.tags.findIndex((t: { name: string }) => t.name === "v1.0.0");
data.tags = data.tags.slice(first);
const items: Item[] = [];
for (const item of data.items as Item[]) {
    const ranges = item.ranges
        .filter(([, last]) => last >= first)
        .map(([start, last]) => [Math.max(start, first) - first, last - first] as [number, number]);
    if (ranges.length === 0) continue;
    item.ranges = ranges;
    if (item.defaults) {
        const runs: [number, unknown][] = [];
        for (const [index, value] of item.defaults) {
            const shifted = Math.max(index, first) - first;
            if (runs.length && runs[runs.length - 1][0] === shifted)
                runs[runs.length - 1][1] = value;
            else runs.push([shifted, value]);
        }
        item.defaults = runs;
    }
    items.push(item);
}
data.items = items;
data.note += " The 1.0.0 pre-releases are left out; an item first seen in one starts at 1.0.0.";

await Bun.write(OUT, JSON.stringify(data));
console.log(`${OUT}: ${data.tags.length} tags, ${items.length} items`);
