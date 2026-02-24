import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-surrealql").map((path) =>
        path === "index" ? "/surrealql" : `/surrealql/${path}`,
    );
}
