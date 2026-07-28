// Local development server for the search API.
//
// In production, search is handled by a Vercel serverless
// function (api/search.ts). This script provides the same
// endpoint locally so you can test search without deploying.
//
// Usage: bun run search:serve
// Requires: a running SurrealDB instance with indexed content
//           and OPENAI_API_KEY set (for query embedding).

import {
    createRouteResolver,
    handleSearch,
    MAX_QUERY_LENGTH,
    parseContextToken,
    type SearchProduct,
    type SearchRouteTable,
} from "@surrealdb/docs-search-common";
import routeTable from "../generated/search-routes.json";

const routes = createRouteResolver(routeTable as SearchRouteTable);
const PRODUCTS = new Set<SearchProduct>(routeTable.collections.map((c) => c.product));
const DEFAULT_PRODUCT: SearchProduct = routeTable.collections[0].product;

const PORT = Number(process.env.SEARCH_PORT ?? 4322);

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

const server = Bun.serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        if (url.pathname !== "/docs/api/search") {
            return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
        }

        if (req.method !== "GET") {
            return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
        }

        const query = url.searchParams.get("q")?.trim();

        if (!query) {
            return Response.json(
                { success: false, error: "`q` parameter is required" },
                { status: 400, headers: CORS_HEADERS },
            );
        }

        if (query.length > MAX_QUERY_LENGTH) {
            return Response.json(
                { success: false, error: `Query must be at most ${MAX_QUERY_LENGTH} characters` },
                { status: 400, headers: CORS_HEADERS },
            );
        }

        // Mirrors api/search.ts so local search behaves like production,
        // minus the canonicalising redirect (there is no CDN in front).
        const rawProduct = url.searchParams.get("product") ?? "";
        const product = PRODUCTS.has(rawProduct) ? rawProduct : DEFAULT_PRODUCT;
        const rawContext = url.searchParams.get("context") ?? "";
        const token = rawContext ? routes.canonicalToken(rawContext) : undefined;

        try {
            const results = await handleSearch(query, {
                product,
                context: token ? parseContextToken(token) : undefined,
            });
            return Response.json({ success: true, results }, { headers: CORS_HEADERS });
        } catch (err) {
            console.error("[SEARCH] Error:", err);
            return Response.json(
                { success: false, error: "Internal server error" },
                { status: 500, headers: CORS_HEADERS },
            );
        }
    },
});

console.log(
    `[SEARCH] Local search server running on http://localhost:${server.port}/docs/api/search`,
);
