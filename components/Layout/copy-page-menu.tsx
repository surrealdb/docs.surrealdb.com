import { Button, Menu, Stack, Text } from "@mantine/core";
import {
    brandOpenAi,
    Icon,
    iconArrowUpRight,
    iconChevronDown,
    iconCopy,
    pictoClaude,
} from "@surrealdb/ui";
import type { LLMChatURLs } from "@util/llms";
import { useCallback } from "react";
import { usePageContext } from "vike-react/usePageContext";
import classes from "./style.module.scss";

const RAW_BASE_URL =
    "https://raw.githubusercontent.com/surrealdb/docs.surrealdb.com/main/src/content";

export interface CopyPageMenuProps {
    contentPath: string;
}

export function CopyPageMenu({ contentPath }: CopyPageMenuProps) {
    const { llms } = usePageContext() as unknown as { llms: LLMChatURLs };

    const handleCopyMarkdown = useCallback(async () => {
        try {
            const url = `${RAW_BASE_URL}/${contentPath}`;
            const response = await fetch(url);
            const body = await response.text();

            navigator.clipboard.writeText(body);
        } catch (error) {
            console.error(error);
        }
    }, [contentPath]);

    const handleOpenChatGPT = () => {
        const { chatGpt } = llms ?? ({} as LLMChatURLs);
        window.open(chatGpt, "_blank", "noopener,noreferrer");
    };

    const handleOpenClaude = () => {
        const { claude } = llms ?? ({} as LLMChatURLs);
        window.open(claude, "_blank", "noopener,noreferrer");
    };

    return (
        <Menu
            shadow="md"
            width={280}
            position="bottom-end"
            withinPortal
            trigger="click-hover"
        >
            <Menu.Target>
                <Button
                    size="xs"
                    bdrs={4}
                    className={classes.copyPageButton}
                    leftSection={
                        <Icon
                            path={iconCopy}
                            size="sm"
                        />
                    }
                    rightSection={
                        <Icon
                            path={iconChevronDown}
                            size="xs"
                        />
                    }
                >
                    Copy page
                </Button>
            </Menu.Target>
            <Menu.Dropdown className={classes.copyPageDropdown}>
                <Menu.Item
                    leftSection={
                        <Icon
                            path={iconCopy}
                            size="sm"
                        />
                    }
                    onClick={handleCopyMarkdown}
                    className={classes.copyPageMenuItem}
                >
                    <Stack gap={0}>
                        <Text
                            fz="sm"
                            fw={500}
                        >
                            Copy as Markdown
                        </Text>
                        <Text
                            fz="xs"
                            c="dimmed"
                        >
                            Copy page content for LLMs
                        </Text>
                    </Stack>
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <Icon
                            path={brandOpenAi}
                            size="sm"
                        />
                    }
                    rightSection={
                        <Icon
                            path={iconArrowUpRight}
                            size="xs"
                            c="dimmed"
                        />
                    }
                    onClick={handleOpenChatGPT}
                    className={classes.copyPageMenuItem}
                >
                    <Stack gap={0}>
                        <Text
                            fz="sm"
                            fw={500}
                        >
                            Open in ChatGPT
                        </Text>
                        <Text
                            fz="xs"
                            c="dimmed"
                        >
                            Ask questions about this page
                        </Text>
                    </Stack>
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <Icon
                            path={pictoClaude}
                            size="sm"
                        />
                    }
                    rightSection={
                        <Icon
                            path={iconArrowUpRight}
                            size="xs"
                            c="dimmed"
                        />
                    }
                    onClick={handleOpenClaude}
                    className={classes.copyPageMenuItem}
                >
                    <Stack gap={0}>
                        <Text
                            fz="sm"
                            fw={500}
                        >
                            Open in Claude
                        </Text>
                        <Text
                            fz="xs"
                            c="dimmed"
                        >
                            Ask questions about this page
                        </Text>
                    </Stack>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
