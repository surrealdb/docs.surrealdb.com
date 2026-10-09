import { Anchor, Box, Group, Tabs, Text } from "@mantine/core";
import { type CSSProperties, useState } from "react";
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
 * demo's pages and a link to open the current one full screen, which is how it
 * is meant to be seen.
 *
 * Markdown strips a raw `<iframe>`, so this is the only way to embed one.
 */
export function DemoEmbed({ title, pages, height = 640 }: DemoEmbedProps) {
    const [active, setActive] = useState(pages[0]?.src ?? "");
    const current = pages.find((page) => page.src === active) ?? pages[0];

    if (!current) {
        return null;
    }

    return (
        <Box className={classes.root}>
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
                <Anchor
                    href={current.src}
                    target="_blank"
                    rel="noopener"
                    className={classes.open}
                >
                    Open full screen
                </Anchor>
            </Group>
            <Box
                component="iframe"
                src={current.src}
                title={`${title}: ${current.label}`}
                loading="lazy"
                className={classes.frame}
                style={{ "--demo-height": `${height}px` } as CSSProperties}
            />
        </Box>
    );
}
