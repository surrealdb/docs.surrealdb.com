import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/java").map((entry) =>
        entry.slug === "" ? "/reference/java" : `/reference/java/${entry.slug}`,
    );
}
