import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
	return getCollection("doc-surrealdb").map((entry) =>
		entry.slug === "index" ? "/surrealdb" : `/surrealdb/${entry.slug}`,
	);
}
