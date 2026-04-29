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
import { RateLimitError, SearchError, type SearchResult, searchDocs } from "~/utils/search";
import { SearchResultCard } from "./SearchResult";
import classes from "./style.module.scss";

function mapResultsToActions(results: SearchResult[], query: string): SpotlightActionData[] {
    return results.map((result, index) => ({
        id: `result-${index}`,
        label: String(result.title ?? ""),
        onClick: () => {
            window.dataLayer?.push({
                event: "search_result_click",
                search_term: query,
                result_url: result.url,
            });
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [rateLimitRemaining, setRateLimitRemaining] = useState(0);
    const abortController = useRef<AbortController | null>(null);
    const os = useOs();

    const openSearch = useCallback(() => {
        spotlight.open();
        window.dataLayer?.push({ event: "search_opened" });
    }, []);

    useHotkeys([["mod+K", openSearch]]);

    useEffect(() => {
        if (rateLimitRemaining <= 0) return;
        const timer = setTimeout(() => setRateLimitRemaining((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [rateLimitRemaining]);

    const executeSearch = useDebouncedCallback(async (value: string) => {
        if (!value.trim()) {
            setActions([]);
            setErrorMessage(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        const controller = new AbortController();

        try {
            abortController.current?.abort();
            abortController.current = controller;

            const results = await searchDocs(value, controller.signal);
            window.dataLayer?.push({ event: "search_query", search_term: value });

            setRateLimitRemaining(0);
            setActions(mapResultsToActions(results, value));
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            setActions([]);

            if (error instanceof RateLimitError) {
                setRateLimitRemaining(error.retryAfterSeconds ?? 10);
            } else if (error instanceof SearchError) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Something went wrong — please try again");
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

    let nothingFound: string | undefined;

    if (rateLimitRemaining > 0) {
        nothingFound = `Too many requests — try again in ${rateLimitRemaining}s`;
    } else if (errorMessage) {
        nothingFound = errorMessage;
    } else if (hasQuery && !loading) {
        nothingFound = "No results found";
    }

    return (
        <>
            <UnstyledButton
                className={classes.search}
                aria-label="Search documentation"
                py={8}
                px="md"
                mb="md"
                w="100%"
                onClick={openSearch}
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
