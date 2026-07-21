import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/kotlin").map((entry) =>
        entry.slug === "" ? "/reference/kotlin" : `/reference/kotlin/${entry.slug}`,
    );
}
