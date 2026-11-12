// Entry point for search indexing.
//
// The "Index site search" job in `.github/workflows/reindex-docs.yml` runs this
// on every push to main, with `SEARCH_INDEX=true`. That is where the index is
// kept current; the Cloudflare build does not run `postbuild`.
//
// It also runs as `postbuild`, so it skips the builds that must not index: a
// Vercel preview, and the CI build job, which has no database. On a Vercel
// production build it still runs while that project builds. Locally it always
// runs.
//
// Usage: bun run search:index

import { runIndexer } from "../search/scripts/indexer";

const isProduction = process.env.VERCEL_ENV === "production";
const isVercel = !!process.env.VERCEL;
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isIndexJob = process.env.SEARCH_INDEX === "true";

if (isVercel && !isProduction) {
    console.log("[IX] Skipping search indexing (non-production Vercel build)");
    process.exit(0);
}

if (isGitHubActions && !isIndexJob) {
    console.log("[IX] Skipping search indexing (GitHub Actions build)");
    process.exit(0);
}

runIndexer().catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
});
