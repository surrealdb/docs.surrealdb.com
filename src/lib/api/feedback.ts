/**
 * The page-feedback endpoint, as a platform-neutral fetch handler.
 *
 * Takes a `Request` and returns a `Response`, so the same implementation
 * serves both deploy targets: `api/feedback.ts` adapts it to Vercel's Node
 * function signature, and `src/pages/+server.ts` mounts it directly on the
 * Cloudflare Worker's Hono app.
 */
import { getDb } from "@surrealdb/docs-search-common";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * The reasons the widget offers. Submissions are constrained to this set so the
 * stored data stays aggregable - a free-text reason belongs in the comment
 * field.
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
 * Validates a submission body into a clean record, or returns an error string.
 * Everything is length-capped and the enumerable fields are whitelisted, so the
 * table only ever holds what the widget can send.
 */
export function parseSubmission(body: unknown): FeedbackSubmission | string {
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

function json(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
    });
}

export async function handleFeedbackRequest(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
        return json(405, { success: false, error: "Method not allowed" });
    }

    // A body that is not JSON is a malformed submission, not a server fault,
    // so it gets the same 400 as one that parses but fails validation.
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return json(400, { success: false, error: "A JSON body is required" });
    }

    const submission = parseSubmission(body);

    if (typeof submission === "string") {
        return json(400, { success: false, error: submission });
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

        return json(200, { success: true });
    } catch (err) {
        console.error("[FEEDBACK] Error:", err);
        return json(500, { success: false, error: "Internal server error" });
    }
}
