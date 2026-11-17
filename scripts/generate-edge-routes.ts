/**
 * Compiles the routing rules in `vercel.ts` into the table the Cloudflare Worker
 * matches at request time (`src/lib/edge-routes.ts`).
 *
 * Vercel serves `cleanUrls`, `trailingSlash`, redirects, rewrites and headers
 * from its own edge, ahead of the function. A Worker has no such layer, so it
 * applies the same rules itself. `vercel.ts` stays the one place a rule is
 * written, and `@vercel/routing-utils` - the package Vercel uses to turn that
 * config into routes - does the compiling, so a path resolves the same way on
 * both platforms. It runs at build time only and reaches no network.
 *
 * Run by `prebuild` and `build:cloudflare`. Output is gitignored (`generated/`).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
    convertCleanUrls,
    convertHeaders,
    convertRedirects,
    convertRewrites,
    convertTrailingSlash,
} from "@vercel/routing-utils/dist/superstatic.js";
import { config } from "../vercel";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_FILE = join(root, "generated/edge-routes.json");

type Route = { src?: string; dest?: string; status?: number; headers?: Record<string, string> };

/** A redirect: the `Location` header becomes `dest`. */
function redirect(route: Route) {
    return { src: String(route.src), dest: route.headers?.Location ?? "", status: route.status };
}

const rewrites = (convertRewrites(config.rewrites ?? []) as Route[]).map((route) => {
    // Every rewrite here carries a `statusCode`, which Vercel answers as a
    // redirect to the destination. A plain rewrite would need the Worker to
    // re-dispatch internally, which it does not do, so one fails the build.
    if (!route.status) {
        throw new Error(`[edge-routes] rewrite ${route.src} has no statusCode; add support first`);
    }
    return { src: String(route.src), dest: String(route.dest), status: route.status };
});

const table = {
    // Clean URLs before the trailing slash, the order Vercel applies them in.
    normalise: (
        [
            ...convertCleanUrls(config.cleanUrls ?? false, config.trailingSlash),
            ...convertTrailingSlash(config.trailingSlash ?? false),
        ] as Route[]
    ).map(redirect),
    redirects: (convertRedirects(config.redirects ?? []) as Route[]).map(redirect),
    rewrites,
    headers: (convertHeaders(config.headers ?? []) as Route[]).map((route) => ({
        src: String(route.src),
        headers: route.headers ?? {},
    })),
};

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, `${JSON.stringify(table)}\n`);

console.log(
    `[edge-routes] ${table.redirects.length} redirects, ${table.rewrites.length} rewrites, ` +
        `${table.headers.length} header rules -> generated/edge-routes.json`,
);
