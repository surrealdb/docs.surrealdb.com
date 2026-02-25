import type { HeadingData } from "@lib/markdown";
import { Anchor, List, ListItem, Stack, Text } from "@mantine/core";
export const GITHUB_BASE = "https://github.com/surrealdb/docs.surrealdb.com/edit/main/src/content/";
export const GITHUB_ISSUES = "https://github.com/surrealdb/docs.surrealdb.com/issues/new";

export interface PageAsideProps {
    headings: HeadingData[];
    lastUpdated?: string;
}

export function PageAside({ headings, lastUpdated }: PageAsideProps) {
    return (
        <Stack
            component="aside"
            gap="lg"
            p="md"
            maw="260px"
            pos="sticky"
            top="0"
            right="2rem"
        >
            <Text
                c="bright"
                fw={700}
            >
                On this page
            </Text>
            <List listStyleType="none">
                {headings.map((heading) => (
                    <ListItem key={heading.id}>
                        <Anchor href={`#${heading.id}`}>{heading.text}</Anchor>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
