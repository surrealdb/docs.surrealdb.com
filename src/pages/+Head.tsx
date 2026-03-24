// https://vike.dev/Head

import "@mantine/core/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@surrealdb/ui/styles.css";
import "~/assets/styles/global.scss";
import "~/assets/styles/markdown.scss";

import { ColorSchemeScript } from "@mantine/core";
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

    const fontUrl =
        "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap";
    return (
        <>
            <link
                rel="icon"
                href={FavIcon}
            />
            <ColorSchemeScript defaultColorScheme="auto" />
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
            <link
                rel="preconnect"
                href="https://fonts.googleapis.com"
            />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                rel="stylesheet"
                href={fontUrl}
            />
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
