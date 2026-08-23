import {
    ActionIcon,
    Box,
    Breadcrumbs,
    Container,
    Divider,
    Drawer,
    Group,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon, iconSidebar } from "@surrealdb/ui";
import { useEffect, useRef } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { PageContentActions } from "~/components/ContentActions";
import { PageAside } from "~/components/PageAside";
import type { PageData } from "~/utils/data";
import { CopyPageMenu } from "../CopyPageMenu";
import { PageNavigation } from "./page-navigation";
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
    const contentRef = useRef<HTMLDivElement>(null);
    const { urlPathname } = usePageContext();

    // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeSidebar();
    }, [urlPathname]);

    return (
        <>
            <Drawer
                opened={sidebarOpened}
                onClose={closeSidebar}
                size="325px"
                hiddenFrom="lg"
                withCloseButton={false}
                classNames={{ content: classes.drawerContent }}
            >
                <Sidebar
                    navigation={data.navigation}
                    versionSelector={versionSelector}
                />
            </Drawer>
            <Box className={classes.shell}>
                <Sidebar
                    navigation={data.navigation}
                    visibleFrom="lg"
                    versionSelector={versionSelector}
                />
                <Stack
                    ref={contentRef}
                    gap={0}
                >
                    <Group
                        justify="center"
                        align="flex-start"
                        flex={1}
                    >
                        <Container
                            size="md"
                            flex={1}
                            miw={0}
                            className={classes.contentContainer}
                        >
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
                                    {data.description && <Text fz="xl">{data.description}</Text>}
                                    <Box
                                        mt="xl"
                                        component="main"
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
                        </Container>
                    </Group>
                </Stack>
            </Box>
        </>
    );
}
