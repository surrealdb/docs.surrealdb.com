import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("build/deployment").map((entry) =>
        entry.slug === "" ? "/build/deployment" : `/build/deployment/${entry.slug}`,
    );
}
