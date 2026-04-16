import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("build/embedding").map((entry) =>
        entry.slug === "" ? "/build/embedding" : `/build/embedding/${entry.slug}`,
    );
}
