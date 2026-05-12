// https://vike.dev/Layout

import { MantineProvider, v8CssVariablesResolver } from "@mantine/core";
import { MANTINE_THEME } from "@surrealdb/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider
            theme={MANTINE_THEME}
            defaultColorScheme="dark"
            cssVariablesResolver={v8CssVariablesResolver}
        >
            {children}
        </MantineProvider>
    );
}
