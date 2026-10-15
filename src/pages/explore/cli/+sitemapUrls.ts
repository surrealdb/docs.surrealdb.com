import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls("explore/cli", "/explore/cli")) satisfies SitemapUrlsConfig;
