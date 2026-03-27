export function applyPathFallback(path: string) {
    if (location && location.hostname === "localhost") {
        return `https://surrealdb.com${path}`;
    }

    return path;
}
