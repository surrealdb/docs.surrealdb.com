import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
	return getCollection("doc-integrations").map((entry) =>
		entry.slug === "index" ? "/integrations" : `/integrations/${entry.slug}`,
	);
}
