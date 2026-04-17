// Entry point for search indexing.
//
// On Vercel, this only runs on production deploys to avoid
// re-indexing on every preview branch. Locally it always runs.
//
// Usage: bun run search:index

import { runIndexer } from "../search/scripts/indexer";

// const isProduction = process.env.VERCEL_ENV === "production";
// const isVercel = !!process.env.VERCEL;

// if (isVercel && !isProduction) {
// 	console.log("[IX] Skipping search indexing (non-production Vercel build)");
// 	process.exit(0);
// }

runIndexer().catch((err) => {
	console.error("[FATAL]", err);
	process.exit(1);
});
