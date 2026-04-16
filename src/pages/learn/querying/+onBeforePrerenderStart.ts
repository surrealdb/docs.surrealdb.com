import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/querying").map((entry) =>
        entry.slug === "" ? "/learn/querying" : `/learn/querying/${entry.slug}`,
    );
}
