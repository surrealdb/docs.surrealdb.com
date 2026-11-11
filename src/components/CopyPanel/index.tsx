import { Box, Code, Group, Tabs, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Icon, iconCheck, iconCopy } from "@surrealdb/ui";
import { Fragment, type ReactNode, useState } from "react";
import classes from "./style.module.scss";

/** Long enough to read the confirmation, short enough to be gone on the next glance. */
const COPIED_TIMEOUT = 2000;

/** Matches the URLs in a prompt, so they can be drawn in the accent colour. */
const URL_PATTERN = /(https?:\/\/[^\s)]+[^\s).,])/g;

export interface CopyPanelTab {
    /** Identifies the tab. */
    value: string;
    /** The tab's face: a word, or a mark for a tab that names an agent. */
    label: ReactNode;
    /** The accessible name, needed when the label is a mark rather than text. */
    ariaLabel?: string;
    /** Shown in the panel and put on the clipboard as it stands. */
    text: string;
    /** Wraps the text to the panel. Leave unset for code, which scrolls instead. */
    prose?: boolean;
    /** A line under the panel, with backticks around inline code. */
    caption?: string;
    /** The copy button's label for this tab. */
    copyLabel?: string;
    /** Shown below the caption, such as a link to the full steps. */
    footer?: ReactNode;
}

export interface CopyPanelProps {
    tabs: CopyPanelTab[];
}

/** Draws `text` with each URL in the accent colour. */
function withUrls(text: string): ReactNode {
    return text.split(URL_PATTERN).map((part, index) =>
        index % 2 === 1 ? (
            <span
                key={index}
                className={classes.url}
            >
                {part}
            </span>
        ) : (
            <Fragment key={index}>{part}</Fragment>
        ),
    );
}

/** Draws `text` with each backticked span as inline code. */
function withCode(text: string): ReactNode {
    return text
        .split("`")
        .map((part, index) =>
            index % 2 === 1 ? (
                <Code key={index}>{part}</Code>
            ) : (
                <Fragment key={index}>{part}</Fragment>
            ),
        );
}

/**
 * Text a reader copies into an agent or a terminal, shown in full above its copy
 * button. Showing the words matters more than saving the space: a reader can see
 * what they are about to paste into a tool that acts on it.
 *
 * Several tabs share one panel, and the copy button copies the tab on screen. A
 * single tab is still drawn as a tab, so its label says what the text is.
 */
export function CopyPanel({ tabs }: CopyPanelProps) {
    const [value, setValue] = useState<string | null>(tabs[0]?.value ?? null);
    const clipboard = useClipboard({ timeout: COPIED_TIMEOUT });
    const active = tabs.find((tab) => tab.value === value) ?? tabs[0];

    if (!active) return null;

    return (
        <Box className={classes.root}>
            <Tabs
                value={active.value}
                onChange={(next) => {
                    setValue(next);
                    clipboard.reset();
                }}
                classNames={{
                    root: classes.panel,
                    list: classes.list,
                    tab: classes.tab,
                }}
            >
                <Group
                    className={classes.header}
                    justify="space-between"
                    wrap="nowrap"
                    gap="md"
                >
                    <Tabs.List>
                        {tabs.map((tab) => (
                            <Tabs.Tab
                                key={tab.value}
                                value={tab.value}
                                aria-label={tab.ariaLabel}
                                title={tab.ariaLabel}
                            >
                                {tab.label}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>

                    <Tooltip
                        label="Copied"
                        opened={clipboard.copied}
                        position="bottom"
                        withArrow
                    >
                        <UnstyledButton
                            className={classes.copy}
                            onClick={() => clipboard.copy(active.text)}
                        >
                            <Icon
                                path={clipboard.copied ? iconCheck : iconCopy}
                                size="sm"
                            />
                            <span>{active.copyLabel ?? "Copy"}</span>
                        </UnstyledButton>
                    </Tooltip>
                </Group>

                {tabs.map((tab) => (
                    <Tabs.Panel
                        key={tab.value}
                        value={tab.value}
                    >
                        <Box
                            component="pre"
                            data-prose={tab.prose || undefined}
                            className={classes.body}
                        >
                            {tab.prose ? withUrls(tab.text) : tab.text}
                        </Box>
                    </Tabs.Panel>
                ))}
            </Tabs>

            {active.caption && (
                <Text
                    fz="sm"
                    mt="sm"
                    opacity={0.8}
                >
                    {withCode(active.caption)}
                </Text>
            )}
            {active.footer}
        </Box>
    );
}
