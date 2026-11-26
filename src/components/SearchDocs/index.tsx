import {
    Box,
    Flex,
    Group,
    Kbd,
    Loader,
    Stack,
    Text,
    UnstyledButton,
    type UnstyledButtonProps,
    VisuallyHidden,
} from "@mantine/core";
import { useDebouncedValue, useHotkeys, useInputState, useOs } from "@mantine/hooks";
import { Spotlight, type SpotlightActionData, spotlight } from "@mantine/spotlight";
import { Icon, iconArrowLeft, iconSearch } from "@surrealdb/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { linkUrl, searchTerm, trackEvent } from "~/utils/analytics";
import { getProductFromPath, PRODUCT_META } from "~/utils/product";
import { RateLimitError, SearchError, type SearchResult, searchDocs } from "~/utils/search";
import { SearchResultCard } from "./SearchResult";
import classes from "./style.module.scss";

/**
 * How long the query has to stay unchanged before it counts as a search. The
 * results update on a shorter debounce while the reader types, and reporting
 * each of those would count every prefix of a term as a search of its own.
 */
const SEARCH_SETTLE_DELAY = 1000;

/** Opens the search panel and reports it, for every control that opens it. */
export function openDocsSearch() {
    spotlight.open();
    trackEvent("search_opened");
}

function mapResultsToActions(
    results: SearchResult[],
    query: string,
    onSelect: (result: SearchResult) => void,
): SpotlightActionData[] {
    return results.map((result, index) => ({
        id: `result-${index}`,
        label: String(result.title ?? ""),
        // A real anchor rather than a button-with-navigation: middle-click,
        // ctrl-click, copy-link and crawler semantics all come back, and the
        // browser owns the navigation. The click handler only reports.
        component: "a",
        href: String(result.url ?? "/"),
        onClick: () => onSelect(result),
        children: (
            <SearchResultCard
                result={result}
                query={query}
            />
        ),
    })) as SpotlightActionData[];
}

