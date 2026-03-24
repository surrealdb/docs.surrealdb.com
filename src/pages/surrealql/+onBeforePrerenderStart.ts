import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("doc-surrealql").map((entry) =>
        entry.slug === "index" ? "/surrealql" : `/surrealql/${entry.slug}`,
    );
}
