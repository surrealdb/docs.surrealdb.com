import {
    Anchor,
    Box,
    Image,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    useComputedColorScheme,
} from "@mantine/core";
import { Icon, iconSearch } from "@surrealdb/ui";
import { useEffect, useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import LabsDark from "~/assets/img/logo/dark/labs.svg";
import LabsLight from "~/assets/img/logo/light/labs.svg";
import { FilterSidebar } from "~/components/FilterSidebar";
import { LabCard } from "~/components/LabCard";
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
    const computedScheme = useComputedColorScheme();
    const isDark = computedScheme === "dark";

    const labsLogo = isDark ? LabsDark : LabsLight;

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
                if (!item.title.toLowerCase().includes(q)) {
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

    return (
        <Stack
            gap="lg"
            pb="xl"
        >
            <Box className={classes.hero}>
                <Image
                    src={labsLogo}
                    alt="SurrealDB Labs"
                    height={32}
                    fit="contain"
                    mb="lg"
                    w="auto"
                />
                <Text
                    fz="sm"
                    maw={640}
                >
                    Explore official and community examples, tools, libraries, and integrations
                    built around SurrealDB - all in one place. Find client SDKs, videos, development
                    tools, and learning resources to help you build and scale your applications.
                    Have something to share? Check out our{" "}
                    <Anchor
                        href="https://github.com/surrealdb/docs.surrealdb.com?tab=readme-ov-file#creating-a-new-lab"
                        target="_blank"
                        rel="noopener noreferrer"
                        fz="sm"
                    >
                        guide on creating a new Lab
                    </Anchor>{" "}
                    to contribute your own.
                </Text>
            </Box>

            <TextInput
                placeholder="What are you looking for?"
                leftSection={
                    <Icon
                        path={iconSearch}
                        size="sm"
                    />
                }
                size="md"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
            />

            <Box className={classes.page}>
                <FilterSidebar
                    authorFilter={authorFilter}
                    setAuthorFilter={setAuthorFilter}
                    languageFilter={languageFilter}
                    setLanguageFilter={setLanguageFilter}
                    topicFilter={topicFilter}
                    setTopicFilter={setTopicFilter}
                />

                {filtered.length > 0 ? (
                    <SimpleGrid
                        cols={{ base: 1, sm: 2, lg: 3 }}
                        w="852px"
                    >
                        {filtered.map((item) => (
                            <LabCard
                                key={item.slug}
                                item={item}
                                isDark={isDark}
                            />
                        ))}
                    </SimpleGrid>
                ) : (
                    <Box
                        className={classes.noResults}
                        w="852px"
                    >
                        <Text fz="lg">No labs found matching your criteria.</Text>
                    </Box>
                )}
            </Box>
        </Stack>
    );
}
