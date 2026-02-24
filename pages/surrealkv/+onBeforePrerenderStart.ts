import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-surrealkv").map((path) =>
        path === "index" ? "/surrealkv" : `/surrealkv/${path}`,
    );
}
