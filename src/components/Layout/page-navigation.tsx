import { Anchor, Box, Flex, Text } from "@mantine/core";
import { Icon, iconChevronLeft, iconChevronRight } from "@surrealdb/ui";
import { useMemo } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { findLinkIndex, flattenNavigation, type NavSection } from "~/utils/navigation";
import classes from "./style.module.scss";

export interface PageNavigationProps {
    navigation: NavSection[];
}

export function PageNavigation({ navigation }: PageNavigationProps) {
    const { urlPathname } = usePageContext();

    const pages = useMemo(() => {
        return flattenNavigation(navigation);
    }, [navigation]);

    const currentIndex = findLinkIndex(pages, urlPathname);

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
                    href={`/docs${prev.path}`}
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
                                {prev.title}
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
                    href={`/docs${next.path}`}
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
                                {next.title}
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
