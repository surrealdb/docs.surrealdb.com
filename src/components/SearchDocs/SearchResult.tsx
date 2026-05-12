import { Box, Breadcrumbs, Group, Highlight, Stack, Text } from "@mantine/core";
import { Icon, iconFile, iconText } from "@surrealdb/ui";
import { useState } from "react";
import type { SearchResultItem, SearchResult as SearchResultType } from "~/utils/search";
import classes from "./style.module.scss";

function tokenizeQuery(query: string): string[] {
    return query.split(/[\s\-_/]+/).filter((t) => t.length > 1);
}

function ResultEntry({ item, query }: { item: SearchResultItem; query: string }) {
    const isSection = item.kind === "section";
    const title = String(item.title ?? "");
    const snippet = typeof item.content === "string" ? item.content : "";
    const highlightTokens = tokenizeQuery(query);

    return (
        <Group
            gap="sm"
            align="flex-start"
            wrap="nowrap"
        >
            <Icon
                path={isSection ? iconText : iconFile}
                size="md"
                color="slate.3"
                mt={2}
            />
            <Stack
                gap={2}
                className={classes.resultContent}
            >
                <Highlight
                    truncate
                    highlight={highlightTokens}
                    className={classes.resultTitle}
                >
                    {title}
                </Highlight>
                {snippet && (
                    <Highlight
                        highlight={highlightTokens}
                        className={classes.resultSnippet}
                        lineClamp={2}
                    >
                        {snippet}
                    </Highlight>
                )}
            </Stack>
        </Group>
    );
}

interface SearchResultProps {
    result: SearchResultType;
    query: string;
}

export function SearchResultCard({ result, query }: SearchResultProps) {
    const [expanded, setExpanded] = useState(false);
    const more = Array.isArray(result.more) ? result.more : [];
    const preview = more.slice(0, 1);
    const hidden = more.slice(1);
    const hasHidden = hidden.length > 0;

    const breadcrumb = String(result.breadcrumb ?? "");
    const parts = breadcrumb.split(" > ").filter(Boolean);

    return (
        <Group
            gap="xs"
            className={classes.resultCard}
        >
            <Box>
                <Breadcrumbs
                    fz="xs"
                    ml={26}
                    className={classes.resultBreadcrumb}
                >
                    {parts.map((part, i) => (
                        <Text
                            key={`${part}-${i}`}
                            fz="xs"
                            lh="unset"
                        >
                            {part}
                        </Text>
                    ))}
                </Breadcrumbs>
                <ResultEntry
                    item={result}
                    query={query}
                />
                {preview.map((item, i) => (
                    <Box
                        key={`more-${i}`}
                        className={classes.resultMore}
                    >
                        <ResultEntry
                            item={item}
                            query={query}
                        />
                    </Box>
                ))}
                {expanded &&
                    hidden.map((item, i) => (
                        <Box
                            key={`hidden-${i}`}
                            className={classes.resultMore}
                        >
                            <ResultEntry
                                item={item}
                                query={query}
                            />
                        </Box>
                    ))}
                {hasHidden && (
                    <Text
                        fz="xs"
                        c="surreal"
                        className={classes.resultShowMore}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setExpanded((v) => !v);
                        }}
                    >
                        {expanded
                            ? "Show less"
                            : `+${hidden.length} more result${hidden.length > 1 ? "s" : ""} on this page`}
                    </Text>
                )}
            </Box>
        </Group>
    );
}
