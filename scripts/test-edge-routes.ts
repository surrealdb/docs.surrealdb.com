/**
 * Self-check for the compiled redirect table the Cloudflare Worker matches
 * against (`src/lib/edge-routes.ts`).
 *
 * The table is generated from `vercel.ts`, so this is not testing the redirect
 * list itself - it is testing that the compile-and-match round trip preserves
 * the shapes `redirects.ts` actually uses: a literal path, a `/:path*` tail, a
 * parameter mid-path, and the `/docs` prefix handling. Those are the parts a
 * hand-rolled matcher gets wrong.
 *
 * Run by `bun scripts/test-edge-routes.ts`, and in CI.
 */
import assert from "node:assert/strict";
import { matchRedirect } from "../src/lib/edge-routes";

let checked = 0;

function expectRedirect(from: string, to: string, status?: number) {
    const result = matchRedirect(from);
    assert.ok(result, `expected ${from} to redirect, got no match`);
    assert.equal(result.location, to, `${from} -> ${result.location}, expected ${to}`);
    if (status !== undefined) {
        assert.equal(
            result.status,
            status,
            `${from} returned ${result.status}, expected ${status}`,
        );
    }
    checked++;
}

function expectNoRedirect(path: string) {
    const result = matchRedirect(path);
    assert.equal(result, null, `expected ${path} not to redirect, got ${result?.location}`);
    checked++;
}

// `trailingSlash: false` and `cleanUrls: true`, applied before the table.
expectRedirect("/docs/running/", "/docs/running", 308);
expectRedirect("/docs/index", "/docs", 308);

// A path matching both normalisation rules resolves in one hop, which is what
// Vercel does - it converts clean URLs before trailing slashes. Emitting them
// the other way round sent `/docs/index/` to `/docs/index` and only then on.
expectRedirect("/docs/index/", "/docs", 308);

// A literal rule (the O(1) map), reached with the `/docs` prefix still on.
expectRedirect("/self-hosted", "/docs/running", 301);

// A `/:path*` tail, carrying the matched remainder through.
expectRedirect("/self-hosted/installation", "/docs/running/installation", 301);

// A parameter mid-path. `resolveRedirect` in redirects.ts cannot match these -
// it only understands an exact path or a trailing `/:path*` - so this is the
// case that regresses if the Worker ever goes back to using it.
expectRedirect("/sdk/rust", "/docs/languages/rust");
expectRedirect("/sdk/rust/setup", "/docs/languages/rust/setup");

// A live page, and a path matching nothing, both pass through to the renderer.
expectNoRedirect("/docs/running/overview");
expectNoRedirect("/docs/not-a-real-page-xyz");

console.log(`[edge-routes] ${checked} checks passed`);
