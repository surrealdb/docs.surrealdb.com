import {
    createCratesIoFetcher,
    createGoProxyFetcher,
    createMavenFetcher,
    createNpmFetcher,
    createNuGetFetcher,
    createPackagistFetcher,
    createPyPiFetcher,
    createSurrealDbVersionFetcher,
} from "./fetchers";
import type { VersionFetcher } from "./types";

export const sdkFetcherRegistry: Record<string, VersionFetcher> = {
    surrealdb: createSurrealDbVersionFetcher(),
    ".net": createNuGetFetcher("SurrealDb.Net"),
    php: createPackagistFetcher("surrealdb", "surrealdb.php"),
    javascript: createNpmFetcher("surrealdb"),
    python: createPyPiFetcher("surrealdb"),
    rust: createCratesIoFetcher("surrealdb"),
    golang: createGoProxyFetcher("github.com/surrealdb/surrealdb.go"),
    java: createMavenFetcher("com.surrealdb", "surrealdb"),
};

export async function invokeFetcherWithTimeout(
    sdkName: string,
    ...args: Parameters<VersionFetcher>
): Promise<ReturnType<VersionFetcher>> {
    const fetcher = sdkFetcherRegistry[sdkName];

    if (!fetcher) {
        throw new Error(`SDK fetcher not found for: ${sdkName}`);
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Fetcher timed out after 1s")), 1000),
    );

    return Promise.race([fetcher(...args), timeoutPromise]) as ReturnType<VersionFetcher>;
}
