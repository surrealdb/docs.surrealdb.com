import { handleSearch, MAX_QUERY_LENGTH } from "../../search/handler";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
}

export default async function handler(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "GET") {
        return json({ success: false, error: "Method not allowed" }, 405);
    }

    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim();

    if (!query) {
        return json({ success: false, error: "`q` parameter is required" }, 400);
    }

    if (query.length > MAX_QUERY_LENGTH) {
        return json(
            { success: false, error: `Query must be at most ${MAX_QUERY_LENGTH} characters` },
            400,
        );
    }

    try {
        const results = await handleSearch(query);
        return json({ success: true, results });
    } catch (err) {
        console.error("[SEARCH] Error:", err);
        return json({ success: false, error: "Internal server error" }, 500);
    }
}
