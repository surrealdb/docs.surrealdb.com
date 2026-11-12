import {
    ActionIcon,
    Anchor,
    Box,
    Button,
    Group,
    SimpleGrid,
    Switch,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { useClipboard, useDisclosure } from "@mantine/hooks";
import { Icon, iconSearch, iconSidebar } from "@surrealdb/ui";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { FilterSidebar } from "~/components/FilterSidebar";
import { LabCard } from "~/components/LabCard";
import { Shell, ShellContent, ShellDrawer } from "~/components/Layout/shell";
import { labFormats, labLanguages, labStages, labTopics } from "~/utils/labs";
import type { LabsPageData } from "./+data";
import classes from "./style.module.scss";

type FilterGroup = "stage" | "format" | "language" | "topic";

/** The `?filters=` key for a value, which can have spaces: "Source code" is `source-code`. */
const filterKey = (value: string) => value.toLowerCase().replaceAll(" ", "-");

const FILTER_LOOKUP: Record<string, { group: FilterGroup; value: string }> = {};

const FILTER_VALUES: [FilterGroup, readonly string[]][] = [
    ["stage", labStages],
    ["format", labFormats],
    ["language", labLanguages],
    ["topic", labTopics],
];

for (const [group, values] of FILTER_VALUES) {
    for (const value of values) {
        FILTER_LOOKUP[filterKey(value)] = { group, value };
    }
}

function parseFiltersFromURL(): {
    stage: string[];
    format: string[];
    language: string[];
    topic: string[];
    items: string[];
} {
    const result = {
        stage: [] as string[],
        format: [] as string[],
        language: [] as string[],
        topic: [] as string[],
        items: [] as string[],
    };

    if (typeof window === "undefined") return result;

    const params = new URLSearchParams(window.location.search);
    result.items = params.get("items")?.split(",").filter(Boolean) ?? [];

    const raw = params.get("filters");
    if (!raw) return result;

    for (const segment of raw.split(",")) {
        const match = FILTER_LOOKUP[segment.trim().toLowerCase()];
        if (match) {
            result[match.group].push(match.value);
        }
    }

    return result;
}

export default function Page() {
    const { items } = useData<LabsPageData>();
    const [filtersOpened, { toggle: toggleFilters, close: closeFilters }] = useDisclosure();

    const initial = useMemo(() => parseFiltersFromURL(), []);

    const [search, setSearch] = useState("");
    const [stageFilter, setStageFilter] = useState<string[]>(initial.stage);
    const [formatFilter, setFormatFilter] = useState<string[]>(initial.format);
    const [languageFilter, setLanguageFilter] = useState<string[]>(initial.language);
    const [topicFilter, setTopicFilter] = useState<string[]>(initial.topic);
    const [selected, setSelected] = useState<string[]>(initial.items);
    const [selecting, setSelecting] = useState(false);
    const clipboard = useClipboard();

    // Stable, so memoised cards skip re-rendering when only the selection changes elsewhere.
    const toggleSelected = useCallback(
        (slug: string) =>
            setSelected((prev) =>
                prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
            ),
        [],
    );

    // The input updates at once; the grid re-filters at low priority, so typing
    // never waits on a few hundred cards rendering.
    const deferredSearch = useDeferredValue(search);
    const selectedSet = useMemo(() => new Set(selected), [selected]);
    const searchText = useMemo(
        () =>
            new Map(
                items.map((item) => [
                    item.slug,
                    `${item.title}\n${item.description ?? ""}`.toLowerCase(),
                ]),
            ),
        [items],
    );

    useEffect(() => {
        const all = [...stageFilter, ...formatFilter, ...languageFilter, ...topicFilter].map(
            filterKey,
        );

        const url = new URL(window.location.href);

        if (all.length > 0) {
            url.searchParams.set("filters", all.join(","));
        } else {
            url.searchParams.delete("filters");
        }

        if (selected.length > 0) {
            url.searchParams.set("items", selected.join(","));
        } else {
            url.searchParams.delete("items");
        }

        window.history.replaceState(null, "", url.toString());
    }, [stageFilter, formatFilter, languageFilter, topicFilter, selected]);

    const filtered = useMemo(() => {
        const q = deferredSearch.trim().toLowerCase();

        return items.filter((item) => {
            // A shared selection narrows the list to the picked labs, except
            // while picking, when every lab has to stay reachable.
            if (!selecting && selectedSet.size > 0 && !selectedSet.has(item.slug)) {
                return false;
            }

            if (q && !searchText.get(item.slug)?.includes(q)) {
                return false;
            }

            if (stageFilter.length > 0 && !stageFilter.includes(item.stage)) {
                return false;
            }

            if (formatFilter.length > 0 && !formatFilter.includes(item.format)) {
                return false;
            }

            if (languageFilter.length > 0) {
                const langs = item.languages ?? [];
                if (!languageFilter.some((l) => langs.includes(l as never))) {
                    return false;
                }
            }

            if (topicFilter.length > 0) {
                if (!topicFilter.some((t) => item.topics.includes(t as never))) {
                    return false;
                }
            }

            return true;
        });
    }, [
        items,
        searchText,
        deferredSearch,
        stageFilter,
        formatFilter,
        languageFilter,
        topicFilter,
        selectedSet,
        selecting,
    ]);

    const filterProps = {
        stageFilter,
        setStageFilter,
        formatFilter,
        setFormatFilter,
        languageFilter,
        setLanguageFilter,
        topicFilter,
        setTopicFilter,
    };

    return (
        <>
            <ShellDrawer
                opened={filtersOpened}
                onClose={closeFilters}
            >
                <FilterSidebar {...filterProps} />
            </ShellDrawer>
            <Shell>
                {/* The rail has no product switcher above its sections, so it
                    starts higher than the body; the padding drops the first
                    heading level with the top of the page title. */}
                <FilterSidebar
                    visibleFrom="lg"
                    pt={40}
                    {...filterProps}
                />
                <ShellContent symmetric>
                    <Box
                        component="main"
                        id="main-content"
                    >
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            hiddenFrom="lg"
                            onClick={toggleFilters}
                            aria-label="Toggle filters"
                            mb="sm"
                        >
                            <Icon path={iconSidebar} />
                        </ActionIcon>
                        <Title
                            order={1}
                            c="bright"
                            fw={500}
                        >
                            SurrealDB Labs
                        </Title>
                        <Text
                            mt="sm"
                            maw={832}
                        >
                            Find client SDKs, videos, development tools, and learning resources to
                            help you build and scale your applications. To add your own, open a pull
                            request to{" "}
                            <Anchor
                                href="https://github.com/surrealdb/awesome-surreal/blob/main/CONTRIBUTING.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="vibrant"
                            >
                                awesome-surreal
                            </Anchor>
                            , where these entries are maintained.
                        </Text>

                        <Group
                            mt="xl"
                            gap="md"
                        >
                            <TextInput
                                flex={1}
                                miw={240}
                                placeholder="What are you looking for?"
                                leftSection={
                                    <Icon
                                        path={iconSearch}
                                        size="sm"
                                    />
                                }
                                size="md"
                                classNames={{ input: classes.searchInput }}
                                value={search}
                                onChange={(e) => setSearch(e.currentTarget.value)}
                            />
                            <Switch
                                label="Select labs"
                                checked={selecting}
                                onChange={(e) => setSelecting(e.currentTarget.checked)}
                            />
                            {selected.length > 0 && (
                                <Button
                                    variant="subtle"
                                    color="gray"
                                    onClick={() => setSelected([])}
                                >
                                    Clear selection ({selected.length})
                                </Button>
                            )}
                            <Button
                                variant="light"
                                onClick={() => clipboard.copy(window.location.href)}
                            >
                                {clipboard.copied ? "Link copied" : "Copy share link"}
                            </Button>
                        </Group>

                        {filtered.length > 0 ? (
                            <SimpleGrid
                                className={classes.gridWrap}
                                cols={{ base: 1, lg: 2 }}
                                spacing="lg"
                                mt="lg"
                            >
                                {filtered.map((item) => (
                                    <LabCard
                                        key={item.slug}
                                        item={item}
                                        selected={selectedSet.has(item.slug)}
                                        onSelect={selecting ? toggleSelected : undefined}
                                    />
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Box className={classes.noResults}>
                                <Text fz="lg">No labs found matching your criteria.</Text>
                            </Box>
                        )}
                    </Box>
                </ShellContent>
            </Shell>
        </>
    );
}
