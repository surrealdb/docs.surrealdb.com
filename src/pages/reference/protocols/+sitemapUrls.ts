import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "reference/protocols",
        "/reference/protocols",
    )) satisfies SitemapUrlsConfig;
