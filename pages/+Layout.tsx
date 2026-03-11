// https://vike.dev/Layout

import { Box, MantineProvider, useComputedColorScheme } from "@mantine/core";
import { MANTINE_THEME } from "@surrealdb/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider
            theme={MANTINE_THEME}
            defaultColorScheme="auto"
        >
            <FixColorScheme>{children}</FixColorScheme>
        </MantineProvider>
    );
}

function FixColorScheme({ children }: { children: React.ReactNode }) {
    const scheme = useComputedColorScheme();
    return (
        <>
            <Box
                display="none"
                aria-hidden={true}
            >
                {scheme}
            </Box>
            {children}
        </>
    );
}
