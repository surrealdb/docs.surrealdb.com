import { PRODUCT_META, type ProductId } from "~/utils/product";

export const BASE_URL = "https://surrealdb.com/docs";

/**
 * Builds the document title, qualified by the section the page sits in.
 *
 * Short page titles repeat across the site - "Overview", "Installation" and
 * "Authentication" each appear in many sections - so an unqualified title tells a
 * reader in their history, a search result or a stack of tabs nothing about which
 * one they have. The deepest section name disambiguates it.
 *
 * The section is dropped when it would only repeat the page title, which is the
 * case for a section's own landing page.
 *
 * `productLabel` replaces the product's own label for a page tree that shares a
 * product without being it (see `getProductLabelOverride`). That label then
 * names the whole tree, so it is not repeated: a section called the label is
 * dropped, and a title that is the label stands alone. "Versioning" in the
 * Agent Filesystem docs reads "Versioning | Agent Filesystem", not
 * "Versioning | Agent Filesystem | Agent Filesystem". Titles without an
 * override are built as they always were.
 */
export function getSuffixedMetaTitle(
    title: string,
    productId: ProductId = "surrealdb",
    section?: string,
    productLabel?: string,
) {
    const product = productLabel ?? PRODUCT_META[productId].label;
    const matches = (a: string | undefined, b: string) =>
        a?.trim().toLowerCase() === b.trim().toLowerCase();
    const repeatsTitle = matches(section, title);
    const repeatsLabel = productLabel !== undefined && matches(section, productLabel);
    const qualifier = section && !repeatsTitle && !repeatsLabel ? ` | ${section}` : "";

    if (productLabel !== undefined && !qualifier && matches(title, productLabel)) {
        return title;
    }

    return `${title}${qualifier} | ${product}`;
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
