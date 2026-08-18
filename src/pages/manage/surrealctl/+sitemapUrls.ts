import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls("manage/surrealctl", "/manage/surrealctl")) satisfies SitemapUrlsConfig;
