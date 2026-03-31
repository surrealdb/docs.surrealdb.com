import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleSearch } from "../search/handler";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "OPTIONS") {
        return res.status(204).setHeader("Access-Control-Allow-Origin", "*").end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const query = typeof req.query.q === "string" ? req.query.q : undefined;

    if (!query) {
        return res.status(400).json({
            success: false,
            error: "`q` parameter is required",
        });
    }

    try {
        const results = await handleSearch(query);

        for (const [key, value] of Object.entries(CORS_HEADERS)) {
            res.setHeader(key, value);
        }

        return res.status(200).json({ success: true, results });
    } catch (err) {
        console.error("[SEARCH] Error:", err);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
}
