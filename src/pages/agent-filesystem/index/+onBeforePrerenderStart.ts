import { prerenderCollectionUrls } from "~/utils/data";

export default function onBeforeRenderStart() {
    return prerenderCollectionUrls("agent-filesystem/index", "/agent-filesystem");
}
