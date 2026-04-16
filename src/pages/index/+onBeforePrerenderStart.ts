import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("index").map((entry) => (entry.slug === "" ? "/" : `/${entry.slug}`));
}
