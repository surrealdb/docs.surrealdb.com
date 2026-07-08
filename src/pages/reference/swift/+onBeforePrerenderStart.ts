import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/swift").map((entry) =>
        entry.slug === "" ? "/reference/swift" : `/reference/swift/${entry.slug}`,
    );
}
