import type { VersionFetcher } from "./types";

/** crates.io requires a User-Agent that identifies the caller. */
const CRATES_IO_USER_AGENT = "surrealdb-docs (https://surrealdb.com/docs)";

export function createSurrealDbVersionFetcher(): VersionFetcher {
    return async () => {
        const res = await fetch("https://version.surrealdb.com");

        if (!res.ok) {
            return "unknown";
        }

        const version = (await res.text()).trim();
        return version || "unknown";
    };
}

export function createNuGetFetcher(packageName: string): VersionFetcher {
    return async () => {
        const res = await fetch(
            `https://api.nuget.org/v3/registration5-gz-semver2/${packageName.toLowerCase()}/index.json`,
        );
        const data = await res.json();
        return data?.items?.[0]?.upper ?? "unknown";
    };
}

export function createNpmFetcher(packageName: string): VersionFetcher {
    return async () => {
        const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
        const data = await res.json();
        return data?.version ?? "unknown";
    };
}

export function createPyPiFetcher(packageName: string): VersionFetcher {
    return async () => {
        const res = await fetch(`https://pypi.org/pypi/${packageName}/json`);
        const data = await res.json();
        return data?.info?.version ?? "unknown";
    };
}

/**
 * Latest stable version of a crate, from crates.io.
 *
 * `fallback` covers crates.io being unavailable. It is opt-in because a fallback
 * is only correct where the substitute tracks the same version as the crate, so
 * the caller has to assert that. Whatever it returns is normalised to the shape
 * crates.io uses, which carries no `v` prefix.
 */
export function createCratesIoFetcher(
    crateName: string,
    fallback?: VersionFetcher,
): VersionFetcher {
    return async () => {
        try {
            // crates.io rejects any request without a User-Agent identifying the caller.
            const res = await fetch(`https://crates.io/api/v1/crates/${crateName}`, {
                headers: { "User-Agent": CRATES_IO_USER_AGENT },
            });

            if (res.ok) {
                const data = await res.json();
                // `newest_version` is the most recently *published* version, so a patch
                // released against an older line reports lower than the current release.
                // `max_stable_version` is the highest stable version, which is what the
                // docs mean by "the latest version".
                const version = data?.crate?.max_stable_version;

                if (version) {
                    return version;
                }
            }
        } catch {
            // Fall through to the fallback below.
        }

        if (!fallback) {
            return "unknown";
        }

        const substitute = await fallback();
        return substitute === "unknown" ? substitute : substitute.replace(/^v/, "");
    };
}

export function createPackagistFetcher(vendor: string, packageName: string): VersionFetcher {
    return async () => {
        const res = await fetch(`https://repo.packagist.org/p2/${vendor}/${packageName}.json`);
        const data = await res.json();
        const versions = data?.packages?.[`${vendor}/${packageName}`];
        return versions?.[0]?.version ?? "unknown";
    };
}

export function createGoProxyFetcher(modulePath: string): VersionFetcher {
    return async () => {
        const res = await fetch(`https://proxy.golang.org/${modulePath}/@latest`);
        const data = await res.json();
        return data?.Version ?? "unknown";
    };
}

export function createMavenFetcher(groupId: string, artifactId: string): VersionFetcher {
    return async () => {
        // Maven Central's canonical metadata, rather than the search.maven.org Solr
        // index, whose `latestVersion` lags releases by as much as two major versions.
        const groupPath = groupId.replaceAll(".", "/");
        const res = await fetch(
            `https://repo1.maven.org/maven2/${groupPath}/${artifactId}/maven-metadata.xml`,
        );

        if (!res.ok) {
            return "unknown";
        }

        const xml = await res.text();
        // `<release>` is the latest non-snapshot release; `<latest>` can include one.
        const match =
            /<release>([^<]+)<\/release>/.exec(xml) ?? /<latest>([^<]+)<\/latest>/.exec(xml);
        return match?.[1]?.trim() || "unknown";
    };
}
