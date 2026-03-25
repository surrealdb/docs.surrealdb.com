import type { SitemapPageConfig } from "vike-sitemap-generator";

export default {
    priority: 1.0,
    changefreq: "weekly",
    images: [
        {
            title: "SurrealDB Documentation",
            loc: "https://surrealdb.com/docs/thumbnail.jpg",
        },
    ],
} satisfies SitemapPageConfig;
