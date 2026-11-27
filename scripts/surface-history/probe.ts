/**
 * Calls every HTTP route and RPC method of a release on a running `surreal`
 * binary, and records the ones that are not there. It adds the result to
 * `src/data/surface-probe.json`.
 *
 *   bun scripts/surface-history/probe.ts <surreal binary>...
 *
 * The names are those that the engine source declares for the release, from
 * `route-history.json` and `rpc-history.json`. The server runs unauthenticated
 * on a spare port, with the default capabilities and no build features beyond
 * what the binary has, so a route that an edition or a feature leaves out is
 * absent here although the source declares it.
 *
 * - A route is absent when the answer is a 404 with no body, which is the
 *   router's own. A handler's 404, such as an unknown model, carries a body.
 *   A 405 means the route is there for other methods.
 * - An RPC method is absent when the answer is `Method not found`, over a
 *   WebSocket. Over HTTP the methods that only a WebSocket has answer the same,
 *   and they are stored as `httpAbsent`.
 */
import { join } from "node:path";

const DATA = join(import.meta.dir, "../../src/data");
const OUT = join(DATA, "surface-probe.json");

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

interface History {
    tags: string[];
    items: { name: string; ranges: [number, number][] }[];
}

const routes = (await Bun.file(join(DATA, "route-history.json")).json()) as History;
const methods = (await Bun.file(join(DATA, "rpc-history.json")).json()) as History;

/** The tag whose source stands for a version: its own, or the newest of its major version. */
function indexFor(version: string): number {
    const tag = routes.tags.includes(`v${version}`)
        ? `v${version}`
        : routes.tags
              .filter((candidate) => candidate.startsWith(`v${version.split(".")[0]}.`))
              .at(-1);

    return tag ? routes.tags.indexOf(tag) : -1;
}

const declared = (history: History, index: number) =>
    history.items
        .filter((item) => item.ranges.some(([first, last]) => first <= index && index <= last))
        .map((item) => item.name);

/** The methods that a WebSocket connection answers with `Method not found`. */
async function absentOverWebSocket(port: number, names: string[]): Promise<string[]> {
    const socket = new WebSocket(`ws://127.0.0.1:${port}/rpc`, ["json"]);

    await new Promise<void>((resolve, reject) => {
        socket.onopen = () => resolve();
        socket.onerror = () => reject(new Error("the WebSocket did not open"));
    });

    const absent: string[] = [];

    for (const [index, name] of names.entries()) {
        const id = index + 1;
        const answer = await new Promise<{ id?: number; error?: { code?: number } } | undefined>(
            (resolve) => {
                const timer = setTimeout(() => resolve(undefined), 4000);

                socket.onmessage = (event) => {
                    const message = JSON.parse(String(event.data)) as {
                        id?: number;
                        error?: { code?: number };
                    };

                    if (message.id === id) {
                        clearTimeout(timer);
                        resolve(message);
                    }
                };
                socket.send(JSON.stringify({ id, method: name, params: [] }));
            },
        );

        if (answer?.error?.code === -32601) absent.push(name);
    }

    socket.close();

    return absent;
}

async function probe(binary: string, index: number) {
    const port = sparePort();
    const server = Bun.spawn(
        [binary, "start", "--unauthenticated", "--bind", `127.0.0.1:${port}`, "memory"],
        { stdout: "ignore", stderr: "ignore" },
    );
    const base = `http://127.0.0.1:${port}`;
    const headers = { Accept: "application/json", "surreal-ns": "t", "surreal-db": "t" };

    try {
        for (let attempt = 0; attempt < 60; attempt++) {
            const ready = await fetch(`${base}/health`).catch(() => undefined);

            if (ready?.ok) break;
            await Bun.sleep(500);
        }

        const absentRoutes: string[] = [];
        const wrongMethod: string[] = [];
        const routeNames = declared(routes, index);

        for (const name of routeNames) {
            const [method = "GET", ...rest] = name.split(" ");
            const path = rest.join(" ").replace(/\{\*\w+\}|\{\w+\}/g, "x");
            const response = await fetch(`${base}${path}`, {
                method: method === "ANY" ? "GET" : method,
                headers,
                redirect: "manual",
                signal: AbortSignal.timeout(8000),
            }).catch(() => undefined);

            if (!response) continue;

            // A body that cannot be read, because the server closed the connection, is a handler's answer.
            const body = method === "HEAD" ? "x" : await response.text().catch(() => "x");

            if (response.status === 404 && body === "") absentRoutes.push(name);
            if (response.status === 405) wrongMethod.push(name);
        }

        const methodNames = declared(methods, index);

        // Over HTTP, a method that only a WebSocket connection has answers `Method not found`.
        const httpAbsent: string[] = [];

        for (const name of methodNames) {
            const response = await fetch(`${base}/rpc`, {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({ id: 1, method: name, params: [] }),
                signal: AbortSignal.timeout(8000),
            }).catch(() => undefined);
            const answer = (await response?.json().catch(() => undefined)) as
                | { error?: { code?: number } }
                | undefined;

            if (answer?.error?.code === -32601) httpAbsent.push(name);
        }

        // Over a WebSocket every method of the release is there, or is not.
        const absentMethods = await absentOverWebSocket(port, methodNames);

        return {
            routes: { probed: routeNames.length, absent: absentRoutes, wrongMethod },
            rpc: { probed: methodNames.length, absent: absentMethods, httpAbsent },
        };
    } finally {
        server.kill();
    }
}

const binaries = process.argv.slice(2);

if (binaries.length === 0) {
    console.error("usage: bun scripts/surface-history/probe.ts <surreal binary>...");
    process.exit(1);
}

const stored = (await Bun.file(OUT).exists())
    ? ((await Bun.file(OUT).json()) as { versions: Record<string, unknown> })
    : { versions: {} };

for (const binary of binaries) {
    const version = versionOf(binary);
    const index = indexFor(version);
    const result = await probe(binary, index);

    stored.versions[version] = result;
    console.log(
        `[surface] ${version}: ${result.routes.absent.length} of ${result.routes.probed} routes absent, ` +
            `${result.routes.wrongMethod.length} wrong method, ${result.rpc.absent.length} of ${result.rpc.probed} RPC methods absent (${result.rpc.httpAbsent.length} over HTTP)`,
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
            note: "Each HTTP route and RPC method that the engine source declares for a release, called on that release's binary. An absent route answered 404 with no body, a wrong-method route answered 405, an absent RPC method answered 'Method not found' over a WebSocket, and one in httpAbsent did over HTTP, which a WebSocket-only method does.",
            versions: sorted,
        },
        null,
        1,
    )}\n`,
);
