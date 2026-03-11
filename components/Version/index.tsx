import type { SdkVersionMap } from "@lib/versions";
import { Box } from "@mantine/core";
import { usePageContext } from "vike-react/usePageContext";

const DEFAULT_SDK_KEY = "surrealdb";

interface VersionProps {
    sdk?: string;
    prefix?: string;
}

export function Version({ sdk, prefix }: VersionProps) {
    const { sdkVersions } = usePageContext() as unknown as {
        sdkVersions: SdkVersionMap;
    };
    const key = sdk ?? DEFAULT_SDK_KEY;
    const version = sdkVersions?.[key];

    if (!version) {
        return null;
    }

    return (
        <Box
            component="code"
            bg="var(--surreal-glass-subtle)"
            p="0px var(--mantine-spacing-sm)"
            bdrs="var(--mantine-radius-xs)"
        >
            {prefix}
            {version}
        </Box>
    );
}
