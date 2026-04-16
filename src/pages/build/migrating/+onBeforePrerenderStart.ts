import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("build/migrating").map((entry) =>
        entry.slug === "" ? "/build/migrating" : `/build/migrating/${entry.slug}`,
    );
}
