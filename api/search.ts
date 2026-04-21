import { handleSearch, MAX_QUERY_LENGTH, normaliseQuery } from "@surrealdb/docs-search-common";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

    // Redirect to the canonical query so every spelling variant
    // ("How to SELECT?", "how to select", "select") resolves to
    // a single CDN cache entry.
    //
    // Location must be `/docs/api/search`, not `/api/search`: the browser
    // resolves relative URLs against `surrealdb.com`, and `/api/search` is
    // not served by the docs app on that host (only `/docs/...` is proxied).
    if (query !== raw) {
        res.writeHead(302, {
            ...CORS_HEADERS,
            Location: `/docs/api/search?q=${encodeURIComponent(query)}`,
            "Cache-Control": CACHE_CONTROL,
        });
        return res.end();
    }

    try {
        const results = await handleSearch(query);
        res.setHeader("Cache-Control", CACHE_CONTROL);
        return res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("[SEARCH] Error:", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}
