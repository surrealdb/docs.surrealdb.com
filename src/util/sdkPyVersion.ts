/**
 * SDK Python versioning utilities
 * Only applies to Python SDK docs section
 */

export const SDK_PY_VERSIONS = ['latest', '2.x', '1.x'] as const;
export type SdkPyVersion = (typeof SDK_PY_VERSIONS)[number];

export const SDK_PY_DOC_PATH = '/docs/sdk/python';

/**
 * Extract version from URL path
 * Returns 'latest' if no version is found
 */
export function getVersionFromPath(pathname: string): SdkPyVersion {
    const versionMatch = pathname.match(/^\/docs\/(1\.x|2\.x)\/sdk\/python/);
    if (versionMatch) {
        return versionMatch[1] as SdkPyVersion;
    }
    return 'latest';
}

/**
 * Check if a path is a Python SDK docs path
 */
export function isSdkPyPath(pathname: string): boolean {
    return (
        pathname.startsWith('/docs/sdk/python') ||
        pathname.startsWith('/docs/1.x/sdk/python') ||
        pathname.startsWith('/docs/2.x/sdk/python')
    );
}

/**
 * Check if a path is a versioned Python SDK path (not latest)
 */
export function isVersionedSdkPyPath(pathname: string): boolean {
    return (
        pathname.startsWith('/docs/1.x/sdk/python') ||
        pathname.startsWith('/docs/2.x/sdk/python')
    );
}

/**
 * Get the relative path within Python SDK docs (without version prefix)
 */
export function getSdkPyRelativePath(pathname: string): string {
    const versionedMatch = pathname.match(
        /^\/docs\/(?:1\.x|2\.x)\/sdk\/python(.*)$/
    );
    if (versionedMatch) {
        return versionedMatch[1] || '/';
    }

    const latestMatch = pathname.match(/^\/docs\/sdk\/python(.*)$/);
    if (latestMatch) {
        return latestMatch[1] || '/';
    }

    return '/';
}

/**
 * Convert a Python SDK path to a versioned path
 */
export function toVersionedPath(
    pathname: string,
    version: SdkPyVersion
): string {
    if (version === 'latest') {
        return pathname.replace(
            /^\/docs\/(?:1\.x|2\.x)\/sdk\/python/,
            '/docs/sdk/python'
        );
    }

    const relativePath = getSdkPyRelativePath(pathname);
    return `/docs/${version}/sdk/python${relativePath === '/' ? '' : relativePath}`;
}
