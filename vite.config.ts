import { loadEnvFile } from "node:process";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { vikeContentCollectionPlugin } from "vike-content-collection";
import { vikeSitemap } from "vike-sitemap-generator";
import { defineConfig } from "vite";
import { vercel } from "vite-plugin-vercel/vite";
import { viteDevRedirects } from "./plugins/vite-dev-redirects";

loadEnvFile(".env.shared");

/**
 * Which platform this build targets. Vercel is the default and the deployed
 * one; `DEPLOY_TARGET=cloudflare` selects the Workers build instead
 * (`bun run build:cloudflare`). See AGENTS.md, "Deployment targets".
 */
const isCloudflare = process.env.DEPLOY_TARGET === "cloudflare";

export default defineConfig(async ({ mode }) => ({
    base: "/docs",
    // Read by src/pages/+server.ts, so the Vercel bundle drops the Worker-only
    // request layer at build time rather than branching per request.
    define: {
        "import.meta.env.DEPLOY_TARGET": JSON.stringify(isCloudflare ? "cloudflare" : "vercel"),
    },
    plugins: [
        viteDevRedirects(mode),
        vike(),
        react(),
        // Exactly one deploy adapter is active: both build from the `ssr`
        // environment, so together each would rewrite the other's output.
        ...(isCloudflare
            ? (await import("@cloudflare/vite-plugin")).cloudflare({
                  viteEnvironment: { name: "ssr" },
              })
            : [vercel()]),
        vikeContentCollectionPlugin({
            contentDir: "src/content",
            lastModified: true,
            drafts: {
                field: "draft",
                includeDrafts: false,
            },
        }),
        vikeSitemap({
            baseUrl: "https://surrealdb.com/docs",
            robots: true,
            priority: (url, { urls }) => {
                if (url === "/") return 1.0;

                const hasChildren = urls.some((u) => u !== url && u.startsWith(`${url}/`));

                if (/^\/surrealdb(\/|$)/.test(url)) return hasChildren ? 0.9 : 0.8;
                if (/^\/surrealql(\/|$)/.test(url)) return hasChildren ? 0.9 : 0.8;
                if (/^\/sdk\//.test(url)) return hasChildren ? 0.8 : 0.7;
                if (/^\/\d+\.x\/sdk\//.test(url)) return 0.4;

                return hasChildren ? 0.7 : 0.6;
            },
            changefreq: [
                { match: "/", changefreq: "weekly" },
                { match: /^\/surrealdb/, changefreq: "weekly" },
                { match: /^\/surrealql/, changefreq: "weekly" },
                { match: /^\/sdk\//, changefreq: "weekly" },
                { match: /^\/cloud/, changefreq: "weekly" },
                { match: /^\/\d+\.x\//, changefreq: "weekly" },
            ],
            exclude: [/^\/404$/, /^\/500$/],
            trailingSlash: false,
        }),
    ],
    resolve: {
        dedupe: ["react", "react-dom", "@mantine/core", "@mantine/hooks", "@mantine/spotlight"],
        tsconfigPaths: true,
    },
    build: {
        sourcemap: true,
        minify: true,
        cssMinify: true,
    },
    ssr: {
        noExternal: ["@surrealdb/ui", "@mantine/core", "@mantine/hooks", "@mantine/spotlight"],
        // A Worker has no `node_modules` at runtime, so everything is bundled
        // there and the Cloudflare plugin rejects `external` outright.
        ...(isCloudflare ? {} : { external: ["vike-content-collection"] }),
    },
    environments: {
        vercel_node: {
            resolve: {
                noExternal: [
                    "@surrealdb/ui",
                    "@mantine/core",
                    "@mantine/hooks",
                    "@mantine/spotlight",
                ],
            },
        },
    },
    css: {
        modules: {
            localsConvention: "dashesOnly" as const,
        },
        preprocessorOptions: {
            scss: {
                additionalData: "@use '@surrealdb/ui/mixins' as *;",
            },
        },
    },
    server: {
        port: 4321,
        host: true,
    },
}));
