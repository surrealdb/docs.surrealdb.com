import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-cloud").map((path) =>
        path === "index" ? "/cloud" : `/cloud/${path}`,
    );
}
