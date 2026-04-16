import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("build/integrations").map((entry) =>
        entry.slug === "" ? "/build/integrations" : `/build/integrations/${entry.slug}`,
    );
}
