import { prerenderCollectionUrls } from "~/utils/data";

export default function onBeforeRenderStart() {
    return prerenderCollectionUrls(
        "agent-memory/memory-and-knowledge",
        "/agent-memory/memory-and-knowledge",
    );
}
