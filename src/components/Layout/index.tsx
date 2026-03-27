import { ActionIcon, Box, Container, Drawer, Flex, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Heading, Icon, iconSidebar } from "@surrealdb/ui";
import { PageContentActions } from "~/components/ContentActions";
import { PageAside } from "~/components/PageAside";
import type { SidebarItem } from "~/utils/sidebar";
import { PageBreadcrumbs } from "../Breadcrumbs";
import { CopyPageMenu } from "../CopyPageMenu";
import { Footer } from "../Footer";
import { Header, MobileNav } from "./header";
import { PageNavigation } from "./page-navigation";
import { Sidebar } from "./sidebar";
import classes from "./style.module.scss";

export interface DefaultLayoutProps {
    children: React.ReactNode;
    sidebar: SidebarItem[];
    headings: Heading[];
    contentPath: string;
    lastUpdated?: string;
    showToc?: boolean;
    versionSelector?: React.ReactNode;
}

export function DefaultLayout({
    children,
    sidebar,
    headings,
    contentPath,
    showToc = true,
    versionSelector,
}: DefaultLayoutProps) {
    const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();
    const [sidebarOpened, { toggle: toggleSidebar, close: closeSidebar }] = useDisclosure();

    return (
        <div className={classes.layout}>
            <Header
                opened={menuOpened}
                onToggle={toggleMenu}
            />
            <Sidebar
                items={sidebar}
                visibleFrom="lg"
                versionSelector={versionSelector}
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
                <Sidebar
                    items={sidebar}
                    versionSelector={versionSelector}
                />
            </Drawer>
            <Group
                justify="center"
                align="flex-start"
            >
                <Container
                    size={660}
                    flex={1}
                    h="100%"
                >
                    <Flex
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
