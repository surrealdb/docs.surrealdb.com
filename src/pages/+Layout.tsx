// https://vike.dev/Layout

import { MantineProvider, mergeThemeOverrides, rem, v8CssVariablesResolver } from "@mantine/core";
import { MANTINE_THEME } from "@surrealdb/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { PageFrame } from "~/components/Layout/frame";

/**
 * The kit's theme with every type size one pixel larger, for the docs'
 * long-form reading, and no rounded corners. Weights and everything else are
 * the kit's own.
 */
const DOCS_THEME = mergeThemeOverrides(MANTINE_THEME, {
    // Nothing in the docs is rounded: every radius size resolves to zero. The
    // two pill buttons set their own radius on purpose.
    defaultRadius: 0,
    radius: { xs: "0", sm: "0", md: "0", lg: "0", xl: "0" },
    fontSizes: { xs: rem(13), sm: rem(14), md: rem(15), lg: rem(17), xl: rem(19) },
    headings: {
        sizes: {
            h1: { fontSize: rem(37) },
            h2: { fontSize: rem(25) },
            h3: { fontSize: rem(21) },
            h4: { fontSize: rem(19) },
            h5: { fontSize: rem(17) },
            h6: { fontSize: rem(15) },
        },
    },
});

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
                theme={DOCS_THEME}
                defaultColorScheme="dark"
                cssVariablesResolver={v8CssVariablesResolver}
            >
                <PageFrame>{children}</PageFrame>
            </MantineProvider>
        </QueryClientProvider>
    );
}
