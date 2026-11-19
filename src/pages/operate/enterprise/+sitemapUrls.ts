import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls("operate/enterprise", "/operate/enterprise")) satisfies SitemapUrlsConfig;
