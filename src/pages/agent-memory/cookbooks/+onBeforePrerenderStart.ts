import { prerenderCollectionUrls } from "~/utils/data";

export default function onBeforeRenderStart() {
    return prerenderCollectionUrls("agent-memory/cookbooks", "/agent-memory/cookbooks");
}
