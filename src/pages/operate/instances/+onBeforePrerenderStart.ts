import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("operate/instances").map((entry) =>
        entry.slug === "" ? "/operate/instances" : `/operate/instances/${entry.slug}`,
    );
}
