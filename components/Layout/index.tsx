import { PageContentActions } from "@components/ContentActions";
import { PageAside } from "@components/PageAside";
// import { PageAside } from "@components/PageAside";
import type { HeadingData } from "@lib/markdown";
import { Box, Container, Flex, Group, Stack } from "@mantine/core";
import type { SidebarItem } from "@util/sidebar";
import { PageBreadcrumbs } from "../Breadcrumbs";
import { CopyPageMenu } from "../CopyPageMenu";
import { Footer } from "../Footer";
import { Header } from "./header";
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
    return (
        <div className={classes.layout}>
            <Header />
            <Navbar sidebar={sidebar} />
            <Group
                justify="center"
                align="flex-start"
            >
                <Container
                    component={Stack}
                    size="sm"
                    h="100%"
                    flex={1}
                >
                    <Flex
                        justify="space-between"
                        align="center"
                        mb={32}
                    >
                        <PageBreadcrumbs sidebar={sidebar} />
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