export function SearchDocs(props: UnstyledButtonProps) {
    const [search, setSearch] = useInputState("");
    const [debouncedSearch] = useDebouncedValue(search.trim(), 250);
    const [settledSearch] = useDebouncedValue(search.trim(), SEARCH_SETTLE_DELAY);
    const lastReportedSearch = useRef("");
    // The input as it stood when a result was chosen. The panel closes but keeps
    // the text, so a term typed just before the click would still settle and be
    // reported as a search of its own; it is not reported until the input changes.
    const chosenSearch = useRef("");
    const currentSearch = useRef("");
    currentSearch.current = search.trim();
    const [rateLimitRemaining, setRateLimitRemaining] = useState(0);
    const os = useOs();
    const { urlPathname } = usePageContext();
    const product = getProductFromPath(urlPathname);

    const hasTypedQuery = search.trim().length > 0;

    const searchQuery = useQuery({
        queryKey: ["docs-search", debouncedSearch, product] as const,
        // The term travels with its results, so while the next term loads, the
        // list on screen and what a click reports both still name the term the
        // results came from.
        queryFn: async ({ signal }) => ({
            term: debouncedSearch,
            results: await searchDocs(debouncedSearch, signal, product),
        }),
        enabled: debouncedSearch.length > 0,
        placeholderData: keepPreviousData,
        retry: false,
    });

    // Each settled term is reported once, with its number of results, so a
    // search that finds nothing counts once each time it happens. The search
    // API also records the query of a search that finds nothing in the
    // `search_miss` table, but only when the edge cache misses, so that table
    // lists gaps without counting them.
    const reportSearch = useCallback(
        (term: string, resultCount: number) => {
            if (term === lastReportedSearch.current) return;
            lastReportedSearch.current = term;

            trackEvent("search", {
                search_term: searchTerm(term),
                search_product: product,
                result_count: resultCount,
            });
        },
        [product],
    );

    // The results of the settled term, once they have arrived. Until then the
    // list can still hold an earlier term's results.
    const settledResults =
        searchQuery.isSuccess && settledSearch.length > 0 && searchQuery.data.term === settledSearch
            ? searchQuery.data.results
            : undefined;

    useEffect(() => {
        if (!settledSearch) {
            lastReportedSearch.current = "";
            chosenSearch.current = "";
            return;
        }
        if (settledSearch === chosenSearch.current) return;
        if (settledResults) reportSearch(settledSearch, settledResults.length);
    }, [settledSearch, settledResults, reportSearch]);

    // A click can come before the term has settled, so it reports the search
    // first. Both events name the term the clicked result came from, with that
    // term's count, which can trail what is in the input.
    const handleSelect = useCallback(
        (result: SearchResult, term: string, resultCount: number) => {
            chosenSearch.current = currentSearch.current;
            reportSearch(term, resultCount);
            trackEvent("search_result_click", {
                search_term: searchTerm(term),
                link_url: linkUrl(String(result.url ?? "/")),
            });
        },
        [reportSearch],
    );

    useHotkeys([["mod+K", openDocsSearch]]);

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
                ? "Something went wrong - please try again"
                : null;

    const actions = useMemo(() => {
        if (!hasTypedQuery || debouncedSearch.length === 0) return [];
        const data = searchQuery.data;
        if (!data) return [];
        return mapResultsToActions(data.results, data.term, (result) =>
            handleSelect(result, data.term, data.results.length),
        );
    }, [debouncedSearch, hasTypedQuery, searchQuery.data, handleSelect]);

    const modKey = os === "macos" ? "⌘" : "Ctrl";
    const hasQuery = hasTypedQuery;

    let nothingFound: ReactNode;

    if (rateLimitRemaining > 0) {
        nothingFound = `Too many requests - try again in ${rateLimitRemaining}s`;
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
                onClick={openDocsSearch}
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
                        <Kbd
                            size="xs"
                            className={classes.searchKey}
                        >
                            {modKey}
                        </Kbd>
                        <Kbd
                            size="xs"
                            className={classes.searchKey}
                        >
                            K
                        </Kbd>
                    </Flex>
                </Group>
            </UnstyledButton>
            {/* Announces result counts to screen readers; the list itself
                re-renders silently otherwise. */}
            <VisuallyHidden
                role="status"
                aria-live="polite"
            >
                {hasQuery && searchQuery.isSuccess
                    ? `${actions.length} result${actions.length === 1 ? "" : "s"} for ${debouncedSearch}`
                    : ""}
            </VisuallyHidden>
            {/* Composed rather than the `<Spotlight>` shorthand, which renders
                the search, the list and the empty state and nothing else -
                the scope line needs a footer beneath them. */}
            {/* `shortcut={null}` leaves `useHotkeys` above as the one handler of
                mod+K, so the shortcut always goes through `openDocsSearch`. */}
            <Spotlight.Root
                shortcut={null}
                scrollable
                maxHeight={500}
                transitionProps={{ transition: "fade-down" }}
                overlayProps={{ blur: 0, backgroundOpacity: 0.5 }}
                classNames={{
                    inner: classes.searchScreen,
                    body: classes.searchBody,
                    actionsList: classes.searchList,
                    action: classes.searchAction,
                    content: classes.searchContent,
                    search: classes.searchInput,
                    empty: classes.searchEmpty,
                }}
            >
                {/* The index is shared but the query is scoped to whichever
                    product the reader is currently in, so the panel names the
                    one it is searching rather than leaving another product's
                    page looking like a gap in the results. */}
                <Box className={classes.searchScope}>
                    <Text
                        fz="xs"
                        c="dimmed"
                    >
                        Searching{" "}
                        <Text
                            span
                            inherit
                            c="bright"
                            fw={500}
                        >
                            {PRODUCT_META[product].label}
                        </Text>{" "}
                        documentation
                    </Text>
                </Box>
                <Spotlight.Search
                    placeholder="Search the docs"
                    leftSection={loading ? <Loader size="xs" /> : <Icon path={iconSearch} />}
                    autoFocus
                    onChange={setSearch}
                    value={search}
                    className={classes.searchInput}
                    rightSection={<Kbd>Esc</Kbd>}
                    mod={{ expanded: actions.length > 0 && hasQuery }}
                />
                {actions.length > 0 ? (
                    <Spotlight.ActionsList>
                        {actions.map(({ id, ...action }) => (
                            <Spotlight.Action
                                key={id}
                                {...action}
                            />
                        ))}
                    </Spotlight.ActionsList>
                ) : (
                    <Spotlight.Empty>{nothingFound}</Spotlight.Empty>
                )}
            </Spotlight.Root>
        </>
    );
}

function SearchTutorial({ modKey }: { modKey: string }) {
    return (
        <Stack
            py={90}
            align="center"
        >
            <Text
                fz="lg"
                ta="center"
            >
                Enter a search term to find documentation
            </Text>
            {/* Both columns size to their content, so the block's real width
                is its visual width and centring it lines it up under the
                heading - a half-and-half split centres the gap instead. */}
            <Box
                mt="xl"
                className={classes.tutorialGrid}
            >
                <Kbd>{modKey} + K</Kbd>
                <Text>to open the search</Text>
                <Kbd>
                    <Icon
                        path={iconArrowLeft}
                        style={{ transform: "rotate(-90deg)" }}
                    />
                </Kbd>
                <Text>to navigate down</Text>
                <Kbd>
                    <Icon
                        path={iconArrowLeft}
                        style={{ transform: "rotate(90deg)" }}
                    />
                </Kbd>
                <Text>to navigate up</Text>
                <Kbd>Esc</Kbd>
                <Text>to close the search</Text>
            </Box>
        </Stack>
    );
}
