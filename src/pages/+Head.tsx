// https://vike.dev/Head

import "@mantine/core/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@surrealdb/ui/styles.css";
import "~/assets/styles/global.scss";

import { ColorSchemeScript } from "@mantine/core";
import { FontLinks } from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";
import FavIcon from "~/assets/img/favicon.svg";
import type { PageData } from "~/utils/data";
import { BASE_URL, buildBreadcrumbJsonLd, buildCanonicalUrl } from "~/utils/meta";

const DEFAULT_OG_IMAGE = `${BASE_URL}/thumbnail.jpg`;

function resolveHeadSetting<T>(pageContext: unknown, name: string): T | undefined {
    const ctx = pageContext as {
        config?: Record<string, unknown>;
        _configViaHook?: Record<string, unknown>;
    };
    const viaHook = ctx._configViaHook?.[name];
    if (viaHook !== undefined) return viaHook as T;
    return ctx.config?.[name] as T | undefined;
}

export function Head() {
    const pageContext = usePageContext();
    const { urlPathname } = pageContext;
    const canonicalUrl = buildCanonicalUrl(urlPathname);

    const navigation = (pageContext.data as PageData)?.navigation ?? [];
    const breadcrumbJsonLd = buildBreadcrumbJsonLd(navigation);

    const title = resolveHeadSetting<string>(pageContext, "title");
    const description = resolveHeadSetting<string>(pageContext, "description");

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
                property="og:site_name"
                content="SurrealDB Docs"
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
            <meta
                name="twitter:url"
                content={canonicalUrl}
            />
            {title && (
                <meta
                    name="twitter:title"
                    content={title}
                />
            )}
            {description && (
                <meta
                    name="twitter:description"
                    content={description}
                />
            )}
            <meta
                name="twitter:image"
                content={DEFAULT_OG_IMAGE}
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
