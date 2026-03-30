import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/security").map((entry) =>
        entry.slug === "" ? "/learn/security" : `/learn/security/${entry.slug}`,
    );
}
