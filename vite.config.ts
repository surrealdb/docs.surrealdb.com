import { loadEnvFile } from "node:process";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { vikeContentCollectionPlugin } from "vike-content-collection";
import { vikeSitemap } from "vike-sitemap-generator";
import { defineConfig } from "vite";
import { vercel } from "vite-plugin-vercel/vite";

loadEnvFile(".env.shared");

const noExternalPkgs = ["@surrealdb/ui", "@mantine/core", "@mantine/hooks", "@mantine/spotlight"];

const externalPkgs = ["vike-content-collection"];

export default defineConfig({
    base: "/docs",
    plugins: [
        vike(),
        react(),
        vercel(),
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
        noExternal: noExternalPkgs,
        external: externalPkgs,
    },
    environments: {
        vercel_node: {
            resolve: {
                noExternal: noExternalPkgs,
                external: externalPkgs,
            },
        },
        vercel_edge: {
            resolve: {
                noExternal: noExternalPkgs,
                external: externalPkgs,
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
});
