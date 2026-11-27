/**
 * Calls every built-in function of a release with no arguments, and records
 * which ones the engine cannot run. It adds the result to
 * `src/data/function-probe.json`.
 *
 *   bun scripts/function-history/probe.ts <surreal binary>...
 *
 * The names are the union of the two lists in `src/data/`: the parser table of
 * the release (`function-history.json`, read from the source) and what the
 * binary reports to a script (`function-runtime.json`, from `runtime.ts`). Each
 * name is called as `RETURN a::b();` on a spare port, with the default
 * capabilities. A name that exists fails on its arguments, or on a capability
 * check, or runs, and none of those matters here. A name that does not exist
 * fails with `not found in function registry` or is refused by the parser,
 * and those are the ones stored.
 *
 * This is the truth that the other two lists approximate: it is what a query
 * actually gets.
 */
import { join } from "node:path";

const DATA = join(import.meta.dir, "../../src/data");
const OUT = join(DATA, "function-probe.json");

function sparePort(): number {
    const server = Bun.listen({ hostname: "127.0.0.1", port: 0, socket: { data() {} } });
    const port = server.port;

    server.stop(true);

    return port;
}

function versionOf(binary: string): string {
    const text = Bun.spawnSync([binary, "--version"]).stdout.toString();
    const match = /(\d+\.\d+\.\d+(?:-[\w.]+)?)/.exec(text);

    if (!match) throw new Error(`${binary}: no version in "${text.trim()}"`);

    return match[1] as string;
}

const history = (await Bun.file(join(DATA, "function-history.json")).json()) as {
    tags: string[];
    items: { name: string; kind: string; ranges: [number, number][] }[];
};
const runtime = (await Bun.file(join(DATA, "function-runtime.json")).json()) as {
    versions: Record<string, string[]>;
};

/** The tag whose table stands for a version: its own, or the newest of its major version. */
function tagFor(version: string): string | undefined {
    return history.tags.includes(`v${version}`)
        ? `v${version}`
        : history.tags.filter((tag) => tag.startsWith(`v${version.split(".")[0]}.`)).at(-1);
}

function namesFor(version: string): string[] {
    const tag = tagFor(version);
    const index = tag ? history.tags.indexOf(tag) : -1;
    const table = history.items
        .filter(
            (item) =>
                item.kind === "function" &&
                item.ranges.some(([first, last]) => first <= index && index <= last),
        )
        .map((item) => item.name);

    return [...new Set([...table, ...(runtime.versions[version] ?? [])])].sort();
}

/** What a failed call says about the name. */
function classify(message: string): "missing" | "unrecognised" | "present" {
    if (/not found in function registry|unknown function/i.test(message)) return "missing";
    if (/invalid function\/constant path/i.test(message)) return "unrecognised";

    return "present";
}

async function probe(binary: string, names: string[]) {
    const port = sparePort();
    const server = Bun.spawn(
        [binary, "start", "--unauthenticated", "--bind", `127.0.0.1:${port}`, "memory"],
        { stdout: "ignore", stderr: "ignore" },
    );
    const url = `http://127.0.0.1:${port}/sql`;
    const headers = { Accept: "application/json", "surreal-ns": "t", "surreal-db": "t" };

    try {
        for (let attempt = 0; attempt < 60; attempt++) {
            const ready = await fetch(`http://127.0.0.1:${port}/health`).catch(() => undefined);

            if (ready?.ok) break;
            await Bun.sleep(500);
        }

        const missing: string[] = [];
        const unrecognised: string[] = [];
        const messages = new Map<string, string>();

        const record = (name: string, message: string) => {
            const kind = classify(message);

            if (kind === "missing") missing.push(name);
            if (kind === "unrecognised") unrecognised.push(name);
            if (kind !== "present") messages.set(kind, message.slice(0, 160));
        };

        // One request answers every name, unless the parser refuses one of
        // them, which fails the whole request, so those are found one by one.
        const body = names.map((name) => `RETURN ${name}();`).join("\n");
        const response = await fetch(url, { method: "POST", headers, body });
        const answer = (await response.json()) as unknown;

        if (Array.isArray(answer) && answer.length === names.length) {
            (answer as { status: string; result: unknown }[]).forEach((statement, index) => {
                if (statement.status !== "OK") {
                    record(names[index] as string, String(statement.result));
                }
            });
        } else {
            for (const name of names) {
                const single = await fetch(url, {
                    method: "POST",
                    headers,
                    body: `RETURN ${name}();`,
                });
                const result = (await single.json()) as unknown;

                if (Array.isArray(result)) {
                    const [statement] = result as { status: string; result: unknown }[];

                    if (statement && statement.status !== "OK")
                        record(name, String(statement.result));
                } else {
                    record(name, JSON.stringify(result));
                }
            }
        }

        return { missing, unrecognised, messages: Object.fromEntries(messages) };
    } finally {
        server.kill();
    }
}

const binaries = process.argv.slice(2);

if (binaries.length === 0) {
    console.error("usage: bun scripts/function-history/probe.ts <surreal binary>...");
    process.exit(1);
}

const stored = (await Bun.file(OUT).exists())
    ? ((await Bun.file(OUT).json()) as { versions: Record<string, unknown> })
    : { versions: {} };

for (const binary of binaries) {
    const version = versionOf(binary);
    const names = namesFor(version);
    const result = await probe(binary, names);

    stored.versions[version] = { probed: names.length, ...result };
    console.log(
        `[fn] ${version}: ${names.length} names, ${result.missing.length} not found, ` +
            `${result.unrecognised.length} refused by the parser`,
    );
}

const sorted = Object.fromEntries(
    Object.entries(stored.versions).sort(([a], [b]) =>
        a.localeCompare(b, undefined, { numeric: true }),
    ),
);

await Bun.write(
    OUT,
    `${JSON.stringify(
        {
            note: "Each built-in function name of a release, from the parser table and the script object, called with no arguments. `missing` failed with 'not found in function registry', `unrecognised` was refused by the parser.",
            versions: sorted,
        },
        null,
        1,
    )}\n`,
);
