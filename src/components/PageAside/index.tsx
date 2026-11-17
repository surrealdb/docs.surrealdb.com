import { Anchor, Box, Flex, Stack, Text } from "@mantine/core";
import { Icon, iconText } from "@surrealdb/ui";
import { useEffect, useState } from "react";
import { TABS_CHANGE_EVENT } from "~/components/Tabs";
import type { DocHeading } from "~/utils/markdown";
import classes from "./style.module.scss";
export const GITHUB_BASE = "https://github.com/surrealdb/docs.surrealdb.com/edit/main/src/content/";
export const GITHUB_ISSUES = "https://github.com/surrealdb/docs.surrealdb.com/issues/new";

function isShown(el: HTMLElement | null): el is HTMLElement {
    return el !== null && el.getClientRects().length > 0;
}

/**
 * The headings a reader can reach on the page as it is shown. A heading inside
 * a tab panel that is not selected is left out, because following its link
 * would scroll nowhere. The list updates whenever a tab group changes panel.
 */
function useShownHeadings(headings: DocHeading[]) {
    const [shown, setShown] = useState<{ heading: DocHeading; el: HTMLElement | null }[]>(() =>
        headings.map((heading) => ({ heading, el: null })),
    );

    useEffect(() => {
        function update() {
            setShown(
                headings
                    .map((heading) => ({ heading, el: document.getElementById(heading.id) }))
                    .filter((entry) => isShown(entry.el)),
            );
        }

        update();
        window.addEventListener(TABS_CHANGE_EVENT, update);
        return () => window.removeEventListener(TABS_CHANGE_EVENT, update);
    }, [headings]);

    return shown;
}

function useActiveHeading(shown: { heading: DocHeading; el: HTMLElement | null }[]): number | null {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        if (shown.length === 0) return;

        function onScroll() {
            let current: number | null = null;

            shown.forEach(({ el }, index) => {
                if (el && el.getBoundingClientRect().top <= 120) current = index;
            });

            setActiveIndex(current ?? 0);
        }

        window.addEventListener("scroll", onScroll, true);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll, true);
    }, [shown]);

    return activeIndex;
}

export interface PageAsideProps {
    headings: DocHeading[];
}

export function PageAside({ headings }: PageAsideProps) {
    const shown = useShownHeadings(headings);
    const minDepth = Math.min(...shown.map(({ heading }) => heading.depth));
    const activeIndex = useActiveHeading(shown);

    return (
        <Stack
            component="aside"
            className={classes.root}
            gap="lg"
            px="md"
            pb="md"
            w={275}
            mah="stretch"
            pos="sticky"
            top="calc(var(--docs-header-height) + 24px)"
            right="2rem"
            aria-hidden={headings.length === 0}
            visibleFrom="md"
            hidden={headings.length === 0}
            style={{ flexShrink: 0 }}
        >
            <Anchor
                href="#top"
                className={classes.tocHeading}
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
            </Anchor>
            <Box
                component="ul"
                className={classes.tocList}
                flex={1}
                style={{ overflowY: "auto" }}
            >
                {shown.map(({ heading }, index) => (
                    <Box
                        component="li"
                        key={`toc-item-${heading.id}-${index}`}
                        className={classes.tocItem}
                        data-active={activeIndex === index || undefined}
                    >
                        <Anchor
                            href={`#${heading.id}`}
                            className={classes.tocLink}
                            underline="never"
                            data-active={activeIndex === index || undefined}
                            style={{
                                paddingLeft: `${(heading.depth - minDepth) * 12 + 20}px`,
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
