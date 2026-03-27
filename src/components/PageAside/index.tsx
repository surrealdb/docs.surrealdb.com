import { Anchor, Box, Flex, Stack, Text } from "@mantine/core";
import { type Heading, Icon, iconText } from "@surrealdb/ui";
import { useEffect, useState } from "react";
import classes from "./style.module.scss";
export const GITHUB_BASE = "https://github.com/surrealdb/docs.surrealdb.com/edit/main/src/content/";
export const GITHUB_ISSUES = "https://github.com/surrealdb/docs.surrealdb.com/issues/new";

function useActiveHeading(headings: Heading[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (headings.length === 0) return;

        function onScroll() {
            let currentId: string | null = null;

            for (const heading of headings) {
                const el = document.getElementById(heading.id);

                if (!el) continue;
                if (el.getBoundingClientRect().top <= 120) {
                    currentId = heading.id;
                }
            }

            setActiveId(currentId ?? headings[0]?.id ?? null);
        }

        window.addEventListener("scroll", onScroll, true);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll, true);
    }, [headings]);

    return activeId;
}

export interface PageAsideProps {
    headings: Heading[];
}

export function PageAside({ headings }: PageAsideProps) {
    const minDepth = Math.min(...headings.map((h) => h.depth));
    const activeId = useActiveHeading(headings);

    return (
        <Stack
            component="aside"
            gap="lg"
            p="md"
            maw="260px"
            mah="stretch"
            pos="sticky"
            top="0"
            right="2rem"
            aria-hidden={headings.length === 0}
            visibleFrom="lg"
            hidden={headings.length === 0}
        >
            <Flex
                align="center"
                gap={8}
            >
                <Icon
                    path={iconText}
                    size="sm"
                    color="bright"
                />
                <Text
                    c="bright"
                    fw={700}
                >
                    On this page
                </Text>
            </Flex>
            <Box
                component="ul"
                className={classes.tocList}
                flex={1}
                style={{ overflowY: "auto" }}
            >
                {headings.map((heading, index) => (
                    <Box
                        component="li"
                        key={`toc-item-${heading.id}-${index}`}
                        className={classes.tocItem}
                        data-active={activeId === heading.id || undefined}
                    >
                        <Anchor
                            href={`#${heading.id}`}
                            className={classes.tocLink}
                            underline="never"
                            data-active={activeId === heading.id || undefined}
                            style={{
                                paddingLeft: `${(heading.depth - minDepth) * 12 + 12}px`,
                            }}
                        >
                            {heading.text}
                        </Anchor>
                    </Box>
                ))}
            </Box>
        </Stack>
    );
}
