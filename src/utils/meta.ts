export const BASE_URL = "https://surrealdb.com/docs";

/** The site the docs belong to, as `og:site_name` names it on every surrealdb.com page. */
export const SITE_NAME = "SurrealDB";

/** The brand that closes every docs page title. */
export const DOCS_TITLE_SUFFIX = "SurrealDB Docs";

/** The language the docs are written in, and the `lang` of every page. */
export const DOCS_LANGUAGE = "en-GB";

/**
 * Longest title a search result shows in full. Titles longer than this lose
 * their optional middle segment; see `metaTitleCandidates`.
 */
export const META_TITLE_BUDGET = 60;

export interface MetaTitleParts {
    /** The page's own title, from its frontmatter. */
    title: string;
    /** The SDK, product or section the page sits in. */
    qualifier?: string;
    /** Whether the qualifier stays however long the title gets. */
    required: boolean;
    /** The folder the page sits in, for telling apart pages that share the rest. */
    detail?: string;
}

/**
 * Builds the document title, qualified by the SDK or section the page sits in.
 *
 * Short page titles repeat across the site - "Table", "Installation" and
 * "Authentication" each appear in many sections - so an unqualified title tells a
 * reader in their history, a search result or a stack of tabs nothing about which
 * one they have. The qualifier disambiguates it, and the brand says whose
 * documentation it is.
 *
 * Three forms are returned: `{page} | {qualifier} | SurrealDB Docs` in full,
 * the preferred one, and a detailed form that adds the folder the page sits
 * in, for two pages the full form leaves the same. A qualifier is left out
 * when the page title already says it, which is the case for a section's own
 * landing page ("JavaScript SDK").
 *
 * A search result shows about 60 characters, so the preferred form of a title
 * that would run past that drops its qualifier rather than its page name. A
 * required qualifier - the SDK on an SDK reference page - is kept at any
 * length, because it is the only part that tells those pages apart.
 */
export function metaTitleCandidates({ title, qualifier, required, detail }: MetaTitleParts): {
    preferred: string;
    full: string;
    detailed: string;
} {
    const says = (name: string) => title.toLowerCase().includes(name.trim().toLowerCase());
    const named = qualifier && !says(qualifier) ? qualifier : undefined;
    const short = `${title} | ${DOCS_TITLE_SUFFIX}`;
    const full = named ? `${title} | ${named} | ${DOCS_TITLE_SUFFIX}` : short;

    const folder = detail && !says(detail) && detail !== named ? detail : undefined;
    const qualifiers = [folder, named && !folder?.includes(named) ? named : undefined];
    const detailed = [title, ...qualifiers.filter(Boolean), DOCS_TITLE_SUFFIX].join(" | ");

    const preferred = !named || required || full.length <= META_TITLE_BUDGET ? full : short;

    return { preferred, full, detailed };
}

/** Longest description a search result shows in full. */
export const META_DESCRIPTION_BUDGET = 160;

/** Shortest description worth showing in place of the full one. */
const META_DESCRIPTION_FLOOR = 70;

/**
 * The `<meta name="description">` for a page: its frontmatter description, cut
 * back to whole sentences when it runs past what a search result shows.
 *
 * Only whole sentences are kept, and only when they still say enough, so a
 * description is never cut mid-sentence: one long sentence is left as written.
 * The frontmatter keeps the full text, which the search index and `llms.txt`
 * also read.
 */
export function metaDescription(description: string): string {
    if (description.length <= META_DESCRIPTION_BUDGET) return description;

    // A sentence ends at a full stop followed by a capital, as in
    // `generate-llms-txt.mjs`, so `.surql` and version numbers do not end one.
    const sentences = description.match(/.*?\.(?=\s+[A-Z])|.+$/g) ?? [];
    let lead = "";

    for (const sentence of sentences) {
        const next = `${lead}${sentence}`;

        if (next.trim().length > META_DESCRIPTION_BUDGET) break;

        lead = next;
    }

    lead = lead.trim();

    return lead.length >= META_DESCRIPTION_FLOOR ? lead : description;
}

/**
 * Builds the canonical URL for a page. Versioned SDK pages that
 * match the "latest" version are canonicalised to the unversioned path.
 */
export function buildCanonicalUrl(urlPathname: string): string {
    // const match = urlPathname.match(VERSIONED_SDK_PATTERN);

    // if (match) {
    //     const [, version, sdkName, rest = ""] = match;
    //     const config = versionedSdks[sdkName as keyof typeof versionedSdks];

    //     if (config && version === config.latest) {
    //         return `${BASE_URL}/sdk/${sdkName}${rest}`;
    //     }
    // }

    // `BASE_URL` already ends the path, so the docs root arrives here as "/" and
    // would declare `/docs/` canonical - a URL the server 308s away from, which
    // makes the page point at something that redirects. Anything with a real
    // path is unaffected; Vike never gives those a trailing slash.
    const path = urlPathname === "/" ? "" : urlPathname;

    return `${BASE_URL}${path}`;
}

export interface BreadcrumbItem {
    name: string;
    /** Absolute URL. Omitted only on the final crumb, per Google's schema rules. */
    item?: string;
}

/**
 * Builds a BreadcrumbList JSON-LD object from the page's ancestor trail.
 *
 * This used to be built from the sidebar's sections, which are the page's
 * siblings, not its ancestry - so a statements page declared a trail through
 * Clauses, Functions and Scripting, and no element except the first carried
 * the `item` URL Google requires. Search Console flagged every docs page.
 * The trail now comes from `resolveDataFromCollection`, which walks the real
 * ancestor chain, and every element except the last names its URL.
 */
export function buildBreadcrumbJsonLd(trail: BreadcrumbItem[]): Record<string, unknown> | null {
    if (!trail?.length) return null;

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            ...(crumb.item ? { item: crumb.item } : {}),
        })),
    };
}
