import { getDb } from "./db";
import { embed } from "./embed";
import type { RawSearchHit, SearchResult, SearchResultItem } from "./types";

export const MAX_QUERY_LENGTH = 500;

const SEARCH_SQL = /* surql */ `
    LET $page_vs = (
        SELECT
            id,
            "page" AS kind,
            path AS url,
            path AS page_path,
            title,
            breadcrumb,
            description,
            content,
            vector::distance::knn() AS distance
        FROM page
        WHERE embedding <|30,100|> $qvec
        ORDER BY distance ASC
        LIMIT 30
    );

    LET $page_ft = (
        SELECT
            id,
            "page" AS kind,
            path AS url,
            path AS page_path,
            title,
            breadcrumb,
            description,
            content,
            (
                (search::score(0) * 15)
                + (search::score(1) * 25)
                + (search::score(2) * 10)
                + (search::score(3) * 8)
                + (search::score(4) * 1)
            ) AS ft_score
        FROM page
        WHERE
            path @0@ $query
            OR title @1@ $query
            OR breadcrumb @2@ $query
            OR description @3@ $query
            OR content @4@ $query
        ORDER BY ft_score DESC
        LIMIT 30
    );

    LET $section_vs = (
        SELECT
            id,
            "section" AS kind,
            string::concat(page.path, "#", anchor) AS url,
            page.path AS page_path,
            title,
            breadcrumb,
            content,
            vector::distance::knn() AS distance
        FROM section
        WHERE embedding <|30,100|> $qvec
        ORDER BY distance ASC
        LIMIT 30
    );

    LET $section_ft = (
        SELECT
            id,
            "section" AS kind,
            string::concat(page.path, "#", anchor) AS url,
            page.path AS page_path,
            title,
            breadcrumb,
            content,
            (
                (search::score(0) * 25)
                + (search::score(1) * 10)
                + (search::score(2) * 1)
            ) AS ft_score
        FROM section
        WHERE
            title @0@ $query
            OR breadcrumb @1@ $query
            OR content @2@ $query
        ORDER BY ft_score DESC
        LIMIT 30
    );

    LET $fused = search::rrf([$page_ft, $page_vs, $section_ft, $section_vs], 60, 80);

    RETURN (
        SELECT
            kind,
            url,
            page_path,
            title,
            breadcrumb,
            description,
            content,
            rrf_score AS score
        FROM $fused
        LIMIT 60
    );
`;

function normalise(s: string): string {
    return s.toLowerCase().trim();
}

function tokenise(s: string): string[] {
    return normalise(s)
        .split(/[\s\-_/]+/)
        .filter(Boolean);
}

function boostResults(hits: RawSearchHit[], query: string): RawSearchHit[] {
    const q = normalise(query);
    const qTokens = tokenise(query);

    const boosted = hits.map((hit) => {
        const t = normalise(hit.title || "");
        let boost = 1.0;

        if (t === q) {
            boost = 3.0;
        } else if (t.startsWith(q) || q.startsWith(t)) {
            boost = 2.0;
        } else if (qTokens.length > 1 && qTokens.every((w) => t.includes(w))) {
            boost = 1.5;
        }

        if (hit.kind === "page") {
            boost *= 1.1;
        }

        return { ...hit, score: hit.score * boost };
    });

    return boosted.sort((a, b) => b.score - a.score);
}

const SNIPPET_MAX_LENGTH = 140;

function extractSnippet(content: string | undefined, query: string): string {
    if (!content) return "";
    const text = content.replace(/\s+/g, " ").trim();
    if (text.length <= SNIPPET_MAX_LENGTH) return text;

    const lower = text.toLowerCase();
    const terms = tokenise(query);

    let bestPos = -1;
    for (const term of terms) {
        const idx = lower.indexOf(term);
        if (idx !== -1) {
            bestPos = idx;
            break;
        }
    }

    if (bestPos === -1) return `${text.slice(0, SNIPPET_MAX_LENGTH)}...`;

    const half = Math.floor(SNIPPET_MAX_LENGTH / 2);
    let start = Math.max(0, bestPos - half);
    const end = Math.min(text.length, start + SNIPPET_MAX_LENGTH);

    if (end === text.length) {
        start = Math.max(0, end - SNIPPET_MAX_LENGTH);
    }

    const snippet = text.slice(start, end);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < text.length ? "..." : "";
    return `${prefix}${snippet}${suffix}`;
}

function toItem(hit: RawSearchHit, query: string): SearchResultItem {
    return {
        kind: hit.kind,
        url: hit.url,
        title: hit.title,
        breadcrumb: hit.breadcrumb,
        description: hit.description,
        content: extractSnippet(hit.content, query),
        score: hit.score,
    };
}

function groupByPage(hits: RawSearchHit[], query: string): SearchResult[] {
    const groups = new Map<string, RawSearchHit[]>();
    const order: string[] = [];

    for (const hit of hits) {
        const key = hit.page_path;
        const existing = groups.get(key);

        if (existing) {
            existing.push(hit);
        } else {
            groups.set(key, [hit]);
            order.push(key);
        }
    }

    return order.map((key) => {
        const items = groups.get(key) ?? [];
        const [primary, ...rest] = items;
        return {
            ...toItem(primary, query),
            more: rest.map((h) => toItem(h, query)),
        };
    });
}

export async function handleSearch(query: string): Promise<SearchResult[]> {
    const connection = await getDb();
    const qvec = await embed(query);

    const [_1, _2, _3, _4, _5, hits] = await connection
        .query<[undefined, undefined, undefined, undefined, undefined, RawSearchHit[]]>(
            SEARCH_SQL,
            { query, qvec },
        )
        .collect();

    const boosted = boostResults(hits, query);
    return groupByPage(boosted, query);
}
