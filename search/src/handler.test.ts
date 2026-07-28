// Ranking regression tests.
//
// Run with `bun test`. These cover the post-retrieval stage only —
// no database, no embedding call — by feeding `rankHits` synthetic
// hits with equal fusion scores. Equal scores are the realistic case:
// RRF compresses the top of every result list into a narrow band, so
// ranking is decided by the reranking factors under test here.
//
// The scenarios are the ones users reported: a one-word query whose
// term is the title of ten near-identical SDK pages.

import { describe, expect, test } from "bun:test";
import { rankHits } from "./handler";
import type { SearchKind } from "./ranking";
import type { RawSearchHit } from "./types";

const SDK_LANGUAGES = [
    "javascript",
    "golang",
    "python",
    "java",
    "kotlin",
    "rust",
    "dotnet",
    "php",
    "swift",
    "mojo",
];

interface HitInput {
    url: string;
    title: string;
    kind?: "page" | "section";
    doc_kind?: SearchKind;
    language?: string;
    product?: string;
    slug?: string;
    page_path?: string;
    score?: number;
}

/**
 * Builds a hit with the shape the search query returns. `score` stays
 * at a single value by default so assertions isolate reranking rather
 * than depending on invented retrieval scores.
 */
function hit(input: HitInput): RawSearchHit {
    const pagePath = input.page_path ?? input.url.split("#")[0];

    return {
        kind: input.kind ?? "page",
        url: input.url,
        page_path: pagePath,
        title: input.title,
        breadcrumb: "",
        doc_kind: input.doc_kind ?? "guide",
        language: input.language,
        product: input.product ?? "surrealdb",
        slug: input.slug ?? "",
        score: input.score ?? 0.012,
    };
}

/** The ten SDK copies of the same page, as `table` actually retrieves them. */
function sdkVariants(slug: string, title: string): RawSearchHit[] {
    return SDK_LANGUAGES.map((language) =>
        hit({
            url: `/docs/reference/${language}/${slug}`,
            title,
            doc_kind: "sdk",
            language,
            slug,
        }),
    );
}

function urls(results: { url: string }[]): string[] {
    return results.map((result) => result.url);
}

function kindsOf(results: { url: string }[], all: RawSearchHit[]): (SearchKind | undefined)[] {
    return results.map((result) => all.find((h) => h.url === result.url)?.doc_kind);
}

describe("SDK deduplication", () => {
    const hits = [
        ...sdkVariants("api/values/table", "Table"),
        hit({
            url: "/docs/reference/query-language/statements/define/table",
            title: "DEFINE TABLE",
            doc_kind: "reference",
            slug: "statements/define/table",
        }),
        hit({
            url: "/docs/learn/schema-management/tables-and-fields/tables",
            title: "Tables",
            doc_kind: "guide",
            slug: "tables-and-fields/tables",
        }),
    ];

    test("collapses cross-language copies of one page to a single result", () => {
        const results = rankHits(hits, "table");
        const sdkResults = results.filter((r) =>
            SDK_LANGUAGES.some((lang) => r.url.startsWith(`/docs/reference/${lang}/`)),
        );

        expect(sdkResults).toHaveLength(1);
    });

    test("ranks the guide and the SurrealQL statement above the SDK reference", () => {
        const results = rankHits(hits, "table");

        // The reported complaint: five SDK `Table` pages came first.
        expect(kindsOf(results.slice(0, 2), hits)).toEqual(["guide", "reference"]);
    });

    test("still returns the SDK page rather than filtering it out", () => {
        const results = rankHits(hits, "table");

        expect(results.some((r) => r.url.startsWith("/docs/reference/javascript"))).toBe(true);
    });
});

