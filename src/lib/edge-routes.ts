/**
 * The Cloudflare Worker's stand-in for Vercel's edge: applies the routing rules
 * from `vercel.ts`, compiled by `scripts/generate-edge-routes.ts`, in front of
 * the app. Only the Workers build calls this; Vercel serves the same rules from
 * its own edge and never loads it.
 *
 * Order, as on Vercel: `cleanUrls` / `trailingSlash`, then redirects (first
 * match wins), then static files, then rewrites, then the app. The `headers`
 * table is applied to whatever comes back.
 */
import table from "../../generated/edge-routes.json";

type Rule = { re: RegExp; dest: string; status?: number };
type HeaderRule = { re: RegExp; headers: Record<string, string> };

export type Assets = { fetch: (request: Request) => Promise<Response> };

/** The host the documentation is canonically served on, behind the apex Worker. */
const CANONICAL_HOST = "surrealdb.com";

// Compiled once per isolate. ponytail: a linear scan of ~1000 regexes per
// request (well under a millisecond); split literal paths into a map if that
// ever shows up in CPU time.
const compile = (rules: { src: string; dest: string; status?: number }[]): Rule[] =>
    rules.map((rule) => ({ re: new RegExp(rule.src), dest: rule.dest, status: rule.status }));
const normalise = compile(table.normalise);
const redirects = compile(table.redirects);
const rewrites = compile(table.rewrites);
const headerRules: HeaderRule[] = table.headers.map((rule) => ({
    re: new RegExp(rule.src),
    headers: rule.headers as Record<string, string>,
}));

export type EdgeRedirect = { location: string; status: number };

/** The first rule matching `pathname`, with `$1`-style references filled in. */
function first(rules: Rule[], pathname: string): EdgeRedirect | null {
    for (const rule of rules) {
        const match = rule.re.exec(pathname);
        if (match) {
            const location = rule.dest.replace(/\$(\d+)/g, (_, i) => match[Number(i)] ?? "");
            return { location, status: rule.status ?? 308 };
        }
    }
    return null;
}

/** The redirect `pathname` resolves to before the filesystem is consulted. */
export function matchRedirect(pathname: string): EdgeRedirect | null {
    return first(normalise, pathname) ?? first(redirects, pathname);
}

/** A redirect response. The query string is carried across, as Vercel does. */
function redirectResponse({ location, status }: EdgeRedirect, url: URL): Response {
    return new Response(null, {
        status,
        headers: { location: location.includes("?") ? location : `${location}${url.search}` },
    });
}

/**
 * Applies the `headers` table. Every matching rule contributes and, for the same
 * header, a later rule beats an earlier one, as on Vercel. A header the app set
 * itself is kept (Vercel lets a function's header win), but a static file's are
 * replaced: the assets layer stamps its own `Cache-Control` on everything, where
 * Vercel's static layer sets none for the table to fill in.
 */
function withHeaders(response: Response, url: URL, fromAssets: boolean): Response {
    const extra: Record<string, string> = {};
    for (const rule of headerRules) {
        if (rule.re.test(url.pathname)) Object.assign(extra, rule.headers);
    }
    // A copy of the site at any other address - a preview or the `workers.dev`
    // URL - must not compete with the real one in search results.
    if (url.hostname !== CANONICAL_HOST) extra["X-Robots-Tag"] = "noindex, nofollow";

    const out = new Response(response.body, response);
    for (const [key, value] of Object.entries(extra)) {
        if (fromAssets || key === "X-Robots-Tag" || !out.headers.has(key)) {
            out.headers.set(key, value);
        }
    }
    return out;
}

export async function serveEdge(
    request: Request,
    assets: Assets | undefined,
    app: (request: Request) => Promise<Response>,
): Promise<Response> {
    const url = new URL(request.url);

    const redirect = matchRedirect(url.pathname);
    if (redirect) return withHeaders(redirectResponse(redirect, url), url, false);

    if (assets && (request.method === "GET" || request.method === "HEAD")) {
        const asset = await assets.fetch(request);
        if (asset.status !== 404) return withHeaders(asset, url, true);
    }

    const rewrite = first(rewrites, url.pathname);
    if (rewrite) return withHeaders(redirectResponse(rewrite, url), url, false);

    return withHeaders(await app(request), url, false);
}
