import { getCollectionFilePaths } from "~/lib/content";

export default function onBeforeRenderStart() {
    return getCollectionFilePaths("doc-tutorials").map((path) =>
        path === "index" ? "/tutorials" : `/tutorials/${path}`,
    );
}
