import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleSearch, MAX_QUERY_LENGTH } from "../search/handler";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
        res.setHeader(key, value);
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCors(res);

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const query = typeof req.query.q === "string" ? req.query.q.trim() : undefined;

    if (!query) {
        return res.status(400).json({
            success: false,
            error: "`q` parameter is required",
        });
    }

    if (query.length > MAX_QUERY_LENGTH) {
        return res.status(400).json({
            success: false,
            error: `Query must be at most ${MAX_QUERY_LENGTH} characters`,
        });
    }

    try {
        const results = await handleSearch(query);
        return res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("[SEARCH] Error:", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
