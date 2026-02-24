import { sdks } from "@content/config";
import { getCollectionFilePaths } from "@lib/content";

export default function onBeforeRenderStart() {
    return sdks.flatMap((sdk) =>
        getCollectionFilePaths(`doc-sdk-${sdk}`)
            .map((route) => `/sdk/${sdk}/${route}`)
            .concat([`/sdk/${sdk}`]),
    );
}
