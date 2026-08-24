import { getDb } from "@surrealdb/docs-search-common";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * The reasons the widget offers. Submissions are constrained to this
 * set so the stored data stays aggregable - a free-text reason belongs
 * in the comment field.
 */
const REASONS = new Set([
    "Accurate",
    "Easy to understand",
    "Solved my problem",
    "Helped me decide to use the product",
    "Hard to understand",
    "Incorrect information",
    "Missing the information",
    "Other",
]);

const SENTIMENTS = new Set(["helpful", "not-helpful"]);
const MAX_COMMENT_LENGTH = 2000;
const MAX_PATH_LENGTH = 300;

interface FeedbackSubmission {
    path: string;
    sentiment: string;
    reasons: string[];
    comment: string;
}

/**
 * Validates a submission body into a clean record, or returns an error
 * string. Everything is length-capped and the enumerable fields are
 * whitelisted, so the table only ever holds what the widget can send.
 */
function parseSubmission(body: unknown): FeedbackSubmission | string {
    if (typeof body !== "object" || body === null) {
        return "A JSON body is required";
    }

    const { path, sentiment, reasons, comment } = body as Record<string, unknown>;

    if (typeof path !== "string" || !path.startsWith("/") || path.length > MAX_PATH_LENGTH) {
        return "`path` must be a site-relative path";
    }

    if (typeof sentiment !== "string" || !SENTIMENTS.has(sentiment)) {
        return "`sentiment` must be `helpful` or `not-helpful`";
    }

    if (!Array.isArray(reasons) || reasons.some((r) => typeof r !== "string" || !REASONS.has(r))) {
        return "`reasons` must be an array of the offered options";
    }

    if (typeof comment !== "string" || comment.length > MAX_COMMENT_LENGTH) {
        return `\`comment\` must be a string of at most ${MAX_COMMENT_LENGTH} characters`;
    }

    return {
        path: path.split("?")[0].split("#")[0],
        sentiment,
        reasons: [...new Set(reasons)],
        comment: comment.trim(),
    };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "OPTIONS") {
        res.writeHead(204, CORS_HEADERS);
        return res.end();
    }

    for (const [key, value] of Object.entries(CORS_HEADERS)) {
        res.setHeader(key, value);
    }

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const submission = parseSubmission(req.body);

    if (typeof submission === "string") {
        return res.status(400).json({ success: false, error: submission });
    }

    try {
        const db = await getDb();

        await db
            .query(
                `CREATE page_feedback SET
                    path = $path,
                    sentiment = $sentiment,
                    reasons = $reasons,
                    comment = $comment`,
                { ...submission },
            )
            .collect();

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("[FEEDBACK] Error:", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}
