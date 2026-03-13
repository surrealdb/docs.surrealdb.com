import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("doc-cloud").map((entry) =>
        entry.slug === "index" ? "/cloud" : `/cloud/${entry.slug}`,
    );
}
