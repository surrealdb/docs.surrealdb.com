import { PageContentActions } from "@components/ContentActions";
import { PageAside } from "@components/PageAside";
import type { HeadingData } from "@lib/markdown";
import { Box, Container, Flex, Group } from "@mantine/core";
import type { SidebarItem } from "@util/sidebar";
import { PageBreadcrumbs } from "../Breadcrumbs";
import { Footer } from "../Footer";
import { CopyPageMenu } from "./copy-page-menu";
import { Navbar } from "./navbar";
import { Navigation } from "./navigation";
import { PageNavigation } from "./page-navigation";
import classes from "./style.module.scss";

export interface DefaultLayoutProps {
    children: React.ReactNode;
    sidebar: SidebarItem[];
    headings: HeadingData[];
    contentPath: string;
    lastUpdated?: string;
}

export function DefaultLayout({ children, sidebar, headings, contentPath }: DefaultLayoutProps) {
    return (
        <div className={classes.layout}>
            <Navigation />
            <Navbar sidebar={sidebar} />
            <Group
                justify="center"
                align="flex-start"
            >
                <Container size="sm">
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
                <PageAside headings={headings} />
            </Group>
        </div>
    );
}
