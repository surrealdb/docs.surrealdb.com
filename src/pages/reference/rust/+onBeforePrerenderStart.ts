import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/rust").map((entry) =>
        entry.slug === "" ? "/reference/rust" : `/reference/rust/${entry.slug}`,
    );
}
