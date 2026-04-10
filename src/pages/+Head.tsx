// https://vike.dev/Head

import "@mantine/core/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@surrealdb/ui/styles.css";
import "~/assets/styles/global.scss";

import { ColorSchemeScript } from "@mantine/core";
import { FontLinks } from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";
import FavIcon from "~/assets/img/favicon.svg";
import { BASE_URL, buildBreadcrumbJsonLd, buildCanonicalUrl } from "~/utils/meta";
import type { SidebarItem } from "~/utils/sidebar";

const DEFAULT_OG_IMAGE = `${BASE_URL}/thumbnail.jpg`;

export function Head() {
    const pageContext = usePageContext();
    const { urlPathname } = pageContext;
    const canonicalUrl = buildCanonicalUrl(urlPathname);

    const sidebar = (pageContext.data as { sidebar?: SidebarItem[] } | undefined)?.sidebar;
    const breadcrumbJsonLd = sidebar ? buildBreadcrumbJsonLd(sidebar, urlPathname) : null;

    return (
        <>
            <link
                rel="icon"
                href={FavIcon}
            />
            <ColorSchemeScript defaultColorScheme="dark" />
            <meta
                name="robots"
                content="index, follow"
            />
            <link
                rel="canonical"
                href={canonicalUrl}
            />
            <meta
                property="og:url"
                content={canonicalUrl}
            />
            <meta
                property="og:type"
                content="article"
            />
            <meta
                property="og:image"
                content={DEFAULT_OG_IMAGE}
            />
            <meta
                name="twitter:card"
                content="summary_large_image"
            />
            <meta
                name="twitter:site"
                content="@surrealdb"
            />
            <script
                src="/analytics.js"
                defer
            />
            <FontLinks />
            {breadcrumbJsonLd && (
                <script
                    type="application/ld+json"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script content
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(breadcrumbJsonLd),
                    }}
                />
            )}
        </>
    );
}
