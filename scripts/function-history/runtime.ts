/**
 * Lists the built-in functions that a `surreal` binary itself reports, and adds
 * them to `src/data/function-runtime.json`, a second source to cross-check the
 * parser table that `generate.ts` reads from the source.
 *
 *   bun scripts/function-history/runtime.ts <surreal binary>...
 *
 * Each binary is started on a spare port with scripting allowed, and a script
 * function walks `surrealdb.functions`, the object that holds every function a
 * script can call, into a list of `a::b` paths. The result is stored under the
 * binary's version, and running it again for the same version replaces it.
 *
 * Scripting cannot reach every function. The `rand` functions are missing from
 * the object, and a name that is both a function and a namespace, such as
 * `array::sort`, can only be one of them, so the two sources are compared and
 * not merged.
 */
import { join } from "node:path";

const OUT = join(import.meta.dir, "../../src/data/function-runtime.json");

const WALK = `RETURN function() {
    const out = [];
    const walk = (object, prefix) => {
        for (const key of Object.keys(object)) {
            const value = object[key];
            const path = prefix ? prefix + "::" + key : key;

            if (typeof value === "function") out.push(path);
            else if (value && typeof value === "object") walk(value, path);
        }
    };
    walk(surrealdb.functions, "");
    return JSON.stringify(out);
};`;

/** A port that nothing listens on, found by asking the system for one. */
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

async function functionsOf(binary: string): Promise<string[]> {
    const port = sparePort();
    const server = Bun.spawn(
        [
            binary,
            "start",
            "--unauthenticated",
            "--allow-scripting",
            "--bind",
            `127.0.0.1:${port}`,
            "memory",
        ],
        { stdout: "ignore", stderr: "ignore" },
    );

    try {
        for (let attempt = 0; attempt < 60; attempt++) {
            const ready = await fetch(`http://127.0.0.1:${port}/health`).catch(() => undefined);

            if (ready?.ok) break;
            await Bun.sleep(500);
        }

        const response = await fetch(`http://127.0.0.1:${port}/sql`, {
            method: "POST",
            headers: { Accept: "application/json", "surreal-ns": "t", "surreal-db": "t" },
            body: WALK,
        });
        const [statement] = (await response.json()) as { status: string; result: string }[];

        if (statement?.status !== "OK") {
            throw new Error(`${binary}: ${JSON.stringify(statement?.result)}`);
        }

        return (JSON.parse(statement.result) as string[]).sort();
    } finally {
        server.kill();
    }
}

const binaries = process.argv.slice(2);

if (binaries.length === 0) {
    console.error("usage: bun scripts/function-history/runtime.ts <surreal binary>...");
    process.exit(1);
}

const stored = (await Bun.file(OUT).exists())
    ? ((await Bun.file(OUT).json()) as { versions: Record<string, string[]> })
    : { versions: {} };

for (const binary of binaries) {
    const version = versionOf(binary);
    const functions = await functionsOf(binary);

    stored.versions[version] = functions;
    console.log(`[fn] ${version}: ${functions.length} functions from ${binary}`);
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
            note: "The functions each surreal version reports through surrealdb.functions, in a script function. Compare with function-history.json, which is read from the parser table in the source.",
            versions: sorted,
        },
        null,
        1,
    )}\n`,
);
