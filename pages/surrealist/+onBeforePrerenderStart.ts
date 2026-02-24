import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-surrealist").map((path) =>
        path === "index" ? "/surrealist" : `/surrealist/${path}`,
    );
}
