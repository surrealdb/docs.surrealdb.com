import { Anchor, Box, Flex, Text } from "@mantine/core";
import { Icon, iconChevronLeft, iconChevronRight } from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";
import { findCurrentPageIndex, flattenSidebar, type SidebarItem } from "~/utils/sidebar";
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
            mt="2xl"
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
                            size="sm"
                        />
                        <Box lh="xs">
                            <Text
                                fz="xs"
                                opacity={0.6}
                                inherit
                            >
                                Previous
                            </Text>
                            <Text
                                fz="lg"
                                fw={500}
                                c="bright"
                                inherit
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
                        <Box lh="xs">
                            <Text
                                fz="xs"
                                opacity={0.6}
                                inherit
                            >
                                Next
                            </Text>
                            <Text
                                fz="lg"
                                fw={500}
                                c="bright"
                                inherit
                            >
                                {next.label}
                            </Text>
                        </Box>
                        <Icon
                            path={iconChevronRight}
                            size="sm"
                        />
                    </Flex>
                </Anchor>
            ) : (
                <Box />
            )}
        </Box>
    );
}
