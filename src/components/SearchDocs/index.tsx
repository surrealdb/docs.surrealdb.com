import { Flex, Kbd, Loader, Text, UnstyledButton, type UnstyledButtonProps } from "@mantine/core";
import { useDebouncedCallback, useHotkeys, useOs } from "@mantine/hooks";
import { Spotlight, type SpotlightActionData, spotlight } from "@mantine/spotlight";
import { Icon, iconSearch } from "@surrealdb/ui";
import { type ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { searchDocs } from "~/utils/search";
import classes from "./style.module.scss";

export function SearchDocs(props: UnstyledButtonProps) {
    const [actions, setActions] = useState<SpotlightActionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const abortController = useRef<AbortController | null>(null);
    const os = useOs();

    useHotkeys([["mod+K", () => spotlight.open()]]);

    const executeSearch = useDebouncedCallback(async (value: string) => {
        setLoading(true);

        const controller = new AbortController();

        try {
            abortController.current?.abort();
            abortController.current = controller;

            const results = await searchDocs(value, abortController.current.signal);

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
            if (abortController.current === controller) {
                setLoading(false);
            }
        }
    }, 500);

    const handleSearch = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            const value = event.currentTarget.value;
            setSearch(value);
            executeSearch(value);
        },
        [executeSearch],
    );

    useEffect(() => {
        return () => {
            abortController.current?.abort();
        };
    }, []);

    const modKey = os === "macos" ? "⌘" : "Ctrl";

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
                    >
                        Search the docs
                    </Text>
                    <Flex
                        align="center"
                        gap={4}
                        ml="auto"
                    >
                        <Kbd size="xs">{modKey}</Kbd>
                        <Kbd size="xs">K</Kbd>
                    </Flex>
                </Flex>
            </UnstyledButton>
            <Spotlight
                actions={search.length > 0 ? actions : []}
                nothingFound={search.length > 0 ? "No results found" : undefined}
                highlightQuery
                classNames={{
                    inner: classes.searchScreen,
                    actionsList: classes.searchList,
                }}
                searchProps={{
                    placeholder: "Search the docs",
                    leftSection: loading ? <Loader size="xs" /> : <Icon path={iconSearch} />,
                    autoFocus: true,
                    onChange: handleSearch,
                    value: search,
                    className: classes.searchInput,
                    rightSection: <Kbd>Esc</Kbd>,
                    mod: {
                        expanded: actions.length > 0 && search.length > 0,
                    },
                }}
            />
        </>
    );
}
