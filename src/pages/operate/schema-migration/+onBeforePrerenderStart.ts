import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("operate/schema-migration").map((entry) =>
        entry.slug === "" ? "/operate/schema-migration" : `/operate/schema-migration/${entry.slug}`,
    );
}
