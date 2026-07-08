import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/javascript").map((entry) =>
        entry.slug === "" ? "/reference/javascript" : `/reference/javascript/${entry.slug}`,
    );
}
