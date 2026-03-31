const SEARCH_HOST = import.meta.env.VITE_SEARCH_HOST || "https://surrealdb.com";

const PRODUCTION_HOSTS = new Set(["surrealdb.com", "www.surrealdb.com", "docs.surrealdb.com"]);

export function applyPathFallback(path: string) {
    if (typeof location === "undefined") return path;

    if (!PRODUCTION_HOSTS.has(location.hostname)) {
        return `${SEARCH_HOST}${path}`;
    }

    return path;
}
