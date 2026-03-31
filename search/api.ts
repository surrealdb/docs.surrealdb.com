import type { IncomingMessage, ServerResponse } from "node:http";
import { handleSearch, MAX_QUERY_LENGTH } from "./handler";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(res: ServerResponse, body: unknown, status = 200) {
    res.writeHead(status, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    if (req.method === "OPTIONS") {
        res.writeHead(204, CORS_HEADERS);
        return res.end();
    }

    if (req.method !== "GET") {
        return sendJson(res, { success: false, error: "Method not allowed" }, 405);
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const query = url.searchParams.get("q")?.trim();

    if (!query) {
        return sendJson(res, { success: false, error: "`q` parameter is required" }, 400);
    }

    if (query.length > MAX_QUERY_LENGTH) {
        return sendJson(
            res,
            { success: false, error: `Query must be at most ${MAX_QUERY_LENGTH} characters` },
            400,
        );
    }

    try {
        const results = await handleSearch(query);
        sendJson(res, { success: true, results });
    } catch (err) {
        console.error("[SEARCH] Error:", err);
        sendJson(res, { success: false, error: "Internal server error" }, 500);
    }
}
