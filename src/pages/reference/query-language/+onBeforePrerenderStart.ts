import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/query-language").map((entry) =>
        entry.slug === "" ? "/reference/query-language" : `/reference/query-language/${entry.slug}`,
    );
}
