import { ActionIcon, Anchor, Box, SimpleGrid, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon, iconSearch, iconSidebar } from "@surrealdb/ui";
import { useEffect, useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { FilterSidebar } from "~/components/FilterSidebar";
import { LabCard } from "~/components/LabCard";
import { Shell, ShellContent, ShellDrawer } from "~/components/Layout/shell";
import { labLanguages, labTopics } from "~/utils/labs";
import type { LabsPageData } from "./+data";
import classes from "./style.module.scss";

type FilterGroup = "author" | "language" | "topic";

const FILTER_LOOKUP: Record<string, { group: FilterGroup; value: string }> = {
    official: { group: "author", value: "official" },
    community: { group: "author", value: "community" },
};

for (const lang of labLanguages) {
    FILTER_LOOKUP[lang.toLowerCase()] = { group: "language", value: lang };
}

for (const topic of labTopics) {
    FILTER_LOOKUP[topic.toLowerCase()] = { group: "topic", value: topic };
}

function parseFiltersFromURL(): {
    author: string[];
    language: string[];
    topic: string[];
} {
    const result = { author: [] as string[], language: [] as string[], topic: [] as string[] };

    if (typeof window === "undefined") return result;

    const params = new URLSearchParams(window.location.search);
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
    const [authorFilter, setAuthorFilter] = useState<string[]>(initial.author);
    const [languageFilter, setLanguageFilter] = useState<string[]>(initial.language);
    const [topicFilter, setTopicFilter] = useState<string[]>(initial.topic);

    useEffect(() => {
        const all = [
            ...authorFilter,
            ...languageFilter.map((l) => l.toLowerCase()),
            ...topicFilter.map((t) => t.toLowerCase()),
        ];

        const url = new URL(window.location.href);

        if (all.length > 0) {
            url.searchParams.set("filters", all.join(","));
        } else {
            url.searchParams.delete("filters");
        }

        window.history.replaceState(null, "", url.toString());
    }, [authorFilter, languageFilter, topicFilter]);

    const filtered = useMemo(() => {
        return items.filter((item) => {
            if (search) {
                const q = search.toLowerCase();
                const inTitle = item.title.toLowerCase().includes(q);
                const desc = item.description?.toLowerCase() ?? "";
                const inDesc = desc.length > 0 && desc.includes(q);
                if (!inTitle && !inDesc) {
                    return false;
                }
            }

            if (authorFilter.length > 0) {
                const isOfficial = item.author === "surrealdb";
                const matchOfficial = authorFilter.includes("official") && isOfficial;
                const matchCommunity = authorFilter.includes("community") && !isOfficial;
                if (!matchOfficial && !matchCommunity) {
                    return false;
                }
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
    }, [items, search, authorFilter, languageFilter, topicFilter]);

    const filterProps = {
        authorFilter,
        setAuthorFilter,
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
                            fz="xl"
                            mt="md"
                            maw={832}
                        >
                            Explore official and community examples, tools, libraries, and
                            integrations built around SurrealDB - all in one place.
                        </Text>
                        <Text
                            mt="sm"
                            maw={832}
                        >
                            Find client SDKs, videos, development tools, and learning resources to
                            help you build and scale your applications. Have something to share?
                            Check out our{" "}
                            <Anchor
                                href="https://github.com/surrealdb/docs.surrealdb.com?tab=readme-ov-file#creating-a-new-lab"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="vibrant"
                            >
                                guide on creating a new Lab
                            </Anchor>{" "}
                            to contribute your own.
                        </Text>

                        <TextInput
                            placeholder="What are you looking for?"
                            leftSection={
                                <Icon
                                    path={iconSearch}
                                    size="sm"
                                />
                            }
                            size="md"
                            mt="xl"
                            classNames={{ input: classes.searchInput }}
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                        />

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
