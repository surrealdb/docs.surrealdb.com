import { Flex, Text, UnstyledButton, type UnstyledButtonProps } from "@mantine/core";
import { useThrottledCallback } from "@mantine/hooks";
import { Spotlight, type SpotlightActionData, spotlight } from "@mantine/spotlight";
import { Icon, iconSearch } from "@surrealdb/ui";
import { searchDocs } from "@util/search";
import { type ChangeEventHandler, useCallback, useState } from "react";
import classes from "./style.module.scss";

export function SearchDocs(props: UnstyledButtonProps) {
    const [actions, setActions] = useState<SpotlightActionData[]>([]);
    const [search, setSearch] = useState("");

    const throttledSearch = useThrottledCallback(async (value: string) => {
        const results = await searchDocs(value);

        setActions(
            results.map((result) => ({
                id: result.url,
                label: result.title,
                description: result.description,
                component: "a",
                href: result.url,
                onClick: () => {
                    window.location.href = result.url;
                },
            })),
        );
    }, 300);

    const handleSearch = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            const value = event.currentTarget.value;
            setSearch(value);
            throttledSearch(value);
        },
        [throttledSearch],
    );

    return (
        <>
            <UnstyledButton
                className={classes.search}
                aria-label="Search documentation"
                bg="rgba(from var(--mantine-color-obsidian-7) r g b / 0.75)"
                py={8}
                px="md"
                mb="md"
                w="100%"
                onClick={spotlight.open}
                {...props}
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
            <Spotlight
                actions={search.length > 0 ? actions : []}
                nothingFound="No results found"
                shortcut="mod+/"
                scrollable
                maxHeight={400}
                searchProps={{
                    placeholder: "Search the docs",
                    autoFocus: true,
                    onChange: handleSearch,
                    value: search,
                }}
            />
        </>
    );
}
