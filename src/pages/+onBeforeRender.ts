import { fetchAllSdkVersions } from "~/lib/versions";

export async function onBeforeRender() {
    const [sdkVersions] = await Promise.all([fetchAllSdkVersions()]);

    return {
        pageContext: {
            sdkVersions,
        },
    };
}
