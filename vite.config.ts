import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { getCollectionEntry, vikeContentCollectionPlugin } from "vike-content-collection";
import { getLastModFromGit, vikeSitemap } from "vike-sitemap-generator";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";
import { docs, sdks } from "./src/content/config";

function findCollectionEntry(url: string) {
    const segments = url.split("/").filter(Boolean);
    const first = segments[0];

    if (first === "sdk" && segments.length >= 2) {
        const sdkName = segments[1];
        if (!(sdks as readonly string[]).includes(sdkName)) return undefined;
        const slug = segments.slice(2).join("/") || "index";
        return getCollectionEntry(`doc-sdk-${sdkName}`, slug);
    }

    if (first && (docs as readonly string[]).includes(first)) {
        const slug = segments.slice(1).join("/") || "index";
        return getCollectionEntry(`doc-${first}`, slug);
    }

    return undefined;
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        base: "/docs/",
        plugins: [
            vike(),
            react(),
            nodePolyfills({
                include: ["buffer"],
            }),
            tsconfigPaths(),
            vikeContentCollectionPlugin({
                contentDir: "src/content",
                lastModified: true,
                drafts: {
                    field: "draft",
                    includeDrafts: false,
                },
            }),
            vikeSitemap({
                baseUrl: "https://surrealdb.com/docs/",
                priority: [
                    { match: "/", priority: 1 },
                    { match: /^surrealdb\/.*$/, priority: 0.9 },
                    { match: /^sdk\/.*$/, priority: 0.8 },
                    { match: /^labs$/, priority: 0.5 },
                    { match: /.*/, priority: 0.75 },
                ],
                exclude: ["/404", "/500"],
                trailingSlash: (url) => {
                    return url === "/";
                },
                outFile: "../client/sitemap.xml",
                lastmod: async (url) => {
                    const entry = findCollectionEntry(url);

                    if (entry?.lastModified) {
                        return entry.lastModified.toISOString();
                    }

                    const filePath =
                        url === "/" ? "pages/index/+Page.tsx" : `pages${url}/+Page.tsx`;

                    process.env = {
                        ...process.env,
                        ...env,
                    };

                    return getLastModFromGit({ filePath });
                },
            }),
        ],
        resolve: {
            dedupe: ["react", "react-dom", "@mantine/core", "@mantine/hooks"],
        },
        build: {
            sourcemap: true,
            minify: true,
            cssMinify: true,
        },
        ssr: {
            noExternal: ["@surrealdb/ui"],
            external: ["vike-content-collection"],
        },
        css: {
            localsConvention: "dashesOnly",
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
    };
});
