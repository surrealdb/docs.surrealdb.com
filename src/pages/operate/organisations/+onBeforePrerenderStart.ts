import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("operate/organisations").map((entry) =>
        entry.slug === "" ? "/operate/organisations" : `/operate/organisations/${entry.slug}`,
    );
}
