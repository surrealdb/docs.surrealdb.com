import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { getCollectionEntry, vikeContentCollectionPlugin } from "vike-content-collection";
import { getLastModFromGit, vikeSitemap } from "vike-sitemap-generator";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";
import { docs, sdks, versionedSdks } from "./src/content/config";

const versionedSdkPattern = /^(\d+\.x)\/sdk\/(\w+)/;

// Workaround: @brillout/vite-plugin-server-entry writes an auto-importer
// file during the SSR build with a relative import to dist/server/entry.mjs.
// Photon's esbuild post-build step then fails resolving that path.
// vike-photon sets disableAutoImport but a Vite 7 bug prevents it from
// taking effect. We reset the file after the SSR build writes it.
function fixServerEntryAutoImport(): Plugin {
	const require = createRequire(import.meta.url);
	let autoImporterPath: string | null = null;
	try {
		const runtimeIndex = require.resolve("@brillout/vite-plugin-server-entry/runtime");
		autoImporterPath = join(dirname(runtimeIndex), "autoImporter.js");
	} catch { }

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

function findCollectionEntry(url: string) {
	const segments = url.split("/").filter(Boolean);
	const first = segments[0];

	const versionedMatch = url.match(versionedSdkPattern);
	if (versionedMatch) {
		const version = versionedMatch[1];
		const sdkName = versionedMatch[2];
		const config = versionedSdks[sdkName as keyof typeof versionedSdks];
		const isLatest = config && version === config.latest;
		const collectionId = isLatest
			? `doc-sdk-${sdkName}`
			: `doc-sdk-${sdkName}-${version.replace(".", "")}`;
		const slug = segments.slice(3).join("/") || "index";
		return getCollectionEntry(collectionId, slug);
	}

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

export default defineConfig({
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
		fixServerEntryAutoImport(),
		vikeSitemap({
			baseUrl: "https://surrealdb.com/docs",
			outDir: "./.vercel/output/static",
			outFile: "sitemap.xml",
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
				{ match: /^\/sdk\//, changefreq: "monthly" },
				{ match: /^\/cloud/, changefreq: "monthly" },
				{ match: /^\/\d+\.x\//, changefreq: "yearly" },
			],
			exclude: [/^\/404$/, /^\/500$/],
			trailingSlash: false,
			lastmod: async (url) => {
				const entry = findCollectionEntry(url);

				if (entry?.lastModified) {
					return entry.lastModified.toISOString().split("T")[0];
				}

				const filePath =
					url === "/" ? "src/pages/index/+Page.tsx" : `src/pages${url}/+Page.tsx`;

				return getLastModFromGit({ filePath });
			},
		}),
	],
	resolve: {
		dedupe: ["react", "react-dom", "@mantine/core", "@mantine/hooks", "@mantine/spotlight"],
	},
	build: {
		sourcemap: true,
		minify: true,
		cssMinify: true,
	},
	ssr: {
		noExternal: ["@surrealdb/ui", "@mantine/core", "@mantine/hooks", "@mantine/spotlight"],
		external: ["vike-content-collection"],
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
});
