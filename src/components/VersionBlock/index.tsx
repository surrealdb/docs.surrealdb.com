import { CodeBlock } from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";

/** Placeholder inside `code` that the current SDK version replaces. */
export const VERSION_PLACEHOLDER = "{{version}}";

interface VersionBlockProps {
    /** SDK key in the version registry, e.g. `.net`. Defaults to `surrealdb`. */
    sdk?: string;
    /** Code body; each `{{version}}` occurrence is replaced with the version. */
    code: string;
    /** Language for syntax highlighting, e.g. `xml`. */
    lang?: string;
}

/**
 * A code block whose version number stays in sync with the registry.
 *
 * Fenced code blocks are static text, so a version pinned inside one drifts.
 * This component substitutes the live version at render time, using the same
 * `sdkVersions` page context the inline `<Version>` badge reads.
 */
export function VersionBlock({ sdk, code, lang }: VersionBlockProps) {
    const { sdkVersions } = usePageContext() as unknown as {
        sdkVersions: Record<string, string> | undefined;
    };

    const version = sdkVersions?.[sdk ?? "surrealdb"];
    const value = version
        ? code.replaceAll(VERSION_PLACEHOLDER, version)
        : code.replaceAll(VERSION_PLACEHOLDER, "latest");

    return (
        <CodeBlock
            value={value}
            lang={lang}
        />
    );
}
