import { Flex, Kbd, Text, UnstyledButton } from "@mantine/core";
import { useOs } from "@mantine/hooks";
import { Icon, iconSearch } from "@surrealdb/ui";
import classes from "./style.module.scss";

export interface SearchDocsProps {
    onOpen: () => void;
}

export function SearchDocs({ onOpen }: SearchDocsProps) {
    const os = useOs();
    const modKey = os === "macos" ? "\u2318" : "Ctrl";

    return (
        <UnstyledButton
            className={classes.search}
            onClick={onOpen}
            aria-label="Search documentation"
            bg="obsidian.7"
            py={6}
            px="md"
            miw={300}
        >
            <Flex
                align="center"
                gap="xs"
            >
                <Icon
                    path={iconSearch}
                    size="sm"
                />
                <Text
                    fz="sm"
                    c="dimmed"
                >
                    Search the docs
                </Text>
            </Flex>
            <Flex
                gap={4}
                className={classes.kbd}
            >
                <Kbd fz="xs">{modKey}</Kbd>
                <Kbd fz="xs">/</Kbd>
            </Flex>
        </UnstyledButton>
    );
}
