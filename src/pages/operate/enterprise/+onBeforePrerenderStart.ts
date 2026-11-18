import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("operate/enterprise").map((entry) =>
        entry.slug === "" ? "/operate/enterprise" : `/operate/enterprise/${entry.slug}`,
    );
}
