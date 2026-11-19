import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("integrate/embedding").map((entry) =>
        entry.slug === "" ? "/integrate/embedding" : `/integrate/embedding/${entry.slug}`,
    );
}
