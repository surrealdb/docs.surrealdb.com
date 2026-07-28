// ══════════════════════════════════════════════════════════
// Ranking policy
//
// How much each kind of documentation is worth, and how to read a
// language out of a query. This is search policy — the content tree
// decides what kind a page *is* (the `search` block in each
// collection's root __category.json), this file decides what that
// kind is worth.
//
// Deliberately holds no URLs, paths, or collection ids. Ranking used
// to detect SDK pages with a hardcoded `/docs/languages/` prefix;
// when the SDK docs moved to `/docs/reference/<lang>/` that check
// matched nothing, SDK de-prioritisation silently stopped applying,
// and SDK reference pages took over the top of every generic query.
// Everything positional now arrives from the compiled index.
// ══════════════════════════════════════════════════════════

/**
 * Ranking class of a page, mirroring `SEARCH_KINDS` in
 * src/utils/schema.ts. Kept as a plain string so the search package
 * does not depend on the site's Zod schema; `ranking.test.ts` asserts
 * the two vocabularies agree.
 */
export type SearchKind = string;

/**
 * Static authority prior per kind — the "custom ranking" signal
 * hybrid search engines layer on top of text relevance (Elasticsearch
 * function_score, Algolia customRanking, Vespa rank features).
 *
 * It encodes what generic one-word queries mean in practice. "table",
 * "authentication" and "upsert" are asking about SurrealDB, not about
 * how one of ten client libraries happens to name a type; the SDK page
 * is the right answer only once the user has said which language they
 * are in. SDK docs are also the most duplicated content in the corpus
 * — ten languages × the same method surface is roughly 370 of 880
 * SurrealDB pages — so without a prior they win on volume alone.
 *
 * SDK pages are not buried: `sdkAuthority` lifts the language the
 * reader actually asked for above every other kind.
 */
const KIND_AUTHORITY: Record<string, number> = {
    reference: 1.3,
    guide: 1.3,
    start: 1.15,
    operations: 1.0,
    product: 1.0,
    tool: 0.95,
    sdk: 0.4,
};

/** Applied to a kind the content declares but this file has no weight for. */
const UNKNOWN_KIND_AUTHORITY = 1.0;

/** Authority for an SDK page whose language the reader explicitly named. */
const SDK_REQUESTED_AUTHORITY = 1.4;

/** Authority for an SDK page in a language the reader is browsing but did not name. */
const SDK_CONTEXT_AUTHORITY = 1.1;

/**
 * Authority for SDK pages in *other* languages once the reader has named
 * one. Naming "python" is a strong signal that the Java page is noise,
 * so it drops below the flat SDK prior.
 */
const SDK_OTHER_LANGUAGE_AUTHORITY = 0.25;

/** The kind whose pages are duplicated per language. */
export const SDK_KIND = "sdk";

export interface LanguageIntent {
    /** Languages named in the query itself. */
    requested: ReadonlySet<string>;
    /** Language of the docs the reader is searching from, if any. */
    browsing?: string;
}

/** Static prior for a kind other than "sdk". */
export function kindAuthority(kind: SearchKind): number {
    return KIND_AUTHORITY[kind] ?? UNKNOWN_KIND_AUTHORITY;
}

/**
 * Static prior for an SDK page, given what the reader asked for and
 * where they are. Falls back to the flat SDK prior when the language is
 * unknown.
 */
export function sdkAuthority(language: string | undefined, intent: LanguageIntent): number {
    if (language && intent.requested.has(language)) return SDK_REQUESTED_AUTHORITY;
    if (intent.requested.size > 0) return SDK_OTHER_LANGUAGE_AUTHORITY;
    if (language && language === intent.browsing) return SDK_CONTEXT_AUTHORITY;
    return kindAuthority(SDK_KIND);
}

/** Every kind this file assigns a weight to. Used by the vocabulary test. */
export function weightedKinds(): string[] {
    return Object.keys(KIND_AUTHORITY);
}

// ──────────────────────────────────────────────────────────
// Language intent
//
// Aliases the way people actually type them, mapped to the canonical
// slugs the compiled index uses (the SDK collection directory names).
// Matched against whole query tokens, never substrings: "java" must
// not select JavaScript and "gopher" must not select Go.
// ──────────────────────────────────────────────────────────

const LANGUAGE_ALIASES: Record<string, string> = {
    javascript: "javascript",
    js: "javascript",
    typescript: "javascript",
    ts: "javascript",
    node: "javascript",
    nodejs: "javascript",
    deno: "javascript",
    python: "python",
    py: "python",
    rust: "rust",
    rs: "rust",
    golang: "golang",
    go: "golang",
    java: "java",
    kotlin: "kotlin",
    kt: "kotlin",
    dotnet: "dotnet",
    net: "dotnet",
    csharp: "dotnet",
    "c#": "dotnet",
    cs: "dotnet",
    php: "php",
    swift: "swift",
    ios: "swift",
    mojo: "mojo",
};

/** Canonical language slugs named by the given query tokens. */
export function detectLanguages(tokens: readonly string[]): Set<string> {
    const found = new Set<string>();

    for (const token of tokens) {
        const language = LANGUAGE_ALIASES[token];
        if (language) found.add(language);
    }

    return found;
}

/** Every language an alias can resolve to. Used by the vocabulary test. */
export function aliasedLanguages(): string[] {
    return [...new Set(Object.values(LANGUAGE_ALIASES))];
}

// ──────────────────────────────────────────────────────────
// Search context
//
// Where a search was made from. Ranking wants this — "table" typed in
// the SurrealQL reference means the statement, "connect" typed in the
// Python SDK means the Python client (the signal Algolia DocSearch
// calls contextual search).
//
// The wire format is a token rather than a pathname, because it goes
// into the query string and the query string is the CDN cache key.
// Thousands of pathnames would shard the search cache per page; one
// token per kind (plus language for SDKs) is ~19 values, which is all
// ranking reads.
// ──────────────────────────────────────────────────────────

export interface SearchContext {
    kind: SearchKind;
    /** Set when the reader is inside an SDK's docs. */
    language?: string;
}

const SDK_TOKEN_PREFIX = `${SDK_KIND}:`;

/** Wire token for a context, e.g. "surrealql" or "sdk:python". */
export function formatContextToken({ kind, language }: SearchContext): string {
    return kind === SDK_KIND && language ? `${SDK_TOKEN_PREFIX}${language}` : kind;
}

/**
 * Parses a context token. Tokens are opaque to ranking beyond their
 * shape, so an unrecognised kind still parses — it simply gets the
 * unknown-kind authority. Empty input yields undefined.
 */
export function parseContextToken(token: string): SearchContext | undefined {
    const trimmed = token.trim();
    if (!trimmed) return undefined;

    if (trimmed.startsWith(SDK_TOKEN_PREFIX)) {
        const language = trimmed.slice(SDK_TOKEN_PREFIX.length);
        return language ? { kind: SDK_KIND, language } : undefined;
    }

    return { kind: trimmed };
}
