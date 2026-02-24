import type { HeadingData } from "@lib/markdown";
import { Anchor, Box, Button, Flex, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { clsx, Icon, iconBug, iconEdit } from "@surrealdb/ui";
import { useEffect, useRef, useState } from "react";
import { FeedbackModal } from "../../modals/FeedbackModal";
import classes from "./style.module.scss";

const GITHUB_BASE = "https://github.com/surrealdb/docs.surrealdb.com/edit/main/src/content/";
const GITHUB_ISSUES = "https://github.com/surrealdb/docs.surrealdb.com/issues/new";

const ICON_THUMB_UP =
    "M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z";

export interface PageAsideProps {
    headings: HeadingData[];
    lastUpdated?: string;
}

function useActiveHeading(headings: HeadingData[]) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const ids = headings.filter((h) => h.depth === 2 || h.depth === 3).map((h) => h.id);

        if (ids.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                }
            },
            { rootMargin: "0px 0px -80% 0px", threshold: 0 },
        );

        for (const id of ids) {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        }

        return () => observer.disconnect();
    }, [headings]);

    return activeId;
}

function TableOfContents({ headings }: { headings: HeadingData[] }) {
    const tocHeadings = headings.filter((h) => h.depth === 2 || h.depth === 3);
    const activeId = useActiveHeading(headings);
    const activeRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, []);

    if (tocHeadings.length === 0) return null;

    return (
        <Box
            component="nav"
            aria-label="Table of contents"
        >
            <Text
                tt="uppercase"
                fz="sm"
                fw={700}
                c="bright"
                mb="md"
            >
                On this page
            </Text>
            <Box
                component="ul"
                className={classes.tocList}
            >
                {tocHeadings.map((heading) => (
                    <li key={heading.id}>
                        <Anchor
                            ref={activeId === heading.id ? activeRef : undefined}
                            href={`#${heading.id}`}
                            className={clsx(
                                classes.tocLink,
                                heading.depth === 3 && classes.tocLinkDepth3,
                                activeId === heading.id && classes.active,
                            )}
                            underline="never"
                        >
                            {heading.text}
                        </Anchor>
                    </li>
                ))}
            </Box>
        </Box>
    );
}

export function PageAside({ headings, lastUpdated }: PageAsideProps) {
    return (
        <Box mt="xl">
            <Stack
                className={classes.root}
                gap="lg"
                p="md"
            >
                {lastUpdated && (
                    <Text
                        fz="xs"
                        c="obsidian.4"
                    >
                        Last updated: {lastUpdated}
                    </Text>
                )}
                <TableOfContents headings={headings} />
            </Stack>
        </Box>
    );
}

export function PageMetaInline({ lastUpdated }: { lastUpdated?: string }) {
    if (!lastUpdated) return null;

    return (
        <Flex
            className={classes.mobileMeta}
            pb="md"
            mb="md"
            align="center"
        >
            <Text
                fz="xs"
                c="obsidian.4"
            >
                Last updated: {lastUpdated}
            </Text>
        </Flex>
    );
}

export function PageContentActions({ contentPath }: { contentPath: string }) {
    const editUrl = `${GITHUB_BASE}${contentPath}`;
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Group
                className={classes.contentActions}
                gap="md"
                mt="xl"
                pt="md"
                justify="space-between"
            >
                <Group gap="md">
                    <Anchor
                        href={editUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.actionLink}
                        underline="never"
                        c="bright"
                    >
                        <Icon
                            path={iconEdit}
                            mr="sm"
                        />
                        Edit page
                    </Anchor>
                    <Anchor
                        href={GITHUB_ISSUES}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.actionLink}
                        underline="never"
                        c="red"
                    >
                        <Icon
                            path={iconBug}
                            mr="sm"
                        />
                        Report an issue
                    </Anchor>
                </Group>
                <Button
                    variant="subtle"
                    size="compact-sm"
                    leftSection={
                        <Icon
                            path={ICON_THUMB_UP}
                            size="xs"
                        />
                    }
                    onClick={open}
                    className={classes.actionLink}
                >
                    Was this page helpful?
                </Button>
            </Group>
            <FeedbackModal
                opened={opened}
                onClose={close}
            />
        </>
    );
}
