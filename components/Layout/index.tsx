import { PageAside, PageContentActions, PageMetaInline } from "@components/PageAside";
import type { HeadingData } from "@lib/markdown";
import { AppShell, Box, Container, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { SidebarItem } from "@util/sidebar";
import { PageBreadcrumbs } from "./breadcrumbs";
import { CopyPageMenu } from "./copy-page-menu";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { Navigation } from "./navigation";
import { PageNavigation } from "./page-navigation";
import classes from "./style.module.scss";

export const HEADER_HEIGHT = 64;

export interface DefaultLayoutProps {
    children: React.ReactNode;
    sidebar: SidebarItem[];
    headings?: HeadingData[];
    contentPath?: string;
    lastUpdated?: string;
}

export function DefaultLayout({
    children,
    sidebar,
    headings,
    contentPath,
    lastUpdated,
}: DefaultLayoutProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const hasAside = !!headings && !!contentPath;

    return (
        <AppShell
            className={classes.app}
            header={{ height: HEADER_HEIGHT }}
            navbar={{
                width: 340,
                breakpoint: "lg",
                collapsed: {
                    desktop: false,
                    mobile: !opened,
                },
            }}
            aside={
                hasAside
                    ? {
                          width: 260,
                          breakpoint: "xl",
                          collapsed: {
                              desktop: false,
                              mobile: true,
                          },
                      }
                    : undefined
            }
            withBorder={false}
        >
            <AppShell.Header bg="obsidian.9">
                <Navigation
                    opened={opened}
                    onToggle={toggle}
                />
            </AppShell.Header>

            <AppShell.Navbar bg="obsidian.8">
                <Navbar sidebar={sidebar} />
            </AppShell.Navbar>

            {hasAside && (
                <AppShell.Aside bg="obsidian.9">
                    <PageAside
                        headings={headings}
                        lastUpdated={lastUpdated}
                    />
                </AppShell.Aside>
            )}

            <AppShell.Main
                className={classes.main}
                component="main"
                bg="obsidian.9"
            >
                <Box
                    w="100%"
                    p="xl"
                >
                    {hasAside && (
                        <Box hiddenFrom="xl">
                            <PageMetaInline lastUpdated={lastUpdated} />
                        </Box>
                    )}
                    <Container size="md">
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={32}
                            mt="xs"
                        >
                            <PageBreadcrumbs sidebar={sidebar} />
                            {contentPath && <CopyPageMenu contentPath={contentPath} />}
                        </Flex>
                        {children}
                        {contentPath && <PageContentActions contentPath={contentPath} />}
                        <PageNavigation sidebar={sidebar} />
                        <Footer />
                    </Container>
                </Box>
            </AppShell.Main>
        </AppShell>
    );
}
