import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "manage/schema-migration",
        "/manage/schema-migration",
    )) satisfies SitemapUrlsConfig;
