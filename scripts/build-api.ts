/**
 * Bundles search/api.ts into the Vercel Build Output API directory.
 * Runs after `vike build` so it can add the function alongside the
 * adapter-generated output in .vercel/output/.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "esbuild";

const OUTPUT_DIR = resolve(".vercel/output");
const CONFIG_PATH = resolve(OUTPUT_DIR, "config.json");
const FUNC_DIR = resolve(OUTPUT_DIR, "functions/api/search.func");

mkdirSync(FUNC_DIR, { recursive: true });

await build({
    entryPoints: ["search/api.ts"],
    bundle: true,
    platform: "node",
    target: "node22",
    format: "esm",
    outfile: resolve(FUNC_DIR, "index.mjs"),
    banner: {
        js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
    minify: true,
    sourcemap: true,
});

writeFileSync(
    resolve(FUNC_DIR, ".vc-config.json"),
    JSON.stringify(
        {
            runtime: "nodejs22.x",
            handler: "index.mjs",
            launcherType: "Nodejs",
        },
        null,
        2,
    ),
);

// Ensure .vercel/output/config.json exists.
// On Vercel the adapter generates it; locally it may be absent.
if (existsSync(CONFIG_PATH)) {
    const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    const routes: unknown[] = config.routes ?? [];

    const hasFilesystem = routes.some(
        (r) => typeof r === "object" && r !== null && "handle" in r && r.handle === "filesystem",
    );

    if (!hasFilesystem) {
        // Insert a filesystem phase so Vercel checks functions/ before the SSR catch-all
        const missIdx = routes.findIndex(
            (r) => typeof r === "object" && r !== null && "handle" in r && r.handle === "miss",
        );

        routes.splice(missIdx === -1 ? routes.length : missIdx, 0, { handle: "filesystem" });
        config.routes = routes;
        writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log("[build-api] Patched config.json with filesystem handler");
    }
} else {
    writeFileSync(
        CONFIG_PATH,
        JSON.stringify({ version: 3, routes: [{ handle: "filesystem" }] }, null, 2),
    );
    console.log("[build-api] Created config.json");
}

console.log("[build-api] Bundled search function →", FUNC_DIR);
