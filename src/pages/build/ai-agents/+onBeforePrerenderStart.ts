import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("build/ai-agents").map((entry) =>
        entry.slug === "" ? "/build/ai-agents" : `/build/ai-agents/${entry.slug}`,
    );
}
