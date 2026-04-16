import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/rest-api").map((entry) =>
        entry.slug === "" ? "/reference/rest-api" : `/reference/rest-api/${entry.slug}`,
    );
}
