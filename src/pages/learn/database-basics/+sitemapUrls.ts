import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "learn/database-basics",
        "/learn/database-basics",
    )) satisfies SitemapUrlsConfig;
