import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("spectron").map((entry) =>
        entry.slug === "" ? "/spectron" : `/spectron/${entry.slug}`,
    );
}
