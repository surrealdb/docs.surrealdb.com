import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
	return getCollection("doc-surrealkv").map((entry) =>
		entry.slug === "index" ? "/surrealkv" : `/surrealkv/${entry.slug}`,
	);
}
