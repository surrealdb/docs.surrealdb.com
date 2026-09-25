import { ActionIcon, Box, Breadcrumbs, Divider, Group, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon, iconSidebar } from "@surrealdb/ui";
import { useEffect } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { PageContentActions } from "~/components/ContentActions";
import { PageAside } from "~/components/PageAside";
import type { PageData } from "~/utils/data";
import { CopyPageMenu } from "../CopyPageMenu";
import { PageNavigation } from "./page-navigation";
import { Shell, ShellContent, ShellDrawer } from "./shell";
import { Sidebar } from "./sidebar";
import classes from "./style.module.scss";

export interface DefaultLayoutProps {
    data: PageData;
    children: React.ReactNode;
    lastUpdated?: string;
    showToc?: boolean;
    versionSelector?: React.ReactNode;
}

export function DefaultLayout({
    children,
    data,
    showToc = true,
    versionSelector,
}: DefaultLayoutProps) {
    const [sidebarOpened, { toggle: toggleSidebar, close: closeSidebar }] = useDisclosure();
    const { urlPathname } = usePageContext();

    // Scrolling is left to Vike's client router, which scrolls to the URL's hash
    // or to the top after a navigation and restores the position on back and
    // forward. Scrolling here as well would also run on the first render, where
    // it cancels the browser's scroll to a linked heading.
    // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on route change
    useEffect(() => {
        closeSidebar();
    }, [urlPathname]);

    return (
        <>
            <ShellDrawer
                opened={sidebarOpened}
                onClose={closeSidebar}
            >
                <Sidebar
                    navigation={data.navigation}
                    versionSelector={versionSelector}
                />
            </ShellDrawer>
            <Shell>
                <Sidebar
                    navigation={data.navigation}
                    visibleFrom="lg"
                    versionSelector={versionSelector}
                />
                <ShellContent>
                    <Group
                        wrap="nowrap"
                        align="start"
                        gap={64}
                        miw={0}
                    >
                        <Box
                            flex={1}
                            miw={0}
                            maw={832}
                            className={classes.contentColumn}
                        >
                            <Group
                                align="center"
                                gap="sm"
                            >
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    hiddenFrom="lg"
                                    onClick={toggleSidebar}
                                    aria-label="Toggle sidebar"
                                >
                                    <Icon path={iconSidebar} />
                                </ActionIcon>
                                <Box
                                    flex={1}
                                    miw={0}
                                    className={classes.breadcrumbScroll}
                                >
                                    <Breadcrumbs
                                        fz="sm"
                                        id="top"
                                        separator={
                                            <Text
                                                c="slate"
                                                fw={600}
                                            >
                                                /
                                            </Text>
                                        }
                                    >
                                        {data.breadcrumbs.map((breadcrumb) => (
                                            <Text
                                                key={breadcrumb}
                                                c="violet"
                                                fz="md"
                                                lh="unset"
                                                fw={600}
                                            >
                                                {breadcrumb}
                                            </Text>
                                        ))}
                                    </Breadcrumbs>
                                </Box>
                            </Group>
                            <Group id="top">
                                <Title
                                    order={1}
                                    c="bright"
                                    fw={500}
                                    flex={1}
                                >
                                    {data.title}
                                </Title>
                                <CopyPageMenu />
                            </Group>
                            {/*
                             * The frontmatter description is deliberately not
                             * rendered. It feeds `<meta name="description">`,
                             * the search index and `llms.txt`, which all want
                             * dense front-loaded terms, while the orienting
                             * sentence a reader needs is the page's own opening
                             * paragraph - which the docs voice already
                             * requires. Rendering both gave every page two
                             * openers, and on an eighth of them the
                             * description restated the first H2 sitting
                             * directly beneath it.
                             */}
                            <Box
                                mt="xl"
                                component="main"
                                id="main-content"
                                flex={1}
                            >
                                {children}
                            </Box>
                            <Divider my="3xl" />
                            <PageContentActions contentPath={data.contentPath} />
                            <PageNavigation navigation={data.navigation} />
                        </Box>
                        {showToc && <PageAside headings={data.headings} />}
                    </Group>
                </ShellContent>
            </Shell>
        </>
    );
}
