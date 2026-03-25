import type { VersionFetcher } from "./types";

export function createGitHubFetcher(owner: string, repo: string): VersionFetcher {
    return async () => {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
        const data = await res.json();
        return data?.tag_name ?? "unknown";
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

export function createCratesIoFetcher(crateName: string): VersionFetcher {
    return async () => {
        const res = await fetch(`https://crates.io/api/v1/crates/${crateName}`);
        const data = await res.json();
        return data?.crate?.newest_version ?? "unknown";
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
        const res = await fetch(
            `https://search.maven.org/solrsearch/select?q=g:${groupId}+AND+a:${artifactId}&rows=1&wt=json`,
        );
        const data = await res.json();
        return data?.response?.docs?.[0]?.latestVersion ?? "unknown";
    };
}
