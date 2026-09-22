/**
 * Runtime half of the Vercel-config port: matches a request against the table
 * `scripts/generate-edge-routes.ts` compiles out of `vercel.ts`.
 *
 * On Vercel these rules are served by the platform's edge, before the function
 * runs. Cloudflare has no equivalent layer, so the Worker applies them itself,
 * in Vercel's order: `trailingSlash` / `cleanUrls` normalisation, then
 * redirects. The patterns are Vercel's own compiled output, so a path resolves
 * the same way on both platforms.
 *
 * Header rules are not applied here. The only one in `vercel.ts` covers
 * `/assets/*`, which the Workers Assets layer serves ahead of the Worker from
 * the generated `_headers` file.
 *
 * Nothing in this module is imported by the Vercel build.
 */
import table from "../../generated/edge-routes.json";

const BASE = "/docs";

type CompiledRule = {
    src: string;
    dest?: string;
    status?: number;
    /** Position in `vercel.ts`, used to resolve ties the way Vercel does. */
    order?: number;
    headers?: Record<string, string>;
};

type CompiledRoutes = {
    exactRedirects: Record<string, { dest: string; status: number; order: number }>;
    redirects: CompiledRule[];
    normalise: CompiledRule[];
    headers: CompiledRule[];
};

/**
 * The table is generated, so `resolveJsonModule` would otherwise infer a literal
 * type that changes shape with the redirect list itself. Declaring the contract
 * once keeps this code checked against the schema rather than against today's
 * data. `scripts/generate-edge-routes.ts` writes exactly this shape.
 */
const routes = table as unknown as CompiledRoutes;

/**
 * Compiled regexes, built once per isolate and then free. The 315 literal
 * redirects never become regexes at all - they are an object lookup.
 */
let cache: { normalise: RegExp[]; redirects: RegExp[] } | null = null;

function compiled() {
    if (!cache) {
        cache = {
            normalise: routes.normalise.map((rule) => new RegExp(rule.src)),
            redirects: routes.redirects.map((rule) => new RegExp(rule.src)),
        };
    }
    return cache;
}

/** Substitutes `$1`-style capture references in a destination. */
function expand(dest: string, match: RegExpExecArray): string {
    return dest.replace(/\$(\d+)/g, (_, index) => match[Number(index)] ?? "");
}

/**
 * Removes the `/docs` prefix, the way the Vercel rewrite does before the
 * function sees a request.
 *
 * Redirect sources in `redirects.ts` are mostly written without the prefix,
 * because production strips it; a good number of the older helpers register a
 * `/docs/...` variant as well. On Cloudflare the Worker owns `surrealdb.com/docs*`
 * and the prefix is still attached, so both forms are tried - the same thing
 * `plugins/vite-dev-redirects.ts` does for the dev server.
 */
function stripBase(pathname: string): string {
    if (pathname === BASE) return "/";
    return pathname.startsWith(`${BASE}/`) ? pathname.slice(BASE.length) : pathname;
}

export type EdgeRedirect = { location: string; status: number };

/** Prefixes `/docs` on an app-internal destination, as Vite's `base` requires. */
function withBase(destination: string): string {
    if (destination.startsWith("http://") || destination.startsWith("https://")) {
        return destination;
    }
    if (destination === BASE || destination.startsWith(`${BASE}/`)) return destination;
    return `${BASE}${destination.startsWith("/") ? destination : `/${destination}`}`;
}

type OrderedRedirect = EdgeRedirect & { order: number };

/**
 * The first pattern rule matching this path, or null.
 *
 * `limit` stops the scan once an exact rule already found an earlier answer:
 * the list is in declaration order, so nothing past that point can win.
 */
function matchPatterns(pathname: string, limit: number): OrderedRedirect | null {
    const { redirects } = compiled();
    for (let i = 0; i < routes.redirects.length; i++) {
        const rule = routes.redirects[i];
        const order = rule.order ?? i;
        if (order >= limit) break;
        const match = redirects[i].exec(pathname);
        if (match && rule.dest) {
            return { location: expand(rule.dest, match), status: rule.status ?? 308, order };
        }
    }
    return null;
}

/**
 * The redirect, if any, this pathname resolves to.
 *
 * Normalisation runs against the path as it arrived - stripping a trailing
 * slash or an `/index` suffix does not care about the prefix, and
 * `/docs/index` correctly normalises to `/docs`. The rules from `redirects.ts`
 * then run against the stripped path first and the raw one second.
 */
export function matchRedirect(pathname: string): EdgeRedirect | null {
    const { normalise } = compiled();

    for (let i = 0; i < routes.normalise.length; i++) {
        const rule = routes.normalise[i];
        const match = normalise[i].exec(pathname);
        if (match && rule.dest) {
            return { location: expand(rule.dest, match), status: rule.status ?? 308 };
        }
    }

    for (const candidate of [stripBase(pathname), pathname]) {
        const exact = routes.exactRedirects[candidate];
        const pattern = matchPatterns(candidate, exact ? exact.order : Number.POSITIVE_INFINITY);
        // Whichever was written first in `vercel.ts` wins, as on Vercel.
        const winner =
            pattern && (!exact || pattern.order < exact.order)
                ? { location: pattern.location, status: pattern.status }
                : exact
                  ? { location: exact.dest, status: exact.status }
                  : null;
        if (winner) return { location: withBase(winner.location), status: winner.status };
    }

    return null;
}

/** Builds the redirect response, carrying the query string across as Vercel does. */
export function redirectResponse(redirect: EdgeRedirect, url: URL): Response {
    const location = redirect.location.includes("?")
        ? redirect.location
        : `${redirect.location}${url.search}`;
    return new Response(null, {
        status: redirect.status,
        headers: { location, "cache-control": "public, max-age=0, must-revalidate" },
    });
}
