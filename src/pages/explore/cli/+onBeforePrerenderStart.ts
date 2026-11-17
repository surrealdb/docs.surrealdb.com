import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("explore/cli").map((entry) =>
        entry.slug === "" ? "/explore/cli" : `/explore/cli/${entry.slug}`,
    );
}
