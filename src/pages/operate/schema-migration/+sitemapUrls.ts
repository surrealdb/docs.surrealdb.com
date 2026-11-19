import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "operate/schema-migration",
        "/operate/schema-migration",
    )) satisfies SitemapUrlsConfig;
