// UI-free product helpers.
//
// `meta.ts` is loaded from `+config.ts` at SSR config time, before
// Vite has a chance to handle non-JS asset imports. Anything imported
// from `meta.ts` must therefore avoid pulling in `@surrealdb/ui`,
// which transitively bundles `.webp` assets that the bare Node loader
// cannot resolve. Keep this module pure data + functions.

export type ProductId = "surrealdb" | "agent-memory";

export const PRODUCT_ORDER: readonly ProductId[] = ["surrealdb", "agent-memory"] as const;

export interface ProductMeta {
	id: ProductId;
	label: string;
	shortLabel: string;
	description: string;
	homeHref: string;
	pathPrefix: string;
}

export const PRODUCT_META: Record<ProductId, ProductMeta> = {
	surrealdb: {
		id: "surrealdb",
		label: "Database",
		shortLabel: "Database",
		description: "Database, query language, SDKs, and tooling.",
		homeHref: "/docs/",
		pathPrefix: "/",
	},
	"agent-memory": {
		id: "agent-memory",
		label: "SurrealDB Agent Memory",
		shortLabel: "Agent Memory",
		description: "Persistent agent memory built on knowledge graphs.",
		homeHref: "/docs/agent-memory",
		pathPrefix: "/agent-memory",
	},
};

/**
 * Resolve which product a given URL belongs to. Drives top nav,
 * wordmark, search filter, and meta title suffix. Vike's
 * `urlPathname` does not include the `/docs` base, so this matches
 * against the in-app pathname (e.g. `/agent-memory/quickstarts/surrealist-dashboard`).
 */
export function getProductFromPath(urlPathname: string): ProductId {
	if (urlPathname === "/agent-memory" || urlPathname.startsWith("/agent-memory/")) {
		return "agent-memory";
	}
	return "surrealdb";
}
