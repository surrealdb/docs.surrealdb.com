import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/php").map((entry) =>
        entry.slug === "" ? "/reference/php" : `/reference/php/${entry.slug}`,
    );
}
