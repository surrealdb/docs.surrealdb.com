import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("doc-surrealml").map((entry) =>
        entry.slug === "index" ? "/surrealml" : `/surrealml/${entry.slug}`,
    );
}
