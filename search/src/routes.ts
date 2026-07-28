// ══════════════════════════════════════════════════════════
// Route resolver
//
// Turns a docs pathname into a search context token. The route table
// is compiled from the content tree by plugins/vite-search-index.ts
// and passed in by the caller — this module never hardcodes a path,
// so a docs restructure changes the artefact and nothing else.
// ══════════════════════════════════════════════════════════

import { formatContextToken, type SearchKind } from "./ranking";

/** One collection's entry in the compiled route table. */
export interface SearchRoute {
    id: string;
    /** URL prefix the collection is served from, without the base. */
    prefix: string;
    label: string;
    kind: SearchKind;
    /** Canonical SDK language slug. Set only when `kind` is "sdk". */
    language?: string;
    product: string;
}

/** Shape of `generated/search-routes.json`. */
export interface SearchRouteTable {
    base: string;
    collections: SearchRoute[];
}

export interface RouteResolver {
    /** Route serving a pathname, or undefined when it is outside the docs base. */
    routeForPath(path: string): SearchRoute | undefined;
    /** Context token for a pathname, for use as a ranking hint and cache key. */
    contextToken(path: string): string | undefined;
    /**
     * Canonical token for whatever a caller sent: a pathname is resolved,
     * an already-canonical token passes through, anything else is dropped.
     *
     * Both forms have to be accepted because the API canonicalises the
     * parameter with a redirect — the redirected request arrives carrying
     * the token, and re-resolving it as a pathname would fail and redirect
     * again, forever.
     */
    canonicalToken(raw: string): string | undefined;
}

function join(...parts: string[]): string {
    const segments = parts.flatMap((part) => part.split("/")).filter(Boolean);
    return `/${segments.join("/")}`;
}

/**
 * Builds a resolver over a compiled route table.
 *
 * Prefixes are matched longest-first because the docs root is served
 * from an empty prefix — it must only match once every longer prefix
 * has been ruled out.
 */
export function createRouteResolver(table: SearchRouteTable): RouteResolver {
    const prefixes = table.collections
        .map((route) => ({ route, full: join(table.base, route.prefix) }))
        .sort((a, b) => b.full.length - a.full.length);

    function routeForPath(path: string): SearchRoute | undefined {
        const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";

        return prefixes.find(({ full }) => clean === full || clean.startsWith(`${full}/`))?.route;
    }

    function contextToken(path: string): string | undefined {
        const route = routeForPath(path);
        return route ? formatContextToken(route) : undefined;
    }

    // Every token this table can produce, so an inbound token can be
    // told apart from an inbound pathname and from junk.
    const validTokens = new Set(table.collections.map(formatContextToken));

    return {
        routeForPath,
        contextToken,
        canonicalToken(raw) {
            const trimmed = raw.trim();
            if (!trimmed) return undefined;
            if (trimmed.startsWith("/")) return contextToken(trimmed);
            return validTokens.has(trimmed) ? trimmed : undefined;
        },
    };
}
