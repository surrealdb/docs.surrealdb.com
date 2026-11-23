import { Box, Breadcrumbs, Divider, Group, Text, Title } from "@mantine/core";
import { PageContentActions } from "~/components/ContentActions";
import { PageAside, PageAsideCollapse } from "~/components/PageAside";
import { RelatedContent } from "~/components/RelatedContent";
import { SidebarToggle } from "~/components/SidebarToggle";
import { useSidebarCollapsed } from "~/components/SidebarToggle/use-sidebar-collapsed";
import type { PageData } from "~/utils/data";
import { CopyPageMenu } from "../CopyPageMenu";
import { useMobilePageNavigation } from "./mobile-menu";
import { PageNavigation } from "./page-navigation";
import { Shell, ShellContent } from "./shell";
import { Sidebar } from "./sidebar";
import classes from "./style.module.scss";

export interface DefaultLayoutProps {
    data: PageData;
    children: React.ReactNode;
    showToc?: boolean;
    versionSelector?: React.ReactNode;
}

export function DefaultLayout({
    children,
    data,
    showToc = true,
    versionSelector,
}: DefaultLayoutProps) {
    // Below `lg` the sidebar is reached from the header's menu, which shows
    // this page's part of the docs above the list of sections.
    useMobilePageNavigation(data.navigation);

    const [sidebarCollapsed, toggleSidebar] = useSidebarCollapsed();

    return (
        <>
            <Shell sidebarCollapsed={sidebarCollapsed}>
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
                            maw={sidebarCollapsed ? undefined : 832}
                            pos="relative"
                            className={classes.contentColumn}
                        >
                            <SidebarToggle
                                collapsed={sidebarCollapsed}
                                onToggle={toggleSidebar}
                            />
                            <Group
                                align="center"
                                gap="sm"
                            >
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
                            {showToc && <PageAsideCollapse headings={data.headings} />}
                            <Box
                                mt="xl"
                                component="main"
                                id="main-content"
                                flex={1}
                            >
                                {children}
                            </Box>
                            <RelatedContent items={data.related ?? []} />
                            <Divider my="3xl" />
                            <PageContentActions
                                contentPath={data.contentPath}
                                lastModified={data.lastModified}
                            />
                            <PageNavigation navigation={data.navigation} />
                        </Box>
                        {showToc && <PageAside headings={data.headings} />}
                    </Group>
                </ShellContent>
            </Shell>
        </>
    );
}
