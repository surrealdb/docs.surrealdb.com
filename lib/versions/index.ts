import { apiRequestCache } from "@lib/cache/file-cache";
import { sdkFetcherRegistry } from "./registry";
import type { SdkVersionMap } from "./types";

export type { SdkVersionMap } from "./types";

export async function fetchAllSdkVersions(): Promise<SdkVersionMap> {
    return apiRequestCache.getOrSet("sdk-versions", async () => {
        const entries = await Promise.all(
            Object.entries(sdkFetcherRegistry).map(async ([name, fetcher]) => {
                try {
                    const version = await fetcher();
                    return [name, version] as const;
                } catch {
                    return [name, "unknown"] as const;
                }
            }),
        );

        return Object.fromEntries(entries);
    });
}
