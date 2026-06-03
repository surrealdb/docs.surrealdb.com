// https://vike.dev/Layout

import { MantineProvider, v8CssVariablesResolver } from "@mantine/core";
import { MANTINE_THEME } from "@surrealdb/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider
                theme={MANTINE_THEME}
                defaultColorScheme="dark"
                cssVariablesResolver={v8CssVariablesResolver}
            >
                {children}
            </MantineProvider>
        </QueryClientProvider>
    );
}
