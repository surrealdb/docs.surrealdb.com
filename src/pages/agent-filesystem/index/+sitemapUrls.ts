import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "agent-filesystem/index",
        "/agent-filesystem",
    )) satisfies SitemapUrlsConfig;
