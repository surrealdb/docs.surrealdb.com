import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { Plugin } from "vite";

// Workaround: @brillout/vite-plugin-server-entry writes an auto-importer
// file during the SSR build with a relative import to dist/server/entry.mjs.
// Photon's esbuild post-build step then fails resolving that path.
// vike-photon sets disableAutoImport but a Vite 7 bug prevents it from
// taking effect. We reset the file after the SSR build writes it.
export function fixServerEntryAutoImport(): Plugin {
    const require = createRequire(import.meta.url);
    let autoImporterPath: string | null = null;
    try {
        const runtimeIndex = require.resolve("@brillout/vite-plugin-server-entry/runtime");
        autoImporterPath = join(dirname(runtimeIndex), "autoImporter.js");
    } catch {}

    return {
        name: "fix-server-entry-auto-import",
        apply: "build",
        generateBundle: {
            order: "post",
            handler() {
                if (!autoImporterPath) return;
                if (this.environment?.name !== "ssr") return;
                writeFileSync(autoImporterPath, "export const status = 'UNSET';\n");
            },
        },
    };
}
