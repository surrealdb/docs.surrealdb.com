import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("learn/database-basics").map((entry) =>
        entry.slug === "" ? "/learn/database-basics" : `/learn/database-basics/${entry.slug}`,
    );
}
