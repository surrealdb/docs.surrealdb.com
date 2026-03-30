import { Button, Loader, Menu, Stack, Text, ThemeIcon } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
    Icon,
    iconArrowUpRight,
    iconChatGPT,
    iconCheck,
    iconChevronDown,
    iconClaude,
    iconCopy,
    useStable,
} from "@surrealdb/ui";
import { useMemo, useState } from "react";

const RAW_BASE_URL =
    "https://raw.githubusercontent.com/surrealdb/docs.surrealdb.com/main/src/content";

const LLM_PREFIXES = {
    chatGpt: "https://chatgpt.com/?hints=search&q=",
    claude: "https://claude.ai/new?q=",
};

type LLM = keyof typeof LLM_PREFIXES;

export interface CopyPageMenuProps {
    contentPath: string;
}

export function CopyPageMenu({ contentPath }: CopyPageMenuProps) {
    const { copy, copied } = useClipboard();
    const [isFetching, setIsFetching] = useState(false);

    const handleCopyMarkdown = useStable(async () => {
        setIsFetching(true);

        try {
            const url = `${RAW_BASE_URL}/${contentPath}`;
            const response = await fetch(url);
            const body = await response.text();

            copy(body);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    });

    const handleOpenLLM = useStable((llm: LLM) => {
        const prompt = encodeURIComponent(
            `Read from ${location.href} so I can ask questions about it.`,
        );

        window.open(`${LLM_PREFIXES[llm]}${prompt}`, "_blank", "noopener,noreferrer");
    });

    const leftSection = useMemo(() => {
        if (isFetching) {
            return <Loader size={12} />;
        }

        if (copied) {
            return (
                <Icon
                    path={iconCheck}
                    size="sm"
                />
            );
        }

        return (
            <Icon
                path={iconCopy}
                size="sm"
            />
        );
    }, [isFetching, copied]);

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
                    leftSection={leftSection}
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
            <Menu.Dropdown>
                <Menu.Item
                    bdrs="xs"
                    leftSection={
                        <ThemeIcon>
                            <Icon path={iconCopy} />
                        </ThemeIcon>
                    }
                    onClick={handleCopyMarkdown}
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
                            opacity={0.6}
                        >
                            Copy page content for LLMs
                        </Text>
                    </Stack>
                </Menu.Item>
                <Menu.Item
                    bdrs="xs"
                    leftSection={
                        <ThemeIcon>
                            <Icon path={iconChatGPT} />
                        </ThemeIcon>
                    }
                    rightSection={
                        <Icon
                            path={iconArrowUpRight}
                            size="sm"
                        />
                    }
                    onClick={() => handleOpenLLM("chatGpt")}
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
                            opacity={0.6}
                        >
                            Ask questions about this page
                        </Text>
                    </Stack>
                </Menu.Item>
                <Menu.Item
                    bdrs="xs"
                    leftSection={
                        <ThemeIcon>
                            <Icon path={iconClaude} />
                        </ThemeIcon>
                    }
                    rightSection={
                        <Icon
                            path={iconArrowUpRight}
                            size="sm"
                        />
                    }
                    onClick={() => handleOpenLLM("claude")}
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
                            opacity={0.6}
                        >
                            Ask questions about this page
                        </Text>
                    </Stack>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
