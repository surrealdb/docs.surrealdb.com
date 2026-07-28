import type { SearchResult, SearchResultItem } from "@surrealdb/docs-search-common";
import { applyPathFallback } from "./path";
import type { ProductId } from "./product";

export type { SearchResult, SearchResultItem };

export class RateLimitError extends Error {
    readonly retryAfterSeconds: number | null;

    constructor(retryAfterSeconds: number | null) {
        super("Too many requests");
        this.name = "RateLimitError";
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

export class SearchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SearchError";
    }
}

/**
 * Parses the standard `Retry-After` header, which may be a
 * number of seconds or an HTTP-date. Returns whole seconds
 * (capped at 3600) or null if the header is missing/invalid.
 */
function parseRetryAfter(header: string | null): number | null {
    if (!header) return null;

    const seconds = Number(header);
    if (Number.isFinite(seconds) && seconds > 0 && seconds <= 3600) {
        return Math.ceil(seconds);
    }

    const date = new Date(header);
    if (!Number.isNaN(date.getTime())) {
        const diff = Math.ceil((date.getTime() - Date.now()) / 1000);
        return diff > 0 && diff <= 3600 ? diff : null;
    }

    return null;
}

export interface SearchOptions {
    product?: ProductId;
    /**
     * Pathname the search was made from. Ranking uses it to prefer the
     * part of the docs the reader is already in — searching "table" in
     * the SurrealQL reference should not lead with an SDK type wrapper.
     * The API collapses it to a coarse section token before it reaches
     * the CDN cache key, so sending the full pathname is safe.
     */
    context?: string;
}

export async function searchDocs(
    query: string,
    signal: AbortSignal,
    { product, context }: SearchOptions = {},
): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query });
    if (product) params.set("product", product);
    if (context) params.set("context", context);
    const endpoint = applyPathFallback(`/docs/api/search?${params}`);

    let res: Response;

    try {
        res = await fetch(endpoint, { signal });
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
        }
        throw new SearchError("Could not reach search — check your connection");
    }

    if (res.status === 429) {
        throw new RateLimitError(parseRetryAfter(res.headers.get("Retry-After")));
    }

    if (!res.ok) {
        throw new SearchError("Search is temporarily unavailable");
    }

    let data: unknown;

    try {
        data = await res.json();
    } catch {
        throw new SearchError("Received an invalid response");
    }

    const results = (data as { results?: SearchResult[] })?.results;
    return Array.isArray(results) ? results : [];
}
