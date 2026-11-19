import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("integrate/integrations").map((entry) =>
        entry.slug === "" ? "/integrate/integrations" : `/integrate/integrations/${entry.slug}`,
    );
}
