import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/spectron").map((entry) =>
        entry.slug === "" ? "/learn/spectron" : `/learn/spectron/${entry.slug}`,
    );
}
