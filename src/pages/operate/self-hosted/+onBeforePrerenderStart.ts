import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("operate/self-hosted").map((entry) =>
        entry.slug === "" ? "/operate/self-hosted" : `/operate/self-hosted/${entry.slug}`,
    );
}
