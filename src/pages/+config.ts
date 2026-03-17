import type { Config } from "vike/types";
import vikeContentCollectionConfig from "vike-content-collection/config";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";
import { DEFAULT_META_DESCRIPTION, DEFAULT_META_TITLE } from "~/utils/meta";

export default {
	title: DEFAULT_META_TITLE,
	description: DEFAULT_META_DESCRIPTION,
	extends: [vikeReact, vikeContentCollectionConfig, vikePhoton],
	prerender: true,
	passToClient: ["llms", "sdkVersions"],
	meta: {
		Page: {
			env: { client: false, server: true },
		},
		data: {
			env: { client: false, server: true },
		},
	},
} satisfies Config;
