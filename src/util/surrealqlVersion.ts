/**
 * SurrealQL versioning utilities
 * Only applies to SurrealQL docs section
 */

export const SURREALQL_VERSIONS = ['latest', '3.x', '2.x'] as const;
export type SurrealQLVersion = (typeof SURREALQL_VERSIONS)[number];

export const SURREALQL_DOC_PATH = '/docs/surrealql';

/**
 * Extract version from URL path
 * Returns 'latest' if no version is found
 */
export function getVersionFromPath(pathname: string): SurrealQLVersion {
    // Match /docs/2.x/surrealql/** or /docs/3.x/surrealql/**
    const versionMatch = pathname.match(/^\/docs\/(2\.x|3\.x)\/surrealql/);
    if (versionMatch) {
        return versionMatch[1] as SurrealQLVersion;
    }
    return 'latest';
}

/**
 * Check if a path is a SurrealQL docs path
 */
export function isSurrealQLPath(pathname: string): boolean {
    return pathname.startsWith('/docs/surrealql') || 
           pathname.startsWith('/docs/2.x/surrealql') ||
           pathname.startsWith('/docs/3.x/surrealql');
}

/**
 * Check if a path is a versioned SurrealQL path (not latest)
 */
export function isVersionedSurrealQLPath(pathname: string): boolean {
    return pathname.startsWith('/docs/2.x/surrealql') ||
           pathname.startsWith('/docs/3.x/surrealql');
}

/**
 * Get the relative path within SurrealQL docs (without version prefix)
 */
export function getSurrealQLRelativePath(pathname: string): string {
    // Handle versioned paths: /docs/2.x/surrealql/** or /docs/3.x/surrealql/**
    const versionedMatch = pathname.match(/^\/docs\/(?:2\.x|3\.x)\/surrealql(.*)$/);
    if (versionedMatch) {
        return versionedMatch[1] || '/';
    }
    
    // Handle latest paths: /docs/surrealql/**
    const latestMatch = pathname.match(/^\/docs\/surrealql(.*)$/);
    if (latestMatch) {
        return latestMatch[1] || '/';
    }
    
    return '/';
}

/**
 * Convert a SurrealQL path to a versioned path
 */
export function toVersionedPath(pathname: string, version: SurrealQLVersion): string {
    if (version === 'latest') {
        // Remove version prefix if present
        return pathname.replace(/^\/docs\/(?:2\.x|3\.x)\/surrealql/, '/docs/surrealql');
    }
    
    // Get relative path
    const relativePath = getSurrealQLRelativePath(pathname);
    
    // Build versioned path
    return `/docs/${version}/surrealql${relativePath === '/' ? '' : relativePath}`;
}

/**
 * Compare version strings (e.g., "v2.2.0" vs "v3.0.0-beta")
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
    // Normalize versions
    const normalize = (v: string) => {
        // Remove 'v' prefix if present
        v = v.replace(/^v/, '');
        // Handle 'x' as wildcard (treat as 0 for comparison)
        v = v.replace(/\.x/g, '.0');
        // Split into parts
        const parts = v.split(/[.-]/).map(p => {
            // Try to parse as number, otherwise return 0
            const num = parseInt(p, 10);
            return isNaN(num) ? 0 : num;
        });
        return parts;
    };
    
    const parts1 = normalize(v1);
    const parts2 = normalize(v2);
    const maxLength = Math.max(parts1.length, parts2.length);
    
    for (let i = 0; i < maxLength; i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;
        if (p1 < p2) return -1;
        if (p1 > p2) return 1;
    }
    
    return 0;
}

/**
 * Check if a version string matches a SurrealQL version
 */
export function versionMatches(versionString: string, targetVersion: SurrealQLVersion): boolean {
    if (targetVersion === 'latest') {
        // Latest includes everything
        return true;
    }
    
    if (targetVersion === '2.x') {
        // Match 2.x versions only (not 3.x)
        return /^v?2\./.test(versionString);
    }
    
    if (targetVersion === '3.x') {
        // 3.x includes both 2.x and 3.x content (since 3.x is a superset of 2.x)
        // Match 2.x versions OR 3.0+ versions
        return /^v?2\./.test(versionString) || compareVersions(versionString, 'v3.0.0') >= 0;
    }
    
    return false;
}

/**
 * Get the minimum version that includes a given version string
 */
export function getMinimumVersion(versionString: string): SurrealQLVersion | null {
    // Normalize version
    const normalized = versionString.replace(/^v/, '');
    
    // Check if it's 3.0+
    if (compareVersions(versionString, 'v3.0.0') >= 0) {
        return '3.x';
    }
    
    // Check if it's 2.x
    if (/^2\./.test(normalized)) {
        return '2.x';
    }
    
    // Older versions not supported in versioning
    return null;
}

