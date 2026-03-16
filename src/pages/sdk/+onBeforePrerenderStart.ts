import { getCollection } from "vike-content-collection";
import {
    getCollectionIdForVersion,
    type Sdk,
    type SdkVersionConfig,
    sdks,
    versionedSdks,
} from "~/content/config";

export default function onBeforeRenderStart() {
    const latestPaths = sdks.flatMap((sdk) =>
        getCollection(`doc-sdk-${sdk}`)
            .map((entry) => `/sdk/${sdk}/${entry.slug}`)
            .concat([`/sdk/${sdk}`]),
    );

    const versionedPaths = (Object.entries(versionedSdks) as [Sdk, SdkVersionConfig][]).flatMap(
        ([sdk, config]) => {
            const allVersions = [config.latest, ...config.versions];
            return allVersions.flatMap((version) => {
                const id = getCollectionIdForVersion(sdk, version);
                return getCollection(id)
                    .map((entry) => `/${version}/sdk/${sdk}/${entry.slug}`)
                    .concat([`/${version}/sdk/${sdk}`]);
            });
        },
    );

    return [...latestPaths, ...versionedPaths];
}
