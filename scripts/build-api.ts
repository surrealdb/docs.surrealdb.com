import { mkdir, writeFile } from "node:fs/promises";
import { build } from "esbuild";

const FUNC_DIR = ".vercel/output/functions/api/search.func";

await mkdir(FUNC_DIR, { recursive: true });

await build({
    entryPoints: ["search/api.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    format: "esm",
    outfile: `${FUNC_DIR}/index.mjs`,
});

await writeFile(
    `${FUNC_DIR}/.vc-config.json`,
    JSON.stringify(
        {
            runtime: "nodejs20.x",
            handler: "index.mjs",
            launcherType: "Nodejs",
        },
        null,
        4,
    ),
);

console.log("[API] Bundled search/api.ts → .vercel/output/functions/api/search.func/");
