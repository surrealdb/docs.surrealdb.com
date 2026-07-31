import OpenAI from "openai";
import type { CrawledEntry } from "./types";

// text-embedding-3-small produces 1536-dimensional vectors.
// It's the best balance of cost, speed, and quality for
// documentation search. The same model must be used at both
// index time and query time.
const MODEL = "text-embedding-3-small";

// Query-time embedding sits on the critical path of every search
// request, so cap it: if OpenAI stalls, fail fast (the API layer's
// stale-while-revalidate cache can still serve the last good
// response) rather than hanging until the serverless timeout.
const QUERY_EMBED_TIMEOUT_MS = 5000;

let client: OpenAI | null = null;

function getClient(): OpenAI {
    if (!client) {
        client = new OpenAI();
    }
    return client;
}

/** Embed a single text string (used at query time). */
export async function embed(text: string): Promise<number[]> {
    const res = await getClient().embeddings.create(
        {
            model: MODEL,
            input: text,
        },
        { timeout: QUERY_EMBED_TIMEOUT_MS },
    );

    return res.data[0].embedding;
}

/**
 * Embed multiple texts in one API call (used at index time).
 * The OpenAI API returns embeddings in arbitrary order, so we
 * sort by the original index before returning.
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    if (texts.length === 1) return [await embed(texts[0])];

    const res = await getClient().embeddings.create({
        model: MODEL,
        input: texts,
    });

    return res.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

/**
 * Builds the text string that gets embedded for a crawled entry.
 * Structured as labelled fields so the embedding model captures
 * the semantic role of each piece (title vs breadcrumb vs content).
 *
 * Content is truncated to EMBED_CONTENT_LIMIT chars. text-embedding-3-small
 * accepts ~8191 tokens (≈30k chars), so 8000 chars comfortably fits within
 * one request while capturing far more of a long page than the previous
 * 2000-char cap (which left most of a long reference page unembedded and
 * relied on section vectors to compensate).
 */
export const EMBED_CONTENT_LIMIT = 8000;

export function buildEmbedText(entry: CrawledEntry): string {
    const parts = [`Title: ${entry.title}`, `Breadcrumb: ${entry.breadcrumb}`];

    if (entry.kind === "page" && entry.description) {
        parts.push(`Description: ${entry.description}`);
    }

    parts.push(`Content: ${entry.content.slice(0, EMBED_CONTENT_LIMIT)}`);
    return parts.join("\n");
}
