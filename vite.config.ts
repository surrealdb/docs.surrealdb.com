import { existsSync } from "node:fs";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { vikeContentCollectionPlugin } from "vike-content-collection";
import { getLastModFromGit, getLastModFromGithub, vikeSitemap } from "vike-sitemap-generator";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";
import { docs, sdks } from "./src/content/config";

// TODO replace with content collection API
function resolveContentPath(url: string): string | undefined {
	const segments = url.split("/").filter(Boolean);
	const first = segments[0];

	if (first === "sdk" && segments.length >= 2) {
		const sdkName = segments[1];

		if (!(sdks as readonly string[]).includes(sdkName)) return undefined;

		const slug = segments.slice(2).join("/") || "index";
		return resolveMarkdownPath(`content/doc-sdk-${sdkName}/${slug}`);
	}

	if ((docs as readonly string[]).includes(first)) {
		const slug = segments.slice(1).join("/") || "index";
		return resolveMarkdownPath(`content/doc-${first}/${slug}`);
	}

	return undefined;
}

function resolveMarkdownPath(basePath: string): string {
	if (existsSync(`${basePath}.md`)) return `${basePath}.md`;
	if (existsSync(`${basePath}/index.md`)) return `${basePath}/index.md`;
	return `${basePath}.md`;
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
				contentDir: "content",
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
					const filePath =
						resolveContentPath(url) ??
						(url === "/" ? "pages/index/+Page.tsx" : `pages${url}/+Page.tsx`);

					// Required for microfrontends to work
					process.env = {
						...process.env,
						...env,
					};

					if (mode === "production") {
						const token = process.env.GITHUB_TOKEN;

						if (!token) {
							throw new Error("GITHUB_TOKEN is not set");
						}

						return getLastModFromGithub({
							filePath,
							repo: "surrealdb/docs.surrealdb.com",
							token
						});
					}

					return getLastModFromGit({ filePath });
				}
			})
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
		},
		css: {
			localsConvention: "dashesOnly",
			preprocessorOptions: {
				scss: {
					additionalData: "@use '@surrealdb/ui/mixins' as *;",
				}
			}
		},
		server: {
			port: 4321,
			host: true,
		}
	};
});