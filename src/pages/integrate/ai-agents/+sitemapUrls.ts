import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "integrate/ai-agents",
        "/integrate/ai-agents",
    )) satisfies SitemapUrlsConfig;
