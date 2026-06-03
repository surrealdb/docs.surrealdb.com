import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "learn/schema-management",
        "/learn/schema-management",
    )) satisfies SitemapUrlsConfig;
