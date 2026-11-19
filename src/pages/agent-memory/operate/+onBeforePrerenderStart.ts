import { prerenderCollectionUrls } from "~/utils/data";

export default function onBeforeRenderStart() {
    return prerenderCollectionUrls("agent-memory/operate", "/agent-memory/operate");
}
