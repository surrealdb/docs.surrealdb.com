import { PageContentActions } from "@components/ContentActions";
import { PageAside } from "@components/PageAside";
import type { HeadingData } from "@lib/markdown";
import { ActionIcon, Box, Container, Drawer, Flex, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon, iconSidebar } from "@surrealdb/ui";
import type { SidebarItem } from "@util/sidebar";
import { PageBreadcrumbs } from "../Breadcrumbs";
import { CopyPageMenu } from "../CopyPageMenu";
import { Footer } from "../Footer";
import { Header, MobileNav } from "./header";
import { Navbar } from "./navbar";
import { PageNavigation } from "./page-navigation";
import classes from "./style.module.scss";

export interface DefaultLayoutProps {
    children: React.ReactNode;
    sidebar: SidebarItem[];
    headings: HeadingData[];
    contentPath: string;
    lastUpdated?: string;
    showToc?: boolean;
}

export function DefaultLayout({
    children,
    sidebar,
    headings,
    contentPath,
    showToc = true,
}: DefaultLayoutProps) {
    const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();
    const [sidebarOpened, { toggle: toggleSidebar, close: closeSidebar }] = useDisclosure();

    return (
        <div className={classes.layout}>
            <Header
                opened={menuOpened}
                onToggle={toggleMenu}
            />
            <Navbar
                sidebar={sidebar}
                visibleFrom="lg"
            />
            <Drawer
                opened={menuOpened}
                onClose={closeMenu}
                size="325px"
                hiddenFrom="lg"
                withCloseButton={false}
            >
                <MobileNav />
            </Drawer>
            <Drawer
                opened={sidebarOpened}
                onClose={closeSidebar}
                size="325px"
                hiddenFrom="lg"
                withCloseButton={false}
            >
                <Navbar sidebar={sidebar} />
            </Drawer>
            <Group
                justify="center"
                align="flex-start"
            >
                <Container
                    component={Stack}
                    size="sm"
                    flex={1}
                    h="100%"
                >
                    <Flex
                        align="center"
                        gap="sm"
                        mb={32}
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
                            <PageBreadcrumbs sidebar={sidebar} />
                        </Box>
                        <CopyPageMenu contentPath={contentPath} />
                    </Flex>
                    <Box
                        component="main"
                        flex={1}
                    >
                        {children}
                    </Box>
                    <PageContentActions contentPath={contentPath} />
                    <PageNavigation sidebar={sidebar} />
                    <Footer />
                </Container>
                {showToc && <PageAside headings={headings} />}
            </Group>
        </div>
    );
}
