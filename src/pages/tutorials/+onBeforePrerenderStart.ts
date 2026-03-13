import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
	return getCollection("doc-tutorials").map((entry) =>
		entry.slug === "index" ? "/tutorials" : `/tutorials/${entry.slug}`,
	);
}
