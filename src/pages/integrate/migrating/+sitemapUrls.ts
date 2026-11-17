import type { SitemapUrlsConfig } from "vike-sitemap-generator";
import { collectionSitemapUrls } from "~/utils/sitemap";

export default (() =>
    collectionSitemapUrls(
        "integrate/migrating",
        "/integrate/migrating",
    )) satisfies SitemapUrlsConfig;
