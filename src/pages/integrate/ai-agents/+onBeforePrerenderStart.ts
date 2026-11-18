import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("integrate/ai-agents").map((entry) =>
        entry.slug === "" ? "/integrate/ai-agents" : `/integrate/ai-agents/${entry.slug}`,
    );
}
