import { prerenderCollectionUrls } from "~/utils/data";

export default function onBeforeRenderStart() {
    return prerenderCollectionUrls("agent-memory/integrations", "/agent-memory/integrations");
}