describe("language intent", () => {
    const hits = sdkVariants("api/values/table", "Table");

    test("promotes the named language and demotes the others", () => {
        const results = rankHits(hits, "python table");

        expect(results[0].url).toBe("/docs/reference/python/api/values/table");
    });

    test("keeps every language when one is named, rather than deduplicating", () => {
        // "python methods" should be free to return the whole Python
        // surface, so diversification is off for language-scoped queries.
        const results = rankHits(hits, "python table");

        expect(results.length).toBeGreaterThan(1);
    });

    test("does not treat java as javascript", () => {
        expect(rankHits(hits, "java table")[0].url).toBe("/docs/reference/java/api/values/table");
    });

    test("resolves aliases to the canonical language", () => {
        expect(rankHits(hits, "js table")[0].url).toBe(
            "/docs/reference/javascript/api/values/table",
        );
        expect(rankHits(hits, "go table")[0].url).toBe("/docs/reference/golang/api/values/table");
    });

    test("does not let the language's own landing page win on title alone", () => {
        // "rust select" is asking for the select method, not for the page
        // titled "Rust". Naming a language says where to look, not what
        // to look for, so it must not earn a title match.
        const withLandingPage = [
            hit({ url: "/docs/languages/rust", title: "Rust", doc_kind: "start" }),
            hit({
                url: "/docs/reference/rust/methods/select",
                title: "Select",
                doc_kind: "sdk",
                language: "rust",
                slug: "methods/select",
            }),
        ];

        expect(rankHits(withLandingPage, "rust select")[0].url).toBe(
            "/docs/reference/rust/methods/select",
        );
    });

    test("still matches a landing page when the language is the whole query", () => {
        const withLandingPage = [
            hit({ url: "/docs/languages/rust", title: "Rust", doc_kind: "start" }),
            hit({ url: "/docs/learn/querying/overview", title: "Querying", doc_kind: "guide" }),
        ];

        expect(rankHits(withLandingPage, "rust")[0].url).toBe("/docs/languages/rust");
    });
});

describe("contextual scoping", () => {
    // Same title and same authority in both hits, so the reader's
    // location is the only thing separating them. Context is
    // deliberately a weak signal: it breaks ties, it does not override
    // a stronger title match.
    const hits = [
        hit({
            url: "/docs/reference/query-language/statements/define/index",
            title: "DEFINE INDEX",
            doc_kind: "reference",
        }),
        hit({
            url: "/docs/learn/schema-management/indexes/overview",
            title: "DEFINE INDEX",
            doc_kind: "guide",
        }),
    ];

    test("prefers the kind of docs the reader is in", () => {
        const fromReference = rankHits(hits, "define index", { context: { kind: "reference" } });
        const fromGuide = rankHits(hits, "define index", { context: { kind: "guide" } });

        expect(fromReference[0].url).toContain("/query-language/");
        expect(fromGuide[0].url).toContain("/learn/");
    });

    test("lifts the SDK a reader is browsing without them naming it", () => {
        const results = rankHits(sdkVariants("methods/select", "Select"), "select", {
            context: { kind: "sdk", language: "python" },
        });

        expect(results[0].url).toBe("/docs/reference/python/methods/select");
    });

    test("ignores an unrecognised context instead of failing", () => {
        expect(() => rankHits(hits, "table", { context: { kind: "nonsense" } })).not.toThrow();
    });
});

describe("title matching", () => {
    test("matches a plural title against a singular query", () => {
        // The BM25 analyser stems, so "table" retrieves "Tables";
        // title scoring has to agree or the page loses its boost.
        const hits = [
            hit({ url: "/docs/learn/a/tables", title: "Tables" }),
            hit({ url: "/docs/learn/a/indexes", title: "Indexes" }),
            hit({ url: "/docs/learn/a/unrelated", title: "Permissions" }),
        ];

        expect(rankHits(hits, "table")[0].url).toBe("/docs/learn/a/tables");
        expect(rankHits(hits, "index")[0].url).toBe("/docs/learn/a/indexes");
    });

    test("does not boost a substring that is not a token prefix", () => {
        // Regression: the class name "Surreal" must not outrank a page
        // actually about SurrealDB authentication.
        const hits = [
            hit({
                url: "/docs/reference/javascript/api/core/surreal",
                title: "Surreal",
                doc_kind: "sdk",
                language: "javascript",
                slug: "api/core/surreal",
            }),
            hit({
                url: "/docs/learn/security/authentication/overview",
                title: "Authentication",
                doc_kind: "guide",
            }),
        ];

        expect(rankHits(hits, "surrealdb authentication")[0].url).toContain("/learn/security/");
    });
});

