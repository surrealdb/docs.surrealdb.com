import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("operate/upgrading").map((entry) =>
        entry.slug === "" ? "/operate/upgrading" : `/operate/upgrading/${entry.slug}`,
    );
}
