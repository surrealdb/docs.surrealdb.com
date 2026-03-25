import { Flex, Kbd, Text, UnstyledButton, type UnstyledButtonProps } from "@mantine/core";
import { useDebouncedCallback, useOs } from "@mantine/hooks";
import { Spotlight, type SpotlightActionData, spotlight } from "@mantine/spotlight";
import { clsx, Icon, iconSearch } from "@surrealdb/ui";
import { type ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { searchDocs } from "~/utils/search";
import classes from "./style.module.scss";

export function SearchDocs(props: UnstyledButtonProps) {
    const os = useOs();
    const [actions, setActions] = useState<SpotlightActionData[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);

    const debouncedSearch = useDebouncedCallback(async (value: string) => {
        controllerRef.current?.abort();
        controllerRef.current = null;

        if (!value) {
            setActions([]);
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        controllerRef.current = controller;
        setLoading(true);

        try {
            const results = await searchDocs(value, controller.signal);

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
        } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError")) {
                throw error;
            }
        } finally {
            if (controllerRef.current === controller) {
                setLoading(false);
            }
        }
    }, 300);

    const handleSearch = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            const value = event.currentTarget.value;
            setSearch(value);
            debouncedSearch(value);
        },
        [debouncedSearch],
    );

    useEffect(
        () => () => {
            controllerRef.current?.abort();
        },
        [],
    );

    return (
        <>
            <UnstyledButton
                className={classes.search}
                aria-label="Search documentation"
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
                        flex={1}
                    >
                        Search the docs
                    </Text>
                    {os !== "undetermined" && (
                        <Kbd
                            fz="xs"
                            className={classes.shortcut}
                        >
                            {os === "macos" ? "⌘" : "Ctrl"} K
                        </Kbd>
                    )}
                </Flex>
            </UnstyledButton>
            <Spotlight
                actions={search.length > 0 ? actions : []}
                nothingFound={loading ? "Searching…" : "No results found"}
                shortcut="mod+K"
                scrollable
                maxHeight={400}
                classNames={{
                    content: clsx(classes.content, loading && classes.contentLoading),
                    actionsList: classes.searchInput,
                }}
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
