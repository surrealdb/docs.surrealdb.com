/**
 * Regenerates `src/data/route-history.json` and `src/data/rpc-history.json`:
 * the HTTP routes and the RPC methods of every stable release since 3.0.
 *
 *   bun run generate:surface-history
 *
 * Reads the engine source with git only, through `scripts/lib/surrealdb-releases.ts`.
 *
 * - An HTTP route is a `.route("/path", get(..).post(..))` call under the
 *   server's `ntw` folder. Its key is a method and the path, such as
 *   `POST /ml/import`, with one item for each method of a route. A route added by a constant, as the gRPC one is, is
 *   resolved from the constant's declaration. A route can depend on a build
 *   feature or a capability, so being listed means the source declares it.
 * - An RPC method is a string in the `match` of `Method::parse`. An alias, such
 *   as `let` for `set`, is a method of its own.
 */
import { join } from "node:path";
import { git, ranges, releaseTags } from "../lib/surrealdb-releases";

const ROOT = join(import.meta.dir, "../..");
const FIRST_MAJOR = 3;
const METHOD = /(?<![\w:])(get|post|put|patch|delete|options|head|any)(?:_service)?\s*\(/g;

/** Removes every `#[cfg(test)] mod name { ... }`, whose routes only exist for a test. */
function withoutTests(text: string): string {
    let out = text;

    for (;;) {
        const match = /#\[cfg\(test\)\]\s*(?:pub(?:\([^)]*\))?\s+)?mod\s+\w+\s*\{/.exec(out);

        if (!match) return out;

        let depth = 0;
        let end = out.length;

        for (let index = match.index + match[0].length - 1; index < out.length; index++) {
            if (out[index] === "{") depth++;
            if (out[index] === "}" && --depth === 0) {
                end = index + 1;
                break;
            }
        }

        out = out.slice(0, match.index) + out.slice(end);
    }
}

/** Source text with the comment lines and the test modules taken out, so that neither is read as a route. */
function code(text: string): string {
    return withoutTests(text)
        .split("\n")
        .filter((line) => !/^\s*\/\//.test(line))
        .join("\n");
}

/** The text between the parentheses that open at `start`, which is the index of the `(`. */
function balanced(text: string, start: number): string {
    let depth = 0;

    for (let index = start; index < text.length; index++) {
        if (text[index] === "(") depth++;
        if (text[index] === ")" && --depth === 0) return text.slice(start + 1, index);
    }

    return text.slice(start + 1);
}

function routesIn(text: string): string[] {
    const source = code(text);
    const found: string[] = [];

    for (const match of source.matchAll(/\.route\s*\(/g)) {
        const body = balanced(source, (match.index ?? 0) + match[0].length - 1);
        const first = /^\s*(?:"([^"]+)"|([A-Z_][A-Z0-9_]*))\s*,/.exec(body);

        if (!first) continue;

        const path =
            first[1] ??
            new RegExp(`const\\s+${first[2]}\\s*:\\s*&(?:'static\\s+)?str\\s*=\\s*"([^"]+)"`).exec(
                source,
            )?.[1];

        if (!path) continue;

        const methods = [
            ...new Set(
                [...body.slice(first[0].length).matchAll(METHOD)].map((m) =>
                    (m[1] as string).toUpperCase(),
                ),
            ),
        ].sort();

        // One item for each method, so a route that gains or loses a method is not a new route.
        // `OPTIONS` is the preflight that axum answers for a CORS layer and is not listed.
        for (const method of methods.filter((candidate) => candidate !== "OPTIONS")) {
            found.push(`${method} ${path}`);
        }
    }

    return found;
}

function routes(tag: string): Set<string> {
    const files = git("grep", "-l", "\\.route(", tag, "--", "surrealdb/server/src")
        .split("\n")
        .filter(Boolean)
        .map((line) => line.slice(tag.length + 1));

    return new Set(files.flatMap((file) => routesIn(git("show", `${tag}:${file}`))));
}

/** The file that declares `enum Method` at a tag. */
function methodFile(tag: string): string {
    const found = git("grep", "-l", "pub enum Method", tag, "--", "*.rs")
        .split("\n")
        .filter(Boolean)
        .map((line) => line.slice(tag.length + 1))
        .filter((file) => file.endsWith("method.rs"));

    if (found.length !== 1)
        throw new Error(`${tag}: expected one RPC method.rs, found ${found.length}`);

    return found[0] as string;
}

function rpcMethods(tag: string): Set<string> {
    const text = git("show", `${tag}:${methodFile(tag)}`);
    const start = text.indexOf("fn parse");
    const block = text.slice(start, text.indexOf("_ => Self::Unknown", start));
    const found = new Set<string>();

    for (const arm of block.matchAll(/((?:"[a-z_]+"\s*\|?\s*)+)=>\s*Self::\w+/g)) {
        for (const name of (arm[1] as string).matchAll(/"([a-z_]+)"/g))
            found.add(name[1] as string);
    }

    return found;
}

const tags = releaseTags(FIRST_MAJOR);

function write(file: string, note: string, perTag: Set<string>[]) {
    const names = new Set(perTag.flatMap((set) => [...set]));
    const items = [...names]
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({ name, ranges: ranges(perTag.map((set) => set.has(name))) }));

    return Bun.write(join(ROOT, file), `${JSON.stringify({ note, tags, items }, null, 1)}\n`);
}

const perTagRoutes: Set<string>[] = [];
const perTagMethods: Set<string>[] = [];

for (const tag of tags) {
    perTagRoutes.push(routes(tag));
    perTagMethods.push(rpcMethods(tag));
    console.log(
        `[surface] ${tag}: ${perTagRoutes.at(-1)?.size} routes, ${perTagMethods.at(-1)?.size} RPC methods`,
    );
}

await write(
    "src/data/route-history.json",
    "Each item is the methods and path of a route that the server source declares at the release tags listed, as [first, last] tag indices.",
    perTagRoutes,
);
await write(
    "src/data/rpc-history.json",
    "Each item is a method name that Method::parse accepts at the release tags listed, as [first, last] tag indices. An alias is a name of its own.",
    perTagMethods,
);
