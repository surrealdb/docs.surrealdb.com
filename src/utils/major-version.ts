import { MAJOR_VERSION_KEY, selectSyncedTab, useSyncedTab } from "~/utils/synced-tabs";

export interface MajorVersion {
    major: number;
    /** The tab label a page uses for this version's content. */
    label: string;
}

/** The major versions the docs cover, newest first. The first is the default. */
export const MAJOR_VERSIONS: readonly MajorVersion[] = [
    { major: 4, label: "SurrealDB 4.x" },
    { major: 3, label: "SurrealDB 3.x" },
];

const LATEST = MAJOR_VERSIONS[0] as MajorVersion;

/** The major version the reader has selected, from the header menu or any version tab. */
export function useMajorVersion(): MajorVersion {
    const label = useSyncedTab(MAJOR_VERSION_KEY);

    return MAJOR_VERSIONS.find((version) => version.label === label) ?? LATEST;
}

export function selectMajorVersion(version: MajorVersion) {
    selectSyncedTab(MAJOR_VERSION_KEY, version.label);
}

/**
 * Parses a `<Since>` version such as `v3.2.5` or `3.1` into numbers, or
 * returns `null` for anything else.
 */
export function parseVersion(value: string): number[] | null {
    const match = /^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(value.trim());

    if (!match) return null;

    return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)];
}

/**
 * Whether a `<Since>` badge tells a reader of `major` anything. Everything in
 * a major version's view is at least that version's `.0.0`, so a badge at or
 * below it carries no information there.
 */
export function isSinceRelevant(version: string, major: number): boolean {
    const parsed = parseVersion(version);

    if (!parsed) return true;

    const [badgeMajor = 0, minor = 0, patch = 0] = parsed;

    return badgeMajor > major || (badgeMajor === major && (minor > 0 || patch > 0));
}
