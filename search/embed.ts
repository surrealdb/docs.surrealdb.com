import OpenAI from "openai";
import type { CrawledEntry } from "./types";

const MODEL = "text-embedding-3-small";

let client: OpenAI | null = null;

function getClient(): OpenAI {
    if (!client) {
        client = new OpenAI();
    }
    return client;
}

export async function embed(text: string): Promise<number[]> {
    const res = await getClient().embeddings.create({
        model: MODEL,
        input: text,
    });

    return res.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];
    if (texts.length === 1) return [await embed(texts[0])];

    const res = await getClient().embeddings.create({
        model: MODEL,
        input: texts,
    });

    return res.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

export function buildEmbedText(entry: CrawledEntry): string {
    const parts = [`Title: ${entry.title}`, `Breadcrumb: ${entry.breadcrumb}`];

    if (entry.kind === "page" && entry.description) {
        parts.push(`Description: ${entry.description}`);
    }

    parts.push(`Content: ${entry.content.slice(0, 2000)}`);
    return parts.join("\n");
}
