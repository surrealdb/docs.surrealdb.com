import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("libraries").map((entry) =>
        entry.slug === "" ? "/libraries" : `/libraries/${entry.slug}`,
    );
}
