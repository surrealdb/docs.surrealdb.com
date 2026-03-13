import { getCollection } from "vike-content-collection";
import { sdks } from "~/content/config";

export default function onBeforeRenderStart() {
    return sdks.flatMap((sdk) =>
        getCollection(`doc-sdk-${sdk}`)
            .map((entry) => `/sdk/${sdk}/${entry.slug}`)
            .concat([`/sdk/${sdk}`]),
    );
}
