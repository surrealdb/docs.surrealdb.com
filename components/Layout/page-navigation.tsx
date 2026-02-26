import { Anchor, Box, Flex, Text } from "@mantine/core";
import { Icon, iconChevronLeft, iconChevronRight } from "@surrealdb/ui";
import { findCurrentPageIndex, flattenSidebar, type SidebarItem } from "@util/sidebar";
import { usePageContext } from "vike-react/usePageContext";
import classes from "./style.module.scss";

export interface PageNavigationProps {
    sidebar: SidebarItem[];
}

export function PageNavigation({ sidebar }: PageNavigationProps) {
    const { urlPathname } = usePageContext();
    const pages = flattenSidebar(sidebar);
    const currentIndex = findCurrentPageIndex(pages, urlPathname);

    if (currentIndex === -1) return null;

    const prev = currentIndex > 0 ? pages[currentIndex - 1] : null;
    const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

    if (!prev && !next) return null;

    return (
        <Box
            className={classes.pageNavigation}
            mt="xl"
        >
            {prev ? (
                <Anchor
                    className={classes.pageNavigationLink}
                    href={prev.href}
                    underline="never"
                >
                    <Flex
                        align="center"
                        gap="md"
                    >
                        <Icon
                            path={iconChevronLeft}
                            size="md"
                        />
                        <Box>
                            <Text
                                fz="md"
                                c="dimmed"
                            >
                                Previous
                            </Text>
                            <Text
                                fz="lg"
                                fw={500}
                                c="bright"
                            >
                                {prev.label}
                            </Text>
                        </Box>
                    </Flex>
                </Anchor>
            ) : (
                <Box />
            )}
            {next ? (
                <Anchor
                    className={classes.pageNavigationLink}
                    href={next.href}
                    underline="never"
                    ta="right"
                >
                    <Flex
                        align="center"
                        justify="flex-end"
                        gap="md"
                    >
                        <Box>
                            <Text
                                fz="sm"
                                c="dimmed"
                            >
                                Next
                            </Text>
                            <Text
                                fz="lg"
                                fw={500}
                                c="bright"
                            >
                                {next.label}
                            </Text>
                        </Box>
                        <Icon
                            path={iconChevronRight}
                            size="md"
                        />
                    </Flex>
                </Anchor>
            ) : (
                <Box />
            )}
        </Box>
    );
}
