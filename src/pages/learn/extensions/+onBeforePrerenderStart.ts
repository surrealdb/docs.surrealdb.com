import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/extensions").map((entry) =>
        entry.slug === "" ? "/learn/extensions" : `/learn/extensions/${entry.slug}`,
    );
}
