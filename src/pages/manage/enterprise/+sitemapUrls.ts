import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls("manage/enterprise", "/manage/enterprise")) satisfies SitemapUrlsConfig;
