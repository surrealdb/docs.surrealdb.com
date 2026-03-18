import { mkdir, readdir, rename, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { Plugin } from "vite";

export function vercelBasePathPlugin(): Plugin {
    return {
        name: "vercel-base-path",
        apply: "build",
        closeBundle: {
            order: "post",
            async handler() {
                if (this.environment?.name !== "vercel_node") return;
                const staticDir = resolve(process.cwd(), ".vercel/output/static");
                const docsDir = join(staticDir, "docs");
                const tmpDir = resolve(process.cwd(), ".vercel/output/_static_mv");
                await rename(staticDir, tmpDir);
                await mkdir(docsDir, { recursive: true });
                for (const entry of await readdir(tmpDir)) {
                    await rename(join(tmpDir, entry), join(docsDir, entry));
                }
                await rm(tmpDir, { recursive: true, force: true });
            },
        },
        sharedDuringBuild: true,
    };
}
