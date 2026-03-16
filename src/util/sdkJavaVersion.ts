/**
 * SDK Java versioning utilities
 * Only applies to Java SDK docs section
 */

export const SDK_JAVA_VERSIONS = ['latest', '2.x', '1.x'] as const;
export type SdkJavaVersion = (typeof SDK_JAVA_VERSIONS)[number];

export const SDK_JAVA_DOC_PATH = '/docs/sdk/java';

/**
 * Extract version from URL path
 * Returns 'latest' if no version is found
 */
export function getVersionFromPath(pathname: string): SdkJavaVersion {
    const versionMatch = pathname.match(/^\/docs\/(1\.x|2\.x)\/sdk\/java/);
    if (versionMatch) {
        return versionMatch[1] as SdkJavaVersion;
    }
    return 'latest';
}

/**
 * Check if a path is a Java SDK docs path
 */
export function isSdkJavaPath(pathname: string): boolean {
    return (
        pathname.startsWith('/docs/sdk/java') ||
        pathname.startsWith('/docs/1.x/sdk/java') ||
        pathname.startsWith('/docs/2.x/sdk/java')
    );
}

/**
 * Check if a path is a versioned Java SDK path (not latest)
 */
export function isVersionedSdkJavaPath(pathname: string): boolean {
    return (
        pathname.startsWith('/docs/1.x/sdk/java') ||
        pathname.startsWith('/docs/2.x/sdk/java')
    );
}

/**
 * Get the relative path within Java SDK docs (without version prefix)
 */
export function getSdkJavaRelativePath(pathname: string): string {
    const versionedMatch = pathname.match(
        /^\/docs\/(?:1\.x|2\.x)\/sdk\/java(.*)$/
    );
    if (versionedMatch) {
        return versionedMatch[1] || '/';
    }

    const latestMatch = pathname.match(/^\/docs\/sdk\/java(.*)$/);
    if (latestMatch) {
        return latestMatch[1] || '/';
    }

    return '/';
}

/**
 * Convert a Java SDK path to a versioned path
 */
export function toVersionedPath(
    pathname: string,
    version: SdkJavaVersion
): string {
    if (version === 'latest') {
        return pathname.replace(
            /^\/docs\/(?:1\.x|2\.x)\/sdk\/java/,
            '/docs/sdk/java'
        );
    }

    const relativePath = getSdkJavaRelativePath(pathname);
    return `/docs/${version}/sdk/java${relativePath === '/' ? '' : relativePath}`;
}
