import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/cli").map((entry) =>
        entry.slug === "" ? "/reference/cli" : `/reference/cli/${entry.slug}`,
    );
}
