import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/context").map((entry) =>
        entry.slug === "" ? "/learn/context" : `/learn/context/${entry.slug}`,
    );
}
