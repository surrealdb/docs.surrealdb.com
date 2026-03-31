import { build } from "esbuild";

await build({
    entryPoints: ["search/api.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: "api/search.mjs",
    banner: {
        js: "// Auto-generated — do not edit. Source: search/api.ts",
    },
});

console.log("[API] Bundled search/api.ts → api/search.mjs");
