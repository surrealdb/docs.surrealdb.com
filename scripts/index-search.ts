import { runIndexer } from "../search/indexer";

const isProduction = process.env.VERCEL_ENV === "production";
const isVercel = !!process.env.VERCEL;

if (isVercel && !isProduction) {
    console.log("[IX] Skipping search indexing (non-production Vercel build)");
    process.exit(0);
}

runIndexer().catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
});
