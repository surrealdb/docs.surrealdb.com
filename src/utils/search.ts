import type { SearchResult, SearchResultItem } from "@surrealdb/docs-search-common";
import { applyPathFallback } from "./path";

export type { SearchResult, SearchResultItem };

export async function searchDocs(query: string, signal: AbortSignal): Promise<SearchResult[]> {
    const params = new URLSearchParams({ q: query });
    const endpoint = applyPathFallback(`/docs/api/search?${params}`);

    const res = await fetch(endpoint, { signal });
    const data = await res.json();

    return data?.results ?? [];
}
