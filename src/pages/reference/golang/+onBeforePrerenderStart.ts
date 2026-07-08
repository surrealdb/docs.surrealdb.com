import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/golang").map((entry) =>
        entry.slug === "" ? "/reference/golang" : `/reference/golang/${entry.slug}`,
    );
}
