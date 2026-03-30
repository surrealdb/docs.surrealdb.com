import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/schema-management").map((entry) =>
        entry.slug === "" ? "/learn/schema-management" : `/learn/schema-management/${entry.slug}`,
    );
}
