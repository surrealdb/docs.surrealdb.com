import type { PageContext } from "vike/types";
import { versionedSdks } from "~/content/config";

const validSdks = Object.keys(versionedSdks);

export default function route({ urlPathname }: PageContext) {
    const parts = urlPathname.split("/");
    const version = parts[1];
    const sdk = parts[3];

    if (!version || !sdk) return false;
    if (!validSdks.includes(sdk)) return false;

    const config = versionedSdks[sdk as keyof typeof versionedSdks];
    if (!config) return false;

    const allVersions = [config.latest, ...config.versions];
    if (!allVersions.includes(version)) return false;

    return {
        routeParams: {
            sdkVersion: version,
            sdk,
        },
    };
}