describe("per-language caps", () => {
    test("stops one SDK filling the list with near-synonyms", () => {
        const dotnet = (slug: string, title: string) =>
            hit({
                url: `/docs/reference/dotnet/${slug}`,
                title,
                doc_kind: "sdk",
                language: "dotnet",
                slug,
            });

        const hits = [
            dotnet("methods/live-query", "LiveQuery"),
            dotnet("methods/live-raw-query", "LiveRawQuery"),
            dotnet("methods/live-table", "LiveTable"),
            dotnet("methods/listen-live", "ListenLive"),
        ];

        expect(rankHits(hits, "live query").length).toBeLessThanOrEqual(2);
    });

    test("treats SDK path versions as the same page, not as variants", () => {
        // `php/v1/methods/upsert` and `rust/methods/upsert` document the
        // same method; the version segment must not defeat collapsing.
        const hits = [
            hit({
                url: "/docs/reference/php/v1/methods/upsert",
                title: "Upsert",
                doc_kind: "sdk",
                language: "php",
                slug: "v1/methods/upsert",
            }),
            hit({
                url: "/docs/reference/rust/methods/upsert",
                title: "Upsert",
                doc_kind: "sdk",
                language: "rust",
                slug: "methods/upsert",
            }),
        ];

        expect(rankHits(hits, "upsert")).toHaveLength(1);
    });
});

describe("result grouping", () => {
    test("nests a page's own sections under it rather than as siblings", () => {
        const page = "/docs/reference/query-language/statements/select";
        const hits = [
            hit({ url: page, title: "SELECT", doc_kind: "reference" }),
            hit({
                kind: "section",
                url: `${page}#record-ranges`,
                page_path: page,
                title: "Record ranges",
                doc_kind: "reference",
                score: 0.011,
            }),
        ];

        const results = rankHits(hits, "select");

        expect(urls(results)).toEqual([page]);
        expect(results[0].more).toHaveLength(1);
    });

    test("keeps a page's sections when its language is deduplicated away", () => {
        // Sections must travel with their page: dropping a variant has
        // to drop its sections too, or an orphan section resurfaces as
        // a duplicate result.
        const hits = [
            ...sdkVariants("api/values/table", "Table"),
            hit({
                kind: "section",
                url: "/docs/reference/golang/api/values/table#constructor",
                page_path: "/docs/reference/golang/api/values/table",
                title: "Constructor",
                doc_kind: "sdk",
                language: "golang",
                slug: "api/values/table",
                score: 0.011,
            }),
        ];

        const results = rankHits(hits, "table");
        const pages = new Set(results.map((r) => r.url.split("#")[0]));

        expect(pages.size).toBe(1);
    });
});

describe("product scoping", () => {
    test("excludes the other product entirely", () => {
        const hits = [
            hit({
                url: "/docs/spectron/reference/memory",
                title: "Memory",
                doc_kind: "product",
                product: "spectron",
            }),
            hit({
                url: "/docs/learn/data-models/vector-search/overview",
                title: "Vector search",
                doc_kind: "guide",
                product: "surrealdb",
            }),
        ];

        expect(urls(rankHits(hits, "memory", { product: "spectron" }))).toEqual([
            "/docs/spectron/reference/memory",
        ]);
        expect(urls(rankHits(hits, "memory", { product: "surrealdb" }))).toEqual([
            "/docs/learn/data-models/vector-search/overview",
        ]);
    });
});
