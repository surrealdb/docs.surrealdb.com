import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "/docs",
    plugins: [
        vike(),
        react(),
        nodePolyfills({
            include: ["buffer"],
        }),
        tsconfigPaths(),
    ],
    build: {
        sourcemap: true,
        minify: true,
        cssMinify: true,
    },
    ssr: {
        noExternal: ["@surrealdb/ui"],
    },
    css: {
        modules: {
            localsConvention: "dashesOnly",
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
