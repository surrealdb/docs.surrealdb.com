import type { ProductId } from "./product";

/**
 * A page in one product and the page that covers the same thing in the other.
 * Paths are as the router sees them, without the `/docs` base.
 */
export interface CounterpartPair {
    surrealdb: string;
    "agent-memory": string;
    /**
     * Match the page itself only. Without it, a page beneath either path
     * matches too, so every page of the JavaScript SDK reference switches to
     * the Agent Memory JavaScript SDK.
     */
    exact?: boolean;
}

/**
 * Where the product switch goes when the reader is on a page with a clear
 * counterpart. Every other page switches to the other product's home, so the
 * list holds only pages that genuinely cover the same thing in both products.
 * `bun run check:links` fails when a path here is not a page.
 */
export const COUNTERPART_PAGES: CounterpartPair[] = [
    // Section hubs. Their pages differ between the products, so only the hub
    // itself matches.
    { surrealdb: "/learn", "agent-memory": "/agent-memory/learn", exact: true },
    { surrealdb: "/integrate", "agent-memory": "/agent-memory/integrate", exact: true },
    { surrealdb: "/operate", "agent-memory": "/agent-memory/operate", exact: true },
    { surrealdb: "/reference", "agent-memory": "/agent-memory/reference", exact: true },

    // SDKs both products have.
    {
        surrealdb: "/reference/javascript",
        "agent-memory": "/agent-memory/reference/sdk-javascript",
    },
    { surrealdb: "/reference/python", "agent-memory": "/agent-memory/reference/sdk-python" },
    { surrealdb: "/reference/kotlin", "agent-memory": "/agent-memory/reference/sdk-kotlin" },
    { surrealdb: "/reference/swift", "agent-memory": "/agent-memory/reference/sdk-swift" },

    { surrealdb: "/reference/cli", "agent-memory": "/agent-memory/reference/cli" },
    { surrealdb: "/operate/instances", "agent-memory": "/agent-memory/operate/cloud" },
    { surrealdb: "/operate/enterprise", "agent-memory": "/agent-memory/operate/enterprise" },
];

/**
 * The page in `target` that covers what `pathname` covers in the other
 * product, or `undefined` when there is none. The longest matching path wins,
 * so a page under an SDK reference matches the SDK rather than a hub.
 */
export function counterpartPath(pathname: string, target: ProductId): string | undefined {
    const path = pathname.replace(/\/$/, "") || "/";
    let best: { from: string; to: string } | undefined;

    for (const pair of COUNTERPART_PAGES) {
        const [from, to] =
            target === "agent-memory"
                ? [pair.surrealdb, pair["agent-memory"]]
                : [pair["agent-memory"], pair.surrealdb];
        const matches = path === from || (!pair.exact && path.startsWith(`${from}/`));

        if (matches && (!best || from.length > best.from.length)) {
            best = { from, to };
        }
    }

    return best?.to;
}
