import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-integrations")
        .map((path) => `/integrations/${path}`)
        .concat(["/integrations"]);
}
