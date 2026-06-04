import { prerenderCollectionUrls } from "~/utils/data";

export default function onBeforeRenderStart() {
    return prerenderCollectionUrls("spectron/agent-memory", "/spectron/agent-memory");
}
