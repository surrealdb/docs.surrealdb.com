import OpenAI from "openai";
import type { CrawledEntry } from "./types";

const MODEL = "text-embedding-3-small";
const CACHE_MAX = 128;

let client: OpenAI | null = null;

function getClient(): OpenAI {
    if (!client) {
        client = new OpenAI();
    }
    return client;
}

const cache = new Map<string, number[]>();

export async function embed(text: string): Promise<number[]> {
    const cached = cache.get(text);
    if (cached) return cached;

    const res = await getClient().embeddings.create({
        model: MODEL,
        input: text,
    });

    const vec = res.data[0].embedding;

    if (cache.size >= CACHE_MAX) {
        const oldest = cache.keys().next().value;
        if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(text, vec);

    return vec;
}

export function buildEmbedText(entry: CrawledEntry): string {
    const parts = [`Title: ${entry.title}`, `Breadcrumb: ${entry.breadcrumb}`];

    if (entry.kind === "page" && entry.description) {
        parts.push(`Description: ${entry.description}`);
    }

    parts.push(`Content: ${entry.content.slice(0, 2000)}`);
    return parts.join("\n");
}
