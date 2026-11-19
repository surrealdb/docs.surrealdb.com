import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("integrate/migrating").map((entry) =>
        entry.slug === "" ? "/integrate/migrating" : `/integrate/migrating/${entry.slug}`,
    );
}
