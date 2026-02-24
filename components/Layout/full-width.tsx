import { AppShell, Box } from "@mantine/core";
import { Footer } from "./footer";
import { HEADER_HEIGHT } from "./index";
import { Navigation } from "./navigation";
import classes from "./style.module.scss";

export function FullWidthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppShell
            className={classes.app}
            header={{ height: HEADER_HEIGHT }}
            withBorder={false}
        >
            <AppShell.Header bg="obsidian.9">
                <Navigation />
            </AppShell.Header>
            <AppShell.Main
                className={classes.main}
                component="main"
                bg="obsidian.9"
            >
                <Box w="100%">{children}</Box>
                <Footer />
            </AppShell.Main>
        </AppShell>
    );
}
