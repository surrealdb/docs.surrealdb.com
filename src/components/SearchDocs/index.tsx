import { Flex, Kbd, Loader, Text, UnstyledButton, type UnstyledButtonProps } from "@mantine/core";
import { useDebouncedCallback, useHotkeys, useOs } from "@mantine/hooks";
import {
    Spotlight,
    type SpotlightActionData,
    type SpotlightFilterFunction,
    spotlight,
} from "@mantine/spotlight";
import { Icon, iconSearch } from "@surrealdb/ui";
import { type ChangeEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { type SearchResult, searchDocs } from "~/utils/search";
import { SearchResultCard } from "./SearchResult";
import classes from "./style.module.scss";

function mapResultsToActions(results: SearchResult[], query: string): SpotlightActionData[] {
    return results.map((result, index) => ({
        id: `result-${index}`,
        label: String(result.title ?? ""),
        onClick: () => {
            window.location.href = String(result.url ?? "/");
        },
        children: (
            <SearchResultCard
                result={result}
                query={query}
            />
        ),
    }));
}

const noFilter: SpotlightFilterFunction = (_query, actions) => actions;

export function SearchDocs(props: UnstyledButtonProps) {
    const [actions, setActions] = useState<SpotlightActionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const abortController = useRef<AbortController | null>(null);
    const os = useOs();

    useHotkeys([["mod+K", () => spotlight.open()]]);

    const executeSearch = useDebouncedCallback(async (value: string) => {
        if (!value.trim()) {
            setActions([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const controller = new AbortController();

        try {
            abortController.current?.abort();
            abortController.current = controller;

            const results = await searchDocs(value, controller.signal);

            setActions(mapResultsToActions(results, value));
        } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError")) {
                throw error;
            }
        } finally {
            if (abortController.current === controller) {
                setLoading(false);
            }
        }
    }, 250);

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
    const hasQuery = search.trim().length > 0;
    const nothingFound = hasQuery && !loading ? "No results found" : undefined;

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
                actions={hasQuery ? actions : []}
                nothingFound={nothingFound}
                filter={noFilter}
                scrollable
                maxHeight={500}
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
                        expanded: actions.length > 0 && hasQuery,
                    },
                }}
            />
        </>
    );
}
