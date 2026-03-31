const SEARCH_HOST = import.meta.env.VITE_SEARCH_HOST || "https://surrealdb.com";
export function applyPathFallback(path: string) {
    return `${SEARCH_HOST}${path}`;
}
