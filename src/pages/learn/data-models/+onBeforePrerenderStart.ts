import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/data-models").map((entry) =>
        entry.slug === "" ? "/learn/data-models" : `/learn/data-models/${entry.slug}`,
    );
}
