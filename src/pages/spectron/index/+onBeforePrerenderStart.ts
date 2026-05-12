import { prerenderCollectionUrls } from "~/utils/data";

export default function onBeforeRenderStart() {
    return prerenderCollectionUrls("spectron/index", "/spectron");
}
