import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("explore/tutorials").map((entry) =>
        entry.slug === "" ? "/explore/tutorials" : `/explore/tutorials/${entry.slug}`,
    );
}
