import { Box, Breadcrumbs, Group, Highlight, Stack, Text } from "@mantine/core";
import { Icon, iconFile, iconText } from "@surrealdb/ui";
import { useState } from "react";
import type { SearchResultItem, SearchResult as SearchResultType } from "~/utils/search";
import classes from "./style.module.scss";

interface SearchResultProps {
    result: SearchResultType;
    query: string;
}

function ResultBreadcrumb({ breadcrumb }: { breadcrumb: string }) {
    const parts = breadcrumb.split(" > ").filter(Boolean);

    return (
        <Breadcrumbs
            fz="xs"
            separator={
                <Text
                    c="slate"
                    fz="xs"
                    fw={600}
                >
                    /
                </Text>
            }
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
    );
}

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
            <Box className={classes.resultIcon}>
                <Icon
                    path={isSection ? iconText : iconFile}
                    size="sm"
                />
            </Box>
            <Stack
                gap={2}
                className={classes.resultContent}
            >
                <Highlight
                    fz="sm"
                    fw={500}
                    truncate
                    highlight={highlightTokens}
                >
                    {title}
                </Highlight>
                {snippet && (
                    <Highlight
                        fz="xs"
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

export function SearchResultCard({ result, query }: SearchResultProps) {
    const [expanded, setExpanded] = useState(false);
    const breadcrumb = String(result.breadcrumb ?? "");
    const more = Array.isArray(result.more) ? result.more : [];
    const preview = more.slice(0, 1);
    const hidden = more.slice(1);
    const hasHidden = hidden.length > 0;

    return (
        <Stack
            gap="xs"
            className={classes.resultCard}
        >
            <ResultBreadcrumb breadcrumb={breadcrumb} />
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
        </Stack>
    );
}
