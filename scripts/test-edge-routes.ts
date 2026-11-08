/**
 * Self-check for the route table the Cloudflare Worker matches against
 * (`src/lib/edge-routes.ts`), compiled from `vercel.ts`.
 *
 * It tests the compile-and-match round trip rather than the rules themselves:
 * the shapes `redirects.ts` uses, the normalisation order, and the `/docs`
 * prefix rewrite. Expected values were checked against the Vercel deployment.
 *
 * Run with `bun run test:routes`, and in CI.
 */
import assert from "node:assert/strict";
import { matchRedirect, serveEdge } from "../src/lib/edge-routes";

let checked = 0;

function expectRedirect(from: string, to: string, status: number) {
    const result = matchRedirect(from);
    assert.deepEqual(result, { location: to, status }, `${from} -> ${JSON.stringify(result)}`);
    checked++;
}

// `cleanUrls` and `trailingSlash: false`, ahead of the table; a path matching
// both takes one hop, as on Vercel.
expectRedirect("/running/", "/running", 308);
expectRedirect("/index", "/", 308);
expectRedirect("/index/", "/", 308);

// A literal rule, a `/:path*` tail, and a parameter mid-path.
expectRedirect("/self-hosted", "/docs/running", 301);
expectRedirect("/self-hosted/installation", "/docs/running/installation", 301);
expectRedirect("/sdk/rust/setup", "/docs/languages/rust/setup", 301);
expectRedirect("/docs/sdk/rust/setup", "/docs/languages/rust/setup", 301);

// A live page passes through.
assert.equal(matchRedirect("/reference/query-language/statements/select"), null);
checked++;

// The pipeline: redirects carry the query string, a `/docs`-prefixed path that
// is no redirect is sent to the unprefixed one, static files win over the app,
// the header table applies with the later rule winning, and every response off
// the canonical host is marked noindex.
const app = async () => new Response("app", { headers: { "cache-control": "no-store" } });
const assets = {
    fetch: async (request: Request) =>
        new URL(request.url).pathname === "/assets/a.js"
            ? new Response("js", { headers: { "cache-control": "public, max-age=0" } })
            : new Response(null, { status: 404 }),
};

let res = await serveEdge(new Request("https://surrealdb.com/self-hosted?x=1"), assets, app);
assert.equal(res.headers.get("location"), "/docs/running?x=1");
assert.equal(res.headers.get("x-robots-tag"), null);

res = await serveEdge(new Request("https://surrealdb.com/docs/llms.txt"), assets, app);
assert.equal(res.status, 302);
assert.equal(res.headers.get("location"), "/llms.txt");

res = await serveEdge(new Request("https://surrealdb.com/assets/a.js"), assets, app);
assert.equal(await res.text(), "js");
assert.equal(res.headers.get("cache-control"), "public, max-age=31536000, immutable");
assert.ok(res.headers.get("content-security-policy"));

res = await serveEdge(new Request("https://x.workers.dev/running/overview"), assets, app);
assert.equal(await res.text(), "app");
assert.equal(res.headers.get("cache-control"), "no-store");
assert.equal(res.headers.get("x-robots-tag"), "noindex, nofollow");
checked += 4;

console.log(`[edge-routes] ${checked} checks passed`);
