import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/tutorials").map((entry) =>
        entry.slug === "" ? "/learn/tutorials" : `/learn/tutorials/${entry.slug}`,
    );
}
