import {
    createCratesIoFetcher,
    createGitHubFetcher,
    createGoProxyFetcher,
    createMavenFetcher,
    createNpmFetcher,
    createNuGetFetcher,
    createPackagistFetcher,
    createPyPiFetcher,
} from "./fetchers";
import type { VersionFetcher } from "./types";

export const sdkFetcherRegistry: Record<string, VersionFetcher> = {
    surrealdb: createGitHubFetcher("surrealdb", "surrealdb"),
    ".net": createNuGetFetcher("SurrealDb.Net"),
    php: createPackagistFetcher("surrealdb", "surrealdb.php"),
    javascript: createNpmFetcher("surrealdb"),
    python: createPyPiFetcher("surrealdb"),
    rust: createCratesIoFetcher("surrealdb"),
    golang: createGoProxyFetcher("github.com/surrealdb/surrealdb.go"),
    java: createMavenFetcher("com.surrealdb", "surrealdb"),
};
