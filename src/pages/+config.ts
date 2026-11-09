import type { Config } from "vike/types";
import vikeContentCollectionConfig from "vike-content-collection/config";
import vikeReact from "vike-react/config";
import vikeSitemapConfig from "vike-sitemap-generator/config";

export default {
    title: "SurrealDB | The ultimate multi-model database for tomorrow's applications",
    description:
        "SurrealDB is the ultimate database for tomorrow's serverless, jamstack, single-page, and traditional applications.",
    extends: [vikeReact, vikeContentCollectionConfig, vikeSitemapConfig],
    prerender: false,
    passToClient: ["sdkVersions"],
    server: true,
    ssr: true,
    // Browsers may keep a rendered page for 30 minutes. Without this Vike sends
    // `no-store, max-age=0`, which the Cloudflare Worker passes through, so
    // every page was fetched afresh and the back button could not restore one
    // instantly. On Vercel the apex project's catch-all header (5 minutes)
    // replaced it. There is deliberately no `s-maxage`: the apex Worker's edge
    // cache is keyed to its own deploys, not this app's, so a cached page could
    // outlive the hashed assets a docs deploy replaces. Vike forces `no-store`
    // on 5xx responses whatever this says.
    cacheControl: "public, max-age=1800",
    meta: {
        Page: {
            env: { server: true, client: true },
        },
        data: {
            env: { server: true, client: false },
        },
        sitemap: {
            env: { config: true, server: true, client: false },
        },
        sitemapUrls: {
            env: { config: true, server: true },
        },
        Content: {
            env: { server: true, client: false },
        },
    },
} satisfies Config;
