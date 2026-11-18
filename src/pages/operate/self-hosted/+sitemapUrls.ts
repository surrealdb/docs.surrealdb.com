import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "operate/self-hosted",
        "/operate/self-hosted",
    )) satisfies SitemapUrlsConfig;
