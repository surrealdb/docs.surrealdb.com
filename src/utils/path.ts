const SEARCH_HOST = import.meta.env.VITE_SEARCH_HOST || "https://surrealdb.com";
export function applyPathFallback(path: string) {
    return `${SEARCH_HOST}${path}`;
}

/**
 * Turns a Vike `urlPathname` into a full docs path.
 *
 * Vike strips the configured base from `urlPathname`, so a page served
 * at `/docs/reference/python` reports `/reference/python`. Anything
 * comparing against real docs URLs — such as the search `context`
 * parameter, matched against the compiled route table — needs the base
 * put back.
 */
export function toDocsPath(urlPathname: string): string {
    const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
    return `${base}${urlPathname.startsWith("/") ? "" : "/"}${urlPathname}`;
}
