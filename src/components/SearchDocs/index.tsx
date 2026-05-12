import {
    Box,
    Flex,
    Group,
    Kbd,
    Loader,
    SimpleGrid,
    Stack,
    Text,
    UnstyledButton,
    type UnstyledButtonProps,
} from "@mantine/core";
import { useDebouncedValue, useHotkeys, useInputState, useOs } from "@mantine/hooks";
import {
    Spotlight,
    type SpotlightActionData,
    type SpotlightFilterFunction,
    spotlight,
} from "@mantine/spotlight";
import { Icon, iconArrowLeft, iconSearch } from "@surrealdb/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { getProductFromPath } from "~/utils/product";
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
    const [search, setSearch] = useInputState("");
    const [debouncedSearch] = useDebouncedValue(search.trim(), 250);
    const [rateLimitRemaining, setRateLimitRemaining] = useState(0);
    const os = useOs();
    const { urlPathname } = usePageContext();
    const product = getProductFromPath(urlPathname);

    const hasTypedQuery = search.trim().length > 0;

    const searchQuery = useQuery({
        queryKey: ["docs-search", debouncedSearch, product] as const,
        queryFn: async ({ signal }) => {
            const results = await searchDocs(debouncedSearch, signal, product);

            window.dataLayer?.push({
                event: "search_query",
                search_term: debouncedSearch,
                search_product: product,
            });

            return results;
        },
        enabled: debouncedSearch.length > 0,
        placeholderData: keepPreviousData,
        retry: false,
    });

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

    useEffect(() => {
        if (searchQuery.error instanceof RateLimitError) {
            setRateLimitRemaining(searchQuery.error.retryAfterSeconds ?? 10);
        } else if (!searchQuery.error) {
            setRateLimitRemaining(0);
        }
    }, [searchQuery.error]);

    const loading = hasTypedQuery && (search.trim() !== debouncedSearch || searchQuery.isFetching);

    const errorMessage =
        searchQuery.error instanceof RateLimitError
            ? null
            : searchQuery.error instanceof SearchError
              ? searchQuery.error.message
              : searchQuery.error
                ? "Something went wrong — please try again"
                : null;

    const actions = useMemo(() => {
        if (!hasTypedQuery || debouncedSearch.length === 0) return [];
        return mapResultsToActions(searchQuery.data ?? [], debouncedSearch);
    }, [debouncedSearch, hasTypedQuery, searchQuery.data]);

    const modKey = os === "macos" ? "⌘" : "Ctrl";
    const hasQuery = hasTypedQuery;

    let nothingFound: ReactNode;

    if (rateLimitRemaining > 0) {
        nothingFound = `Too many requests — try again in ${rateLimitRemaining}s`;
    } else if (errorMessage) {
        nothingFound = errorMessage;
    } else if (searchQuery.isSuccess && debouncedSearch.length > 0 && actions.length === 0) {
        nothingFound = "No results found";
    } else {
        nothingFound = <SearchTutorial modKey={modKey} />;
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
                <Group gap="sm">
                    <Icon
                        path={iconSearch}
                        size="sm"
                    />
                    <Text fz="sm">Search the docs</Text>
                    <Flex
                        align="center"
                        gap={4}
                        ml="auto"
                    >
                        <Kbd size="xs">{modKey}</Kbd>
                        <Kbd size="xs">K</Kbd>
                    </Flex>
                </Group>
            </UnstyledButton>
            <Spotlight
                actions={hasQuery ? actions : []}
                nothingFound={nothingFound}
                filter={noFilter}
                scrollable
                maxHeight={500}
                transitionProps={{ transition: "fade-down" }}
                overlayProps={{ blur: 0 }}
                classNames={{
                    inner: classes.searchScreen,
                    actionsList: classes.searchList,
                    content: classes.searchContent,
                    search: classes.searchInput,
                    empty: classes.searchEmpty,
                }}
                searchProps={{
                    placeholder: "Search the docs",
                    leftSection: loading ? <Loader size="xs" /> : <Icon path={iconSearch} />,
                    autoFocus: true,
                    onChange: setSearch,
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

function SearchTutorial({ modKey }: { modKey: string }) {
    return (
        <Stack pt={90}>
            <Text fz="lg">Enter a search term to find documentation</Text>
            <SimpleGrid
                cols={2}
                mt="xl"
            >
                <Box ta="right">
                    <Kbd>{modKey} + K</Kbd>
                </Box>
                <Box ta="left">
                    <Text>to open the search</Text>
                </Box>
                <Box ta="right">
                    <Kbd>
                        <Icon
                            path={iconArrowLeft}
                            style={{ transform: "rotate(-90deg)" }}
                        />
                    </Kbd>
                </Box>
                <Box ta="left">
                    <Text>to navigate down</Text>
                </Box>
                <Box ta="right">
                    <Kbd>
                        <Icon
                            path={iconArrowLeft}
                            style={{ transform: "rotate(90deg)" }}
                        />
                    </Kbd>
                </Box>
                <Box ta="left">
                    <Text>to navigate up</Text>
                </Box>
                <Box ta="right">
                    <Kbd>Esc</Kbd>
                </Box>
                <Box ta="left">
                    <Text>to close the search</Text>
                </Box>
            </SimpleGrid>
        </Stack>
    );
}
