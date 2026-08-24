import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "agent-memory/cookbooks",
        "/agent-memory/cookbooks",
    )) satisfies SitemapUrlsConfig;
