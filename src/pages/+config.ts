import type { Config } from "vike/types";
import vikeContentCollectionConfig from "vike-content-collection/config";
import vikeReact from "vike-react/config";
import vikeSitemapConfig from "vike-sitemap-generator/config";

export default {
	title: "SurrealDB | The ultimate multi-model database for tomorrow's applications",
	description: "SurrealDB is the ultimate database for tomorrow's serverless, jamstack, single-page, and traditional applications.",
	extends: [vikeReact, vikeContentCollectionConfig, vikeSitemapConfig],
	prerender: false,
	passToClient: ["sdkVersions"],
	server: true,
	ssr: true,
	meta: {
		Page: {
			env: { server: true, client: true },
		},
		data: {
			env: { server: true, client: false },
		},
		sitemap: {
			env: { config: true, server: true, client: false },
		},
		sitemapUrls: {
			env: { config: true, server: true },
		},
		Content: {
			env: { server: true, client: false },
		}
	},
} satisfies Config;
