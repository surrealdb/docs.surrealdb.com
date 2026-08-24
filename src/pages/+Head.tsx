// https://vike.dev/Head

import "~/assets/styles/layers.scss";
import "@mantine/core/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@surrealdb/ui/styles.css";
import "@surrealdb/ui/fonts.css";
import "~/assets/styles/global.scss";
import "~/assets/styles/override.scss";

import { ColorSchemeScript } from "@mantine/core";
import { usePageContext } from "vike-react/usePageContext";
import FavIcon from "~/assets/img/favicon.svg";
import type { PageData } from "~/utils/data";
import { BASE_URL, buildBreadcrumbJsonLd, buildCanonicalUrl } from "~/utils/meta";

const DEFAULT_OG_IMAGE = `${BASE_URL}/thumbnail.jpg`;

export function Head() {
    const pageContext = usePageContext();
    const { urlPathname } = pageContext;
    const canonicalUrl = buildCanonicalUrl(urlPathname);

    // The docs root has no path segment to suffix, so its markdown lives at
    // `/docs/index.md` - matching how the apex site addresses its homepage.
    const markdownUrl = `${canonicalUrl.replace(/\/$/, "")}${
        urlPathname === "/" ? "/index.md" : ".md"
    }`;

    const breadcrumbItems = (pageContext.data as PageData)?.breadcrumbItems ?? [];
    const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

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
            {/* How an agent holding the HTML discovers the markdown rendering of
                this page. The same document is also served on this URL to a
                request sending `Accept: text/markdown` - see src/pages/+server.ts. */}
            <link
                rel="alternate"
                type="text/markdown"
                href={markdownUrl}
                title="Markdown version of this page"
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
