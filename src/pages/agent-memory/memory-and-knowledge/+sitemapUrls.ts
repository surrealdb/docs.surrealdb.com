import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "agent-memory/memory-and-knowledge",
        "/agent-memory/memory-and-knowledge",
    )) satisfies SitemapUrlsConfig;
