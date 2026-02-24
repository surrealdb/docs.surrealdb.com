import { DEFAULT_META_DESCRIPTION, DEFAULT_META_TITLE } from "@util/meta";
import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
    title: DEFAULT_META_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    extends: [vikeReact],
    prerender: true,
    passToClient: ["llms"],
    meta: {
        Page: {
            env: { client: true, server: false },
        },
    },
} satisfies Config;
