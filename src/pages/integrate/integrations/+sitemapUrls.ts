import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "integrate/integrations",
        "/integrate/integrations",
    )) satisfies SitemapUrlsConfig;
