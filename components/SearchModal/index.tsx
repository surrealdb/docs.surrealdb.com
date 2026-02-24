import { Box, Flex, Modal, Text, TextInput } from "@mantine/core";
import { Icon, iconSearch } from "@surrealdb/ui";
import { useState } from "react";
import classes from "./style.module.scss";

export interface SearchModalProps {
    opened: boolean;
    onClose: () => void;
}

export function SearchModal({ opened, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="lg"
            padding={0}
            withCloseButton={false}
            classNames={{ body: classes.body }}
            aria-label="Search documentation"
        >
            <TextInput
                className={classes.input}
                placeholder="Search the docs..."
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                leftSection={
                    <Icon
                        path={iconSearch}
                        size="sm"
                    />
                }
                size="lg"
                autoFocus
                aria-label="Search query"
            />
            <Box className={classes.results}>
                {query.length > 0 ? (
                    <Flex
                        align="center"
                        justify="center"
                        p="xl"
                    >
                        <Text
                            c="dimmed"
                            fz="sm"
                        >
                            Search is not yet available
                        </Text>
                    </Flex>
                ) : (
                    <Flex
                        align="center"
                        justify="center"
                        p="xl"
                    >
                        <Text
                            c="dimmed"
                            fz="sm"
                        >
                            Start typing to search...
                        </Text>
                    </Flex>
                )}
            </Box>
        </Modal>
    );
}
