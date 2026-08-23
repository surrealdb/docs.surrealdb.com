import { applyPathFallback } from "./path";

export interface FeedbackSubmission {
    /** Docs pathname the feedback is about, e.g. `/docs/surrealql`. */
    path: string;
    sentiment: "helpful" | "not-helpful";
    reasons: string[];
    comment: string;
}

/**
 * Submits page feedback to `/docs/api/feedback`, which stores it in the
 * same SurrealDB instance the search index lives in.
 *
 * Throws on any non-2xx response so the widget can tell the reader the
 * submission did not go through, rather than pretending it did.
 */
export async function submitFeedback(submission: FeedbackSubmission): Promise<void> {
    const endpoint = applyPathFallback("/docs/api/feedback");

    let res: Response;

    try {
        res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submission),
        });
    } catch {
        throw new Error("Could not reach the feedback service - check your connection");
    }

    if (!res.ok) {
        throw new Error("Feedback could not be submitted right now");
    }
}
