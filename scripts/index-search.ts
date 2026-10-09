// Entry point for search indexing.
//
// On Vercel, this only runs on production deploys to avoid
// re-indexing on every preview branch. In GitHub Actions it never runs: the CI
// build job has no database to index into, and re-indexing is handled by the
// "Re-index docs search" workflow. Locally it always runs.
//
// Usage: bun run search:index

import { runIndexer } from "../search/scripts/indexer";

const isProduction = process.env.VERCEL_ENV === "production";
const isVercel = !!process.env.VERCEL;
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

if (isVercel && !isProduction) {
    console.log("[IX] Skipping search indexing (non-production Vercel build)");
    process.exit(0);
}

if (isGitHubActions) {
    console.log("[IX] Skipping search indexing (GitHub Actions build)");
    process.exit(0);
}

runIndexer().catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
});
