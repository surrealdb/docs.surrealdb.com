/**
 * Compares the HTTP routes and RPC methods of every stable release since 3.0
 * with the protocol pages. `bun run generate:surface-history` writes the data
 * from the engine source.
 *
 * For each of the two it reports:
 *
 * - what the newest release has and the pages have no heading for, and whether
 *   a page mentions it anyway;
 * - headings that name something no release since 3.0 has had;
 * - what was removed after 3.0, with the pages that still mention it;
 * - what was added after 3.0.0 and has no `<Since>` badge, or one for another
 *   version.
 *
 * Usage: bun scripts/check-surface.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const CONTENT = join(ROOT, "src/content");
const HTTP_PAGE = join(CONTENT, "reference/protocols/http-protocol.mdx");
const RPC_PAGE = join(CONTENT, "reference/protocols/rpc-protocol.mdx");

interface History {
    tags: string[];
    items: { name: string; ranges: [number, number][] }[];
}

const load = async (file: string) =>
    (await Bun.file(join(ROOT, "src/data", file)).json()) as History;
const routeHistory = await load("route-history.json");
const rpcHistory = await load("rpc-history.json");
const newest = routeHistory.tags.length - 1;

function files(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory()
            ? files(join(dir, entry.name))
            : /\.mdx?$/.test(entry.name)
              ? [join(dir, entry.name)]
              : [],
    );
}

const corpus = files(CONTENT).map((file) => ({ file, text: readFileSync(file, "utf8") }));

/** A path with its parameters named alike, so `/key/{table}` and `/key/:table` compare equal. */
const shape = (path: string) =>
    path
        .replace(/\{\*\w+\}/g, "*")
        .replace(/\{\w+\}|:\w+/g, ":p")
        .replace(/(.)\/$/, "$1");

interface Heading {
    key: string;
    since?: string;
    line: number;
}

/** The headings of a page that match a pattern, with the `<Since>` badge under each. */
function headings(file: string, pattern: RegExp, key: (m: RegExpExecArray) => string): Heading[] {
    const text = readFileSync(file, "utf8");
    const lines = text.split("\n");
    const pageSince = /^<Since\s+v="([^"]+)"/.exec(
        text
            .replace(/^---[\s\S]*?\n---\n/, "")
            .trimStart()
            .replace(/^# .*\n+/, ""),
    )?.[1];

    return lines.flatMap((line, index) => {
        const match = pattern.exec(line);

        if (!match) return [];

        const next = lines.slice(index + 1, index + 4).find((candidate) => candidate.trim() !== "");

        return [
            {
                key: key(match),
                since: /<Since\s+v="([^"]+)"/.exec(next ?? "")?.[1],
                line: index + 1,
            },
        ].map((heading) => ({ ...heading, since: heading.since ?? pageSince }));
    });
}

const live = (item: { ranges: [number, number][] }) => item.ranges.at(-1)?.[1] === newest;
const firstTag = (item: { ranges: [number, number][] }) =>
    routeHistory.tags[item.ranges[0]?.[0] ?? 0];
const lastTag = (item: { ranges: [number, number][] }) =>
    routeHistory.tags[item.ranges.at(-1)?.[1] ?? 0];

const section = (title: string, rows: string[]) => {
    console.log(`\n${title}: ${rows.length}`);
    for (const row of rows) console.log(`  ${row}`);
};

const mentions = (needle: string) =>
    corpus
        .filter(({ text }) => text.includes(needle))
        .map(({ file }) => file.slice(CONTENT.length + 1));

/** Whether a badge names the release a thing first shipped in, or its minor release. */
function sinceMatches(since: string | undefined, added: string | undefined): boolean {
    return !added || since === added || since === added.replace(/\.\d+$/, ".0");
}

