import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-surrealdb").map((path) =>
        path === "index" ? "/surrealdb" : `/surrealdb/${path}`,
    );
}
