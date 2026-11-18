import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/studio").map((entry) =>
        entry.slug === "" ? "/reference/studio" : `/reference/studio/${entry.slug}`,
    );
}
