import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("operate/observability").map((entry) =>
        entry.slug === "" ? "/operate/observability" : `/operate/observability/${entry.slug}`,
    );
}