// ---- RPC methods
const rpcHeadings = headings(RPC_PAGE, /^##\s+`([a-z_]+)`/, (m) => m[1] as string);
const rpcDocumented = new Map(rpcHeadings.map((heading) => [heading.key, heading]));
const rpcKnown = new Set(rpcHistory.items.map((item) => item.name));

console.log(
    `[surface] ${rpcHistory.items.filter(live).length} RPC methods and ${routeHistory.items.filter(live).length} routes in ${routeHistory.tags[newest]}, ${rpcHeadings.length} RPC headings, ${routeHistory.tags.length} releases from ${routeHistory.tags[0]}`,
);

section(
    "RPC methods in the newest release with no heading",
    rpcHistory.items
        .filter((item) => live(item) && !rpcDocumented.has(item.name))
        .map((item) => {
            const where = mentions(`\`${item.name}\``).filter((file) => file.includes("rpc"));

            return `${item.name} (since ${firstTag(item)})${where.length ? `, mentioned in ${where[0]}` : ""}`;
        }),
);
section(
    "RPC headings for a method no release since 3.0 has had",
    rpcHeadings
        .filter((heading) => !rpcKnown.has(heading.key))
        .map((h) => `${h.key} (line ${h.line})`),
);
section(
    "RPC methods removed since 3.0",
    rpcHistory.items
        .filter((item) => !live(item))
        .map((item) => `${item.name}: last in ${lastTag(item)}`),
);
section(
    "RPC methods added after 3.0.0 with a missing or different badge",
    rpcHistory.items.flatMap((item) => {
        const added = (item.ranges[0]?.[0] ?? 0) > 0 ? firstTag(item) : undefined;
        const heading = rpcDocumented.get(item.name);

        return heading && !sinceMatches(heading.since, added)
            ? [`${item.name}: first in ${added}, page says ${heading.since ?? "nothing"}`]
            : [];
    }),
);

// ---- HTTP routes
const routeHeadings = headings(
    HTTP_PAGE,
    /^##\s+`(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\s+(\/[^`]*)`/,
    (m) => `${m[1]} ${shape(m[2] as string)}`,
);
const routeDocumented = new Map(routeHeadings.map((heading) => [heading.key, heading]));

/** The `METHOD path` a route item stands for, with its parameters named alike. */
function pairs(name: string): string[] {
    const [method = "", ...rest] = name.split(" ");

    return [`${method} ${shape(rest.join(" "))}`];
}

const routeKnown = new Set(routeHistory.items.flatMap((item) => pairs(item.name)));
const documentedPair = (pair: string) => {
    const [method, ...rest] = pair.split(" ");
    const path = rest.join(" ");

    return method === "ANY"
        ? [...routeDocumented.keys()].some((key) => key.endsWith(` ${path}`))
        : routeDocumented.has(pair);
};

section(
    "Routes in the newest release with no heading",
    routeHistory.items
        .filter(live)
        .flatMap((item) => pairs(item.name).map((pair) => ({ item, pair })))
        .filter(({ pair }) => !documentedPair(pair))
        .map(({ item, pair }) => {
            const path = pair.split(" ").slice(1).join(" ");
            const where = mentions(path.replace(/:p/g, ""));

            return `${pair} (since ${firstTag(item)})${where.length ? `, text mentions in ${where[0]}` : ""}`;
        }),
);
section(
    "Route headings for a route no release since 3.0 has had",
    routeHeadings
        .filter((heading) => !routeKnown.has(heading.key))
        .map((h) => `${h.key} (line ${h.line})`),
);
section(
    "Routes removed since 3.0",
    routeHistory.items
        .filter((item) => !live(item))
        .map((item) => {
            const path = item.name
                .split(" ")
                .slice(1)
                .join(" ")
                .replace(/\{\w+\}/g, "");
            const where = mentions(path.replace(/\/$/, ""));

            return `${item.name}: last in ${lastTag(item)}, ${where.length ? `mentioned in ${where.slice(0, 3).join(", ")}` : "no page mentions it"}`;
        }),
);
section(
    "Routes added after 3.0.0 with a missing or different badge",
    routeHistory.items.flatMap((item) => {
        const added = (item.ranges[0]?.[0] ?? 0) > 0 ? firstTag(item) : undefined;

        return pairs(item.name).flatMap((pair) => {
            const heading = routeDocumented.get(pair);

            return heading && !sinceMatches(heading.since, added)
                ? [`${pair}: first in ${added}, page says ${heading.since ?? "nothing"}`]
                : [];
        });
    }),
);

// ---- What the binaries answer
interface SurfaceProbe {
    versions: Record<
        string,
        {
            routes: { probed: number; absent: string[]; wrongMethod: string[] };
            rpc: { probed: number; absent: string[]; httpAbsent: string[] };
        }
    >;
}

const probeFile = Bun.file(join(ROOT, "src/data/surface-probe.json"));

if (await probeFile.exists()) {
    const probe = (await probeFile.json()) as SurfaceProbe;
    const groups = new Map<string, string[]>();

    for (const [version, result] of Object.entries(probe.versions)) {
        const key = JSON.stringify([
            result.routes.absent,
            result.routes.wrongMethod,
            result.rpc.absent,
            result.rpc.httpAbsent,
        ]);

        groups.set(key, [...(groups.get(key) ?? []), version]);
    }

    // The label that each RPC heading carries, such as "websocket only".
    const rpcLines = readFileSync(RPC_PAGE, "utf8").split("\n");
    const websocketOnly = new Set(
        rpcLines.flatMap((line) => {
            const match = /^##\s+`([a-z_]+)`.*websocket only/.exec(line);

            return match ? [match[1] as string] : [];
        }),
    );

    for (const [key, versions] of groups) {
        const [absentRoutes, wrongMethod, absentRpc, httpAbsent] = JSON.parse(key) as string[][];
        const where = (versions as string[]).join(", ");

        section(
            `Declared in the source, and the binary has no route (${where})`,
            absentRoutes as string[],
        );
        section(
            `Declared in the source, and the route answers 405 (${where})`,
            wrongMethod as string[],
        );
        section(
            `Declared in the source, and a WebSocket answers "Method not found" (${where})`,
            absentRpc as string[],
        );

        // Over HTTP a method is missing when it needs the connection a WebSocket gives. A label cannot be
        // checked the other way: some labelled methods reach their handler over HTTP and fail on their arguments.
        const missingLabel = (httpAbsent as string[]).filter((name) => !websocketOnly.has(name));

        section(`Absent over HTTP and not labelled "websocket only" (${where})`, missingLabel);
    }
}
