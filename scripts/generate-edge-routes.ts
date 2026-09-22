/**
 * Compiles the routing half of `vercel.ts` into the table the Cloudflare
 * Worker matches at request time.
 *
 * Vercel reads `vercel.ts` at deploy time and serves redirects and headers from
 * its own edge, ahead of the function. Cloudflare has no such layer - the
 * Worker is the edge - so the same rules have to run in code. Rather than
 * restate ~1000 rules in a second dialect, this reuses `@vercel/routing-utils`,
 * the package Vercel itself uses to turn a config into routes, so `redirects.ts`
 * stays the one place a redirect is written.
 *
 * This is also stricter than `resolveRedirect` in `redirects.ts`, which is a
 * hand-rolled matcher for the dev server and only understands an exact path or
 * a trailing `/:path*`. Rules with a parameter mid-path - `/docs/sdk/:sdk` and
 * its relatives - match here and do not there.
 *
 * Output is gitignored (`generated/`, `public/_headers`).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { RouteWithSrc } from "@vercel/routing-utils";
import {
    convertCleanUrls,
    convertHeaders,
    convertRedirects,
    convertTrailingSlash,
} from "@vercel/routing-utils/dist/superstatic.js";
import { docsRedirects } from "../redirects";
import { cleanUrls, headers as headerRules, trailingSlash } from "../routes";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_FILE = join(root, "generated/edge-routes.json");
const HEADERS_FILE = join(root, "public/_headers");

type CompiledRule = {
    src: string;
    dest?: string;
    status?: number;
    /** Position in `vercel.ts`. Splitting the table by shape would otherwise
     * lose the declaration order Vercel resolves ties by. */
    order?: number;
    headers?: Record<string, string>;
};

/**
 * Narrows the converters' return type. `Route` is a union with the
 * `handle: "filesystem"` phase markers Vercel's own pipeline inserts; the
 * `convert*` helpers only ever emit the `src` variant.
 */
function withSrc(routes: { src?: string }[]): RouteWithSrc[] {
    return routes.filter((route): route is RouteWithSrc => typeof route.src === "string");
}

/** A literal source with a literal destination becomes an O(1) lookup. */
const LITERAL_SRC = /^\^((?:\\\/|[A-Za-z0-9._~@-])+)\$$/;

