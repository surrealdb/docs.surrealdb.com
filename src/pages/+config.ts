import type { Config } from "vike/types";
import vikeContentCollectionConfig from "vike-content-collection/config";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";
import vikeSitemapConfig from "vike-sitemap-generator/config";
import { DEFAULT_META_DESCRIPTION, DEFAULT_META_TITLE } from "~/utils/meta";

export default {
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    extends: [vikeReact, vikeContentCollectionConfig, vikePhoton, vikeSitemapConfig],
    prerender: true,
    passToClient: ["llms", "sdkVersions"],
    meta: {
        Page: {
            env: { client: true, server: true },
        },
        data: {
            env: { server: true, client: false },
        },
        sitemap: {
            env: { server: true, client: false },
        },
        Content: {
            env: { server: true, client: false },
        },
    },
} satisfies Config;
