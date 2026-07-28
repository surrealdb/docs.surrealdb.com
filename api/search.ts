import {
    createRouteResolver,
    handleSearch,
    MAX_QUERY_LENGTH,
    normaliseQuery,
    parseContextToken,
    type SearchProduct,
    type SearchRouteTable,
} from "@surrealdb/docs-search-common";
import type { VercelRequest, VercelResponse } from "@vercel/node";
// Compiled from the content tree by plugins/vite-search-index.ts on every
// Vite run, so the URL layout search knows about cannot drift from the
// routes the site actually serves.
import routeTable from "../generated/search-routes.json";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// Vercel purges the CDN cache on every production deploy, which
// is when the search indexer runs — so cached results are never
// stale relative to the indexed content. Between deploys we
// cache aggressively at the edge (1 h) and serve stale results
// while revalidating (24 h) so most requests never hit the
// serverless function or the OpenAI embedding API.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

// Resolves the pathname a search came from to the collection serving
// it, using the compiled route table.
const routes = createRouteResolver(routeTable as SearchRouteTable);

// Every product declared by the content tree. Each collection names its
// product in `__category.json`; the product is passed to handleSearch,
// which filters the search index (shared across products) before
// applying the relevance threshold and result cap — so each product gets
// its full quota of results rather than whatever survives a global cut.
const PRODUCTS: readonly SearchProduct[] = [
    ...new Set(routeTable.collections.map((collection) => collection.product)),
];

const DEFAULT_PRODUCT = PRODUCTS[0];

function isProductId(value: string): boolean {
    return PRODUCTS.includes(value);
}

function setCors(res: VercelResponse) {
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
        res.setHeader(key, value);
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "OPTIONS") {
        res.writeHead(204, CORS_HEADERS);
        return res.end();
    }

    if (req.method !== "GET") {
        setCors(res);
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    setCors(res);

    const raw = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (!raw) {
        return res.status(400).json({ success: false, error: "`q` parameter is required" });
    }

    const query = normaliseQuery(raw);

    if (!query) {
        return res.status(400).json({ success: false, error: "`q` parameter is required" });
    }

    if (query.length > MAX_QUERY_LENGTH) {
        return res.status(400).json({
            success: false,
            error: `Query must be at most ${MAX_QUERY_LENGTH} characters`,
        });
    }

    const rawProduct = typeof req.query.product === "string" ? req.query.product : "";
    const product = isProductId(rawProduct) ? rawProduct : DEFAULT_PRODUCT;

    // The client sends the pathname it searched from; ranking only reads
    // the kind of docs that resolves to. Collapsing it here keeps the
    // cache key to one value per docs section rather than one per page.
    const rawContext = typeof req.query.context === "string" ? req.query.context : "";
    const context = rawContext ? routes.canonicalToken(rawContext) : undefined;

    // Redirect to the canonical query so every spelling variant
    // ("How to SELECT?", "how to select", "select") resolves to
    // a single CDN cache entry. Product and context are part of the
    // cache key so each combination gets its own cached response.
    //
    // Location must be `/docs/api/search`, not `/api/search`: the browser
    // resolves relative URLs against `surrealdb.com`, and `/api/search` is
    // not served by the docs app on that host (only `/docs/...` is proxied).
    if (query !== raw || rawContext !== (context ?? "")) {
        const params = new URLSearchParams({ q: query, product });
        if (context) params.set("context", context);

        res.writeHead(302, {
            ...CORS_HEADERS,
            Location: `/docs/api/search?${params}`,
            "Cache-Control": CACHE_CONTROL,
        });
        return res.end();
    }

    try {
        const results = await handleSearch(query, {
            product,
            context: context ? parseContextToken(context) : undefined,
        });
        res.setHeader("Cache-Control", CACHE_CONTROL);
        return res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("[SEARCH] Error:", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}