function unescapeLiteral(src: string): string | null {
    const match = LITERAL_SRC.exec(src);
    return match ? match[1].replace(/\\\//g, "/") : null;
}

function compile() {
    const exactRedirects: Record<string, { dest: string; status: number; order: number }> = {};
    const redirects: CompiledRule[] = [];

    // Literal rules go to an O(1) map and the rest to a regex list, but both
    // carry their position so the matcher can still resolve a path the way
    // Vercel would: by whichever rule was written first.
    const all = withSrc(convertRedirects(docsRedirects));
    for (let order = 0; order < all.length; order++) {
        const route = all[order];
        const dest = route.headers?.Location;
        if (!dest) continue;
        const status = route.status ?? 308;
        const literal = dest.includes("$") ? null : unescapeLiteral(route.src);
        if (literal) {
            if (!(literal in exactRedirects)) exactRedirects[literal] = { dest, status, order };
        } else {
            redirects.push({ src: route.src, dest, status, order });
        }
    }

    return {
        exactRedirects,
        redirects,
        // `cleanUrls` / `trailingSlash`, which Vercel applies ahead of the
        // user's own rules. Prefix-agnostic, so these match the request path
        // as it arrives, `/docs` and all.
        // Clean URLs first, then the trailing slash - the order
        // `getTransformedRoutes` uses. Reversed, a path matching both takes two
        // hops where Vercel takes one.
        normalise: withSrc([
            ...convertCleanUrls(cleanUrls, trailingSlash),
            ...convertTrailingSlash(trailingSlash),
        ]).map((route) => ({
            src: route.src,
            dest: route.headers?.Location ?? "",
            status: route.status ?? 308,
        })),
        headers: withSrc(convertHeaders(headerRules)).map((route) => ({
            src: route.src,
            headers: route.headers,
        })),
    };
}

/**
 * The header table as a Cloudflare `_headers` file.
 *
 * Static files are served by the Workers Assets layer, ahead of the Worker, so
 * the Worker's own header pass never sees them - and `/assets/*`, the only
 * source here, is entirely static. Generated rather than hand-written so the
 * CSP has one home.
 *
 * `_headers` takes a path with `*` wildcards, not a pattern language. A source
 * needing more would be silently mistranslated, so one is rejected instead.
 */
function toAssetsPath(source: string): string {
    const path = source.replace(/\(\.\*\)/g, "*").replace(/:[A-Za-z_][A-Za-z0-9_]*\*/g, "*");
    if (/[()[\]{}?+^$|\\]|:[A-Za-z_]/.test(path)) {
        throw new Error(
            `[edge-routes] header source ${source} has no \`_headers\` equivalent. ` +
                "Express it as a path with `*` wildcards, or serve it from the Worker instead.",
        );
    }
    return path;
}

/**
 * The longest a single header line may be in a Cloudflare `_headers` file.
 * Wrangler warns and drops the line past this, which for a CSP is a security
 * header quietly going missing.
 */
const MAX_HEADERS_LINE = 2000;

function renderHeadersFile(): string {
    const lines = [
        "# Generated by scripts/generate-edge-routes.ts from the `headers` table in",
        "# vercel.ts. Do not edit - edit vercel.ts. Applies to responses from the",
        "# Cloudflare Workers Assets layer; the Worker applies the same table to the",
        "# responses it produces itself (src/lib/edge-routes.ts).",
        "#",
        "# Rules are emitted in reverse of their order in vercel.ts, and a rule",
        "# unsets a header an earlier rule already set. Vercel resolves a clash",
        "# between two matching rules in favour of the first - which is why the",
        "# catch-all `Cache-Control` can call itself a fallback - whereas this file",
        "# concatenates the values of every match into one header. Without the",
        "# reversal and the `!` lines, a hashed asset answers with both",
        "# `max-age=31536000, immutable` and the 300-second fallback in a single",
        "# Cache-Control.",
        "",
    ];

    // Reversed, so the least specific rule is written first and the specific
    // ones that follow can override it.
    const rules = [...headerRules].reverse();
    const seen = new Set<string>();
    const omitted: string[] = [];

    for (const rule of rules) {
        // Written against the path this deployment sees, which has `/docs`
        // stripped by the apex project - on Vercel by its rewrite, on
        // Cloudflare by the apex Worker's proxy. Same path either way.
        lines.push(toAssetsPath(rule.source));
        for (const { key, value } of rule.headers) {
            // `_headers` is line-based, so a value carrying a newline would
            // inject an unrelated rule. None do today; fail loudly if one does.
            if (/[\r\n]/.test(value)) {
                throw new Error(`[edge-routes] header ${key} for ${rule.source} spans lines`);
            }
            // Over-long values are dropped by the assets layer with only a
            // build-time warning, so they are left out here and recorded
            // instead. Both sites hit this with their Content-Security-Policy.
            // Losing it on a stylesheet or a bundle costs nothing - a browser
            // enforces CSP on documents, not on subresources - and the Worker
            // applies the full table, this value included, to the HTML it
            // renders, where the policy is the one that matters.
            if (`  ${key}: ${value}`.length > MAX_HEADERS_LINE) {
                omitted.push(`${rule.source} -> ${key} (${value.length} chars)`);
                lines.push(
                    `  # omitted: ${key} exceeds the ${MAX_HEADERS_LINE}-character line limit`,
                );
                continue;
            }
            if (seen.has(key)) lines.push(`  ! ${key}`);
            lines.push(`  ${key}: ${value}`);
        }
        for (const { key } of rule.headers) seen.add(key);
        lines.push("");
    }

    if (omitted.length > 0) {
        console.warn(
            `[edge-routes] ${omitted.length} header value(s) too long for _headers, ` +
                `served by the Worker only: ${omitted.join(", ")}`,
        );
    }

    return lines.join("\n");
}

const compiled = compile();

mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(OUTPUT_FILE, `${JSON.stringify(compiled)}\n`);

// `_headers` lands in `public/`, which every build copies verbatim, so it is
// only written when one is wanted - a Vercel deploy would otherwise serve it as
// a stray static file. The JSON above is always written: it is gitignored,
// unread by the Vercel bundle, and `src/lib/edge-routes.ts` imports it, so
// `tsc` needs it on disk either way.
if (process.env.DEPLOY_TARGET === "cloudflare") {
    writeFileSync(HEADERS_FILE, renderHeadersFile());
}

console.log(
    `[edge-routes] ${Object.keys(compiled.exactRedirects).length} exact redirects, ` +
        `${compiled.redirects.length} pattern redirects, ${compiled.headers.length} header rules ` +
        "-> generated/edge-routes.json",
);
