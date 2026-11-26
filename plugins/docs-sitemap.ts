import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { vikeSitemap } from "vike-sitemap-generator";
import type { Plugin, ResolvedConfig } from "vite";

type SitemapOptions = Parameters<typeof vikeSitemap>[0];

/** Where `vike-sitemap-generator` writes the sitemap for a server build. */
function clientOutDir(config: ResolvedConfig, outDir?: string): string {
    if (outDir) return resolve(config.root, outDir);

    const serverOutDir = config.build.outDir;

    return serverOutDir.endsWith("/server")
        ? `${serverOutDir.slice(0, -"/server".length)}/client`
        : serverOutDir.replace(/\/server\/$/, "/client/");
}

/**
 * `vike-sitemap-generator`, with the docs root listed at the URL it is served
 * on.
 *
 * The generator writes every location as `baseUrl` plus the route, so the root
 * route `/` comes out as `https://surrealdb.com/docs/`, a URL that redirects to
 * `https://surrealdb.com/docs`. A sitemap should list only URLs that answer
 * 200, so once the generator has written the file, that one location is
 * rewritten to the canonical URL.
 */
export function docsSitemap(options: SitemapOptions): Plugin {
    // The generator's hooks are plain functions, so they are called directly.
    const plugin = vikeSitemap(options) as Omit<Plugin, "configResolved" | "closeBundle"> & {
        configResolved: (config: ResolvedConfig) => Promise<void>;
        closeBundle: () => Promise<void>;
    };
    const baseUrl = options.baseUrl.replace(/\/+$/, "");
    let config: ResolvedConfig;

    return {
        ...plugin,
        async configResolved(resolved) {
            config = resolved;
            await plugin.configResolved(resolved);
        },
        async closeBundle() {
            await plugin.closeBundle();

            if (!config.build.ssr) return;

            const file = resolve(
                clientOutDir(config, options.outDir),
                options.outFile ?? "sitemap.xml",
            );

            if (!existsSync(file)) return;

            const xml = readFileSync(file, "utf8");
            const fixed = xml.replace(`<loc>${baseUrl}/</loc>`, `<loc>${baseUrl}</loc>`);

            if (fixed !== xml) writeFileSync(file, fixed);
        },
    };
}
