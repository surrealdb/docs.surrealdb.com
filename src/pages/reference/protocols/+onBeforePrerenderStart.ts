import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/protocols").map((entry) =>
        entry.slug === "" ? "/reference/protocols" : `/reference/protocols/${entry.slug}`,
    );
}
