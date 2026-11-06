import { ActionIcon, Box, Button, Group, Tabs, Text, Tooltip } from "@mantine/core";
import { Icon, iconFullscreen, iconOpen } from "@surrealdb/ui";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import classes from "./style.module.scss";

export interface DemoPage {
    /** The tab label, such as `Graph`. */
    label: string;
    /** The page, as a path under `public/`, such as `/docs/showcase/robin-hood/graph.html`. */
    src: string;
}

export interface DemoEmbedProps {
    /** What the demo is, used for the frame's accessible title. */
    title: string;
    /** One or more pages of the same demo, shown as tabs when there are several. */
    pages: DemoPage[];
    /** Height of the frame in pixels on a wide screen. */
    height?: number;
}

/**
 * A showcase demo, embedded on the card surface.
 *
 * A demo is a finished page of its own - a graph, an introduction, a page of
 * API responses - with its own design, so it is shown as an exhibit inside the
 * docs rather than restyled into them. The frame carries the tabs between the
 * demo's pages, a button that shows the demo full screen, which is how it is
 * meant to be seen, and a link that opens the current page in a new tab.
 *
 * Full screen applies to the whole card, so the tabs stay available and Esc
 * returns to the docs page. A browser without element full screen, such as
 * Safari on iPhone, opens the page in a new tab instead.
 *
 * Markdown strips a raw `<iframe>`, so this is the only way to embed one.
 */
export function DemoEmbed({ title, pages, height = 640 }: DemoEmbedProps) {
    const [active, setActive] = useState(pages[0]?.src ?? "");
    const [fullscreen, setFullscreen] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const current = pages.find((page) => page.src === active) ?? pages[0];

    useEffect(() => {
        const update = () => setFullscreen(document.fullscreenElement === root.current);
        document.addEventListener("fullscreenchange", update);
        return () => document.removeEventListener("fullscreenchange", update);
    }, []);

    if (!current) {
        return null;
    }

    const toggleFullscreen = () => {
        if (fullscreen) {
            document.exitFullscreen();
        } else if (root.current?.requestFullscreen) {
            root.current
                .requestFullscreen()
                .catch(() => window.open(current.src, "_blank", "noopener"));
        } else {
            window.open(current.src, "_blank", "noopener");
        }
    };

    return (
        <Box
            ref={root}
            className={classes.root}
        >
            <Group
                className={classes.bar}
                justify="space-between"
                wrap="nowrap"
            >
                {pages.length > 1 ? (
                    <Tabs
                        value={current.src}
                        onChange={(value) => value && setActive(value)}
                        variant="gradient"
                    >
                        <Tabs.List>
                            {pages.map((page) => (
                                <Tabs.Tab
                                    key={page.src}
                                    value={page.src}
                                >
                                    {page.label}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </Tabs>
                ) : (
                    <Text fw={500}>{current.label}</Text>
                )}
                <Group
                    gap="xs"
                    wrap="nowrap"
                    className={classes.actions}
                >
                    <Button
                        size="xs"
                        variant="gradient"
                        leftSection={<Icon path={iconFullscreen} />}
                        onClick={toggleFullscreen}
                    >
                        {fullscreen ? "Exit full screen" : "Full screen"}
                    </Button>
                    <Tooltip label="Open in a new tab">
                        <ActionIcon
                            component="a"
                            href={current.src}
                            target="_blank"
                            rel="noopener"
                            variant="subtle"
                            aria-label="Open in a new tab"
                        >
                            <Icon path={iconOpen} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
            <Box
                component="iframe"
                src={current.src}
                title={`${title}: ${current.label}`}
                loading="lazy"
                className={classes.frame}
                style={{ "--demo-height": `${height}px` } as CSSProperties}
            />
            {!fullscreen && (
                <Text
                    className={classes.hint}
                    size="xs"
                    c="dimmed"
                >
                    Best viewed full screen. Press Esc to come back to this page.
                </Text>
            )}
        </Box>
    );
}
