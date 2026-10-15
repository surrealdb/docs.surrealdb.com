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
        label: "Agent Memory",
        shortLabel: "Agent Memory",
        description: "Persistent agent memory built on knowledge graphs.",
        homeHref: "/docs/agent-memory",
        pathPrefix: "/agent-memory",
    },
};

/**
 * Whether a URL belongs to the Agent Filesystem docs at `/agent-filesystem`.
 *
 * Agent Filesystem is not a product in the switcher. It sits beside Agent
 * Memory under "Agent Context", so its pages borrow the Agent Memory product
 * (see `getProductFromPath`) rather than adding a third `ProductId`, which
 * would need a switcher button and an accent block of its own.
 */
export function isAgentFilesystemPath(urlPathname: string): boolean {
    return urlPathname === "/agent-filesystem" || urlPathname.startsWith("/agent-filesystem/");
}

/**
 * Resolve which product a given URL belongs to. Drives top nav,
 * wordmark, search filter, and meta title suffix. Vike's
 * `urlPathname` does not include the `/docs` base, so this matches
 * against the in-app pathname (e.g. `/agent-memory/quickstarts/surrealist-dashboard`).
 *
 * The Agent Filesystem docs take the Agent Memory product, which gives them its
 * header, sidebar switcher, accent colour and search scope.
 */
export function getProductFromPath(urlPathname: string): ProductId {
    if (
        urlPathname === "/agent-memory" ||
        urlPathname.startsWith("/agent-memory/") ||
        isAgentFilesystemPath(urlPathname)
    ) {
        return "agent-memory";
    }
    return "surrealdb";
}

/**
 * The name that closes a page title, where it is not the product's own label.
 *
 * The Agent Filesystem docs share the Agent Memory product but are not Agent
 * Memory, and would otherwise be titled as if they were. Every other page
 * returns `undefined` and keeps its product's label.
 */
export function getProductLabelOverride(urlPathname: string): string | undefined {
    return isAgentFilesystemPath(urlPathname) ? "Agent Filesystem" : undefined;
}
