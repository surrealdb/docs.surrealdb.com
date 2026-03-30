import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("explore/surrealist").map((entry) =>
        entry.slug === "" ? "/explore/surrealist" : `/explore/surrealist/${entry.slug}`,
    );
}
