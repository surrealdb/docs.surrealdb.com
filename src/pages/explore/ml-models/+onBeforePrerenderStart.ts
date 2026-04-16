import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("explore/ml-models").map((entry) =>
        entry.slug === "" ? "/explore/ml-models" : `/explore/ml-models/${entry.slug}`,
    );
}
