import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("explore/studio").map((entry) =>
        entry.slug === "" ? "/explore/studio" : `/explore/studio/${entry.slug}`,
    );
}
