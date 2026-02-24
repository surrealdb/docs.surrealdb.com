import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-surrealml").map((path) =>
        path === "index" ? "/surrealml" : `/surrealml/${path}`,
    );
}
