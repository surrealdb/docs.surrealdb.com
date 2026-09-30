/**
 * The docs search endpoint, as a platform-neutral fetch handler.
 *
 * Takes a `Request` and returns a `Response`, so the same implementation
 * serves both deploy targets: `api/search.ts` adapts it to Vercel's Node
 * function signature, and `src/pages/+server.ts` mounts it directly on the
 * Cloudflare Worker's Hono app. Neither platform owns the logic.
 *
 * The SurrealDB SDK reaches the database over its HTTP engine (`SURREAL_ENDPOINT`
 * on `https://`), which is plain `fetch` and works in both runtimes. The
 * WebSocket engine does not: Workers have no outbound `WebSocket` constructor.
 */
import {
    getDb,
    handleSearch,
    MAX_QUERY_LENGTH,
    normaliseQuery,
    type SearchProduct,
} from "@surrealdb/docs-search-common";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// The search index is rebuilt on deploy, so cached results are never stale
// relative to the indexed content. Between deploys the edge caches
// aggressively (1 h) and serves stale results while revalidating (24 h), so
// most requests never reach this handler or the OpenAI embedding API.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

// Products are isolated at the URL prefix level: every Agent Memory page lives
// under /docs/agent-memory, every SurrealDB page does not. The product is
// passed to handleSearch, which filters the shared index before applying the
// relevance threshold and result cap - so each product gets its full quota of
// results rather than whatever survives a global cut.
const PRODUCTS = ["surrealdb", "agent-memory"] as const satisfies readonly SearchProduct[];
type ProductId = (typeof PRODUCTS)[number];

function isProductId(value: string): value is ProductId {
    return (PRODUCTS as readonly string[]).includes(value);
}

function json(status: number, body: unknown, extra: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS, ...extra },
    });
}

export async function handleSearchRequest(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
        return json(405, { success: false, error: "Method not allowed" });
    }

    const params = new URL(request.url).searchParams;
    const raw = (params.get("q") ?? "").trim();

    if (!raw) {
        return json(400, { success: false, error: "`q` parameter is required" });
    }

    const query = normaliseQuery(raw);

    if (!query) {
        return json(400, { success: false, error: "`q` parameter is required" });
    }

    if (query.length > MAX_QUERY_LENGTH) {
        return json(400, {
            success: false,
            error: `Query must be at most ${MAX_QUERY_LENGTH} characters`,
        });
    }

    const rawProduct = params.get("product") ?? "";
    const product: ProductId = isProductId(rawProduct) ? rawProduct : "surrealdb";

    // Redirect to the canonical query so every spelling variant ("How to
    // SELECT?", "how to select", "select") resolves to a single CDN cache
    // entry. Product is part of the cache key so each product gets its own
    // cached response.
    //
    // Location must be `/docs/api/search`, not `/api/search`: the browser
    // resolves relative URLs against `surrealdb.com`, and `/api/search` is not
    // served by the docs app on that host (only `/docs/...` is proxied).
    if (query !== raw) {
        const canonical = new URLSearchParams({ q: query, product });
        return new Response(null, {
            status: 302,
            headers: {
                ...CORS_HEADERS,
                Location: `/docs/api/search?${canonical}`,
                "Cache-Control": CACHE_CONTROL,
            },
        });
    }

    try {
        const results = await handleSearch(query, product);

        // A zero-result search is the exact phrasing of a content gap, so it is
        // recorded at the source rather than through client analytics (docs
        // pages carry no tag manager). Fire-and-forget: recording must never
        // delay or fail the search response. Edge caching means each distinct
        // miss is logged roughly once per cache window, which is plenty for gap
        // discovery.
        if (results.length === 0) {
            void getDb()
                .then((db) =>
                    db
                        .query("CREATE search_miss SET query = $query, product = $product", {
                            query,
                            product,
                        })
                        .collect(),
                )
                .catch((err) => console.error("[SEARCH] miss log failed:", err));
        }

        return json(200, { success: true, results }, { "Cache-Control": CACHE_CONTROL });
    } catch (err) {
        console.error("[SEARCH] Error:", err);
        return json(500, { success: false, error: "Internal server error" });
    }
}
