// Coupling tests between search policy and the content tree.
//
// Ranking reads two vocabularies it does not own: the `kind` each
// collection declares in its root `__category.json`, and the SDK
// language slugs the compiled index emits. Both are checked here
// rather than trusted, because the failure that prompted this work was
// exactly this kind of silent drift — ranking looked for SDK pages
// under a prefix the docs had stopped using, matched nothing, and
// stopped de-prioritising them without any error.

import { describe, expect, test } from "bun:test";
import { SEARCH_KINDS } from "../../src/utils/schema";
import {
    aliasedLanguages,
    detectLanguages,
    parseContextToken,
    SDK_KIND,
    weightedKinds,
} from "./ranking";
import { createRouteResolver, type SearchRouteTable } from "./routes";

/**
 * The compiled route table. Written by plugins/vite-search-index.ts on
 * any Vite run; these tests assert against real content, so they need it.
 */
const routeTable: SearchRouteTable = await Bun.file(
    new URL("../../generated/search-routes.json", import.meta.url),
).json();

describe("kind vocabulary", () => {
    test("every kind the content can declare has a ranking weight", () => {
        const unweighted = SEARCH_KINDS.filter((kind) => !weightedKinds().includes(kind));

        expect(unweighted).toEqual([]);
    });

    test("no ranking weight refers to a kind the content cannot declare", () => {
        const orphaned = weightedKinds().filter(
            (kind) => !(SEARCH_KINDS as readonly string[]).includes(kind),
        );

        expect(orphaned).toEqual([]);
    });

    test("every collection declares a kind that carries a weight", () => {
        const undeclared = routeTable.collections.filter(
            (route) => !weightedKinds().includes(route.kind),
        );

        expect(undeclared.map((route) => `${route.id} (${route.kind})`)).toEqual([]);
    });

    test("only SDK collections carry a language", () => {
        const mismatched = routeTable.collections.filter(
            (route) => (route.kind === SDK_KIND) !== Boolean(route.language),
        );

        expect(mismatched.map((route) => route.id)).toEqual([]);
    });
});

describe("language aliases", () => {
    test("every alias resolves to a language the docs actually ship", () => {
        const indexed = new Set(
            routeTable.collections
                .map((route) => route.language)
                .filter((language): language is string => Boolean(language)),
        );

        const unknown = aliasedLanguages().filter((language) => !indexed.has(language));

        expect(unknown).toEqual([]);
    });

    test("every shipped SDK language is reachable by its own name", () => {
        const indexed = routeTable.collections
            .map((route) => route.language)
            .filter((language): language is string => Boolean(language));

        const unreachable = indexed.filter(
            (language) => !detectLanguages([language]).has(language),
        );

        expect(unreachable).toEqual([]);
    });
});

describe("context tokens", () => {
    const routes = createRouteResolver(routeTable);

    test("resolves a docs pathname to the collection serving it", () => {
        expect(routes.routeForPath("/docs/reference/query-language/statements/select")?.id).toBe(
            "reference/query-language",
        );
        expect(routes.routeForPath("/docs/reference/python/api/values/table")?.id).toBe(
            "reference/python",
        );
        expect(routes.routeForPath("/docs/learn/data-models/graph/overview")?.id).toBe(
            "learn/data-models",
        );
    });

    test("matches the docs root only after every longer prefix", () => {
        // The root collection is served from an empty prefix, so a naive
        // first-match would swallow every other route.
        expect(routes.routeForPath("/docs/what-is-surrealdb")?.id).toBe("index");
        expect(routes.routeForPath("/docs/reference/rust/methods/select")?.id).toBe(
            "reference/rust",
        );
    });

    test("prefers the nested Spectron collections over the Spectron root", () => {
        expect(routes.routeForPath("/docs/spectron")?.id).toBe("spectron/index");
        expect(routes.routeForPath("/docs/spectron/reference/memory")?.id).toBe(
            "spectron/reference",
        );
    });

    test("returns nothing outside the docs base path", () => {
        expect(routes.routeForPath("/blog/some-post")).toBeUndefined();
    });

    test("tokenises an SDK pathname with its language", () => {
        expect(routes.contextToken("/docs/reference/python/api")).toBe("sdk:python");
        expect(parseContextToken("sdk:python")).toEqual({ kind: "sdk", language: "python" });
    });

    test("round-trips its own tokens so the canonicalising redirect settles", () => {
        // The API redirects a pathname to its token; the redirected
        // request arrives carrying that token and must be accepted
        // unchanged, or the redirect loops.
        for (const route of routeTable.collections) {
            const token = routes.contextToken(`/docs/${route.prefix}`);

            expect(token).toBeDefined();
            expect(routes.canonicalToken(token as string)).toBe(token);
        }
    });

    test("drops a context that is neither a known token nor a docs path", () => {
        expect(routes.canonicalToken("../../etc/passwd")).toBeUndefined();
        expect(routes.canonicalToken("sdk:not-a-language")).toBeUndefined();
        expect(routes.canonicalToken("")).toBeUndefined();
    });
});
