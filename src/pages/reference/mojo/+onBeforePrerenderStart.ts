import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/mojo").map((entry) =>
        entry.slug === "" ? "/reference/mojo" : `/reference/mojo/${entry.slug}`,
    );
}
