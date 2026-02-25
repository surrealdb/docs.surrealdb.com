import { Flex, Text, UnstyledButton } from "@mantine/core";
import { Icon, iconSearch } from "@surrealdb/ui";
import classes from "./style.module.scss";

export interface SearchDocsProps {
    onOpen: () => void;
}

export function SearchDocs({ onOpen }: SearchDocsProps) {
    return (
        <UnstyledButton
            className={classes.search}
            onClick={onOpen}
            aria-label="Search documentation"
            bg="rgba(from var(--mantine-color-obsidian-7) r g b / 0.75)"
            py={8}
            px="md"
            mb="md"
            w="100%"
        >
            <Flex
                align="center"
                gap="sm"
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
        </UnstyledButton>
    );
}
