import { apiRequestCache } from "~/lib/cache/file-cache";
import { invokeFetcherWithTimeout, sdkFetcherRegistry } from "./registry";
import type { SdkVersionMap } from "./types";

export type { SdkVersionMap } from "./types";

export async function fetchAllSdkVersions(): Promise<SdkVersionMap> {
    return apiRequestCache.getOrSet("sdk-versions", async () => {
        const entries = await Promise.all(
            Object.keys(sdkFetcherRegistry).map(async (sdk) => {
                try {
                    const version = await invokeFetcherWithTimeout(sdk);

                    return [sdk, version] as const;
                } catch {
                    return [sdk, "unknown"] as const;
                }
            }),
        );

        return Object.fromEntries(entries);
    });
}
