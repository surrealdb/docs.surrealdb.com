import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("index")
        .filter((entry) => !entry.slug.includes("__category"))
        .map((entry) => (entry.slug === "" ? "/" : `/${entry.slug}`));
}
