import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
	return getCollection("doc-surrealist").map((entry) =>
		entry.slug === "index" ? "/surrealist" : `/surrealist/${entry.slug}`,
	);
}
