import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import { DEFAULT_META_DESCRIPTION, DEFAULT_META_TITLE } from "~/utils/meta";

export default {
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    extends: [vikeReact],
    prerender: true,
    passToClient: ["llms", "sdkVersions"],
    meta: {
        Page: {
            env: { client: true, server: true },
        },
    },
} satisfies Config;
