import { SignJWT } from "jose";
import { Surreal } from "surrealdb";
import { embed } from "./embed";
import type { RawSearchHit, SearchResult, SearchResultItem } from "./types";

let db: Surreal | null = null;

async function createJwtToken(
    namespace: string,
    database: string,
    accessName: string,
    accessKey: string,
): Promise<string> {
    const secret = new TextEncoder().encode(accessKey);
    return new SignJWT({
        NS: namespace,
        DB: database,
        AC: accessName,
        RL: ["Viewer"],
    })
        .setProtectedHeader({ alg: "HS512" })
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(secret);
}

async function getDb(): Promise<Surreal> {
    if (db) return db;

    const endpoint = process.env.SURREAL_ENDPOINT ?? "ws://localhost:8000";
    const namespace = process.env.SURREAL_NAMESPACE ?? "main";
    const database = process.env.SURREAL_DATABASE ?? "main";

    db = new Surreal();

    const accessName = process.env.SURREAL_ACCESS_NAME;
    const accessKey = process.env.SURREAL_ACCESS_KEY;

    if (accessName && accessKey) {
        const token = await createJwtToken(namespace, database, accessName, accessKey);

        await db.connect(endpoint, {
            versionCheck: false,
            namespace,
            database,
            authentication: token,
        });
    } else {
        const username = process.env.SURREAL_USERNAME ?? "root";
        const password = process.env.SURREAL_PASSWORD ?? "root";

        await db.connect(endpoint, { namespace, database });
        await db.signin({ username, password });
    }

    return db;
}

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

    for (const hit of hits) {
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

        hit.score *= boost;
    }

    return hits.sort((a, b) => b.score - a.score);
}

function extractSnippet(content: string | undefined, query: string, maxLen = 200): string {
    if (!content) return "";
    const text = content.replace(/\s+/g, " ").trim();
    if (text.length <= maxLen) return text;

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

    if (bestPos === -1) return `${text.slice(0, maxLen)}...`;

    const half = Math.floor(maxLen / 2);
    let start = Math.max(0, bestPos - half);
    const end = Math.min(text.length, start + maxLen);

    if (end === text.length) {
        start = Math.max(0, end - maxLen);
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
