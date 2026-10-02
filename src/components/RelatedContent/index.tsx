import { Anchor, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { Icon, iconNewspaper, iconUniversity } from "@surrealdb/ui";
import {
    RELATED_SOURCE_LABELS,
    RELATED_TITLE,
    type RelatedItem,
    relatedHref,
} from "~/utils/related";

const ICONS: Record<RelatedItem["kind"], string> = {
    lesson: iconUniversity,
    post: iconNewspaper,
};

export interface RelatedContentProps {
    items: RelatedItem[];
}

/**
 * University lessons and blog posts on the subject of the current page, shown
 * at the end of the page for a reader who wants a course or a longer story.
 * Renders nothing when there are no related items.
 */
export function RelatedContent({ items }: RelatedContentProps) {
    if (items.length === 0) return null;

    return (
        <Paper
            withBorder
            p="lg"
            mt="3xl"
            component="aside"
            aria-labelledby="related-content-title"
        >
            <Text
                id="related-content-title"
                fw={600}
                c="bright"
                mb="md"
            >
                {RELATED_TITLE}
            </Text>
            <Stack gap="sm">
                {items.map((item) => {
                    return (
                        <Group
                            key={item.url}
                            gap="sm"
                            wrap="nowrap"
                            align="start"
                        >
                            <Icon
                                path={ICONS[item.kind]}
                                color="violet"
                                mt={2}
                            />
                            <Box miw={0}>
                                <Anchor
                                    href={relatedHref(item)}
                                    fw={500}
                                >
                                    {item.title}
                                </Anchor>
                                <Text
                                    fz="sm"
                                    c="dimmed"
                                >
                                    {item.section
                                        ? `${item.section} · ${RELATED_SOURCE_LABELS[item.kind]}`
                                        : RELATED_SOURCE_LABELS[item.kind]}
                                </Text>
                            </Box>
                        </Group>
                    );
                })}
            </Stack>
        </Paper>
    );
}
