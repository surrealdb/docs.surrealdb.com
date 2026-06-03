import type { NavSection } from "~/utils/navigation";
import { PRODUCT_META, type ProductId } from "~/utils/product";

export const DEFAULT_META_TITLE =
    "SurrealDB | The ultimate multi-model database for tomorrow's applications";
export const DEFAULT_META_DESCRIPTION =
    "SurrealDB is the ultimate database for tomorrow's serverless, jamstack, single-page, and traditional applications.";

export const BASE_URL = "https://surrealdb.com/docs";

export function getSuffixedMetaTitle(title: string, productId: ProductId = "surrealdb") {
    return `${title} | ${PRODUCT_META[productId].label}`;
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

    return `${BASE_URL}${urlPathname}`;
}

/**
 * Builds a BreadcrumbList JSON-LD object from sidebar data.
 * Returns `null` when no breadcrumb trail can be determined.
 */
export function buildBreadcrumbJsonLd(navigation: NavSection[]): Record<string, unknown> | null {
    if (!navigation?.length) return null;

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Docs",
                item: BASE_URL,
            },
            ...navigation.map((section, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: section.title,
            })),
        ],
    };
}
