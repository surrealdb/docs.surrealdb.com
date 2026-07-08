import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/python").map((entry) =>
        entry.slug === "" ? "/reference/python" : `/reference/python/${entry.slug}`,
    );
}
