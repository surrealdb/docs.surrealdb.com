/**
 * SDK JavaScript versioning utilities
 * Only applies to JavaScript SDK docs section
 */

export const SDK_JS_VERSIONS = ['latest', '2.x', '1.x'] as const;
export type SdkJsVersion = (typeof SDK_JS_VERSIONS)[number];

export const SDK_JS_DOC_PATH = '/docs/sdk/javascript';

/**
 * Extract version from URL path
 * Returns 'latest' if no version is found
 */
export function getVersionFromPath(pathname: string): SdkJsVersion {
    // Match /docs/1.x/sdk/javascript/** or /docs/2.x/sdk/javascript/**
    const versionMatch = pathname.match(/^\/docs\/(1\.x|2\.x)\/sdk\/javascript/);
    if (versionMatch) {
        return versionMatch[1] as SdkJsVersion;
    }
    return 'latest';
}

/**
 * Check if a path is a JS SDK docs path
 */
export function isSdkJsPath(pathname: string): boolean {
    return (
        pathname.startsWith('/docs/sdk/javascript') ||
        pathname.startsWith('/docs/1.x/sdk/javascript') ||
        pathname.startsWith('/docs/2.x/sdk/javascript')
    );
}

/**
 * Check if a path is a versioned JS SDK path (not latest)
 */
export function isVersionedSdkJsPath(pathname: string): boolean {
    return (
        pathname.startsWith('/docs/1.x/sdk/javascript') ||
        pathname.startsWith('/docs/2.x/sdk/javascript')
    );
}

/**
 * Get the relative path within JS SDK docs (without version prefix)
 */
export function getSdkJsRelativePath(pathname: string): string {
    // Handle versioned paths: /docs/1.x/sdk/javascript/** or /docs/2.x/sdk/javascript/**
    const versionedMatch = pathname.match(
        /^\/docs\/(?:1\.x|2\.x)\/sdk\/javascript(.*)$/
    );
    if (versionedMatch) {
        return versionedMatch[1] || '/';
    }

    // Handle latest paths: /docs/sdk/javascript/**
    const latestMatch = pathname.match(/^\/docs\/sdk\/javascript(.*)$/);
    if (latestMatch) {
        return latestMatch[1] || '/';
    }

    return '/';
}

/**
 * Convert a JS SDK path to a versioned path
 */
export function toVersionedPath(
    pathname: string,
    version: SdkJsVersion
): string {
    if (version === 'latest') {
        // Remove version prefix if present
        return pathname.replace(
            /^\/docs\/(?:1\.x|2\.x)\/sdk\/javascript/,
            '/docs/sdk/javascript'
        );
    }

    // Get relative path
    const relativePath = getSdkJsRelativePath(pathname);

    // Build versioned path
    return `/docs/${version}/sdk/javascript${relativePath === '/' ? '' : relativePath}`;
}
