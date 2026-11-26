import { Anchor, Box, Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon, iconBug, iconCheck, iconClose, iconEdit, Spacer, useStable } from "@surrealdb/ui";
import { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { GITHUB_BASE, GITHUB_ISSUES } from "~/components/PageAside";
import { FeedbackModal, type Sentiment } from "~/modals/FeedbackModal";

/** A date as the docs show it to a reader, such as "3 November 2026". */
function formatDate(date: string): string {
    // Fixed to UTC so the server and the browser render the same day.
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(date));
}

export interface PageContentActionsProps {
    /** The page's source file, relative to `src/content`. */
    contentPath: string;
    /** When the page's source last changed, as an ISO 8601 date, if known. */
    lastModified?: string;
}

export function PageContentActions({ contentPath, lastModified }: PageContentActionsProps) {
    const { urlPathname } = usePageContext();
    const editUrl = `${GITHUB_BASE}${contentPath}`;

    const [opened, { open, close }] = useDisclosure(false);
    const [sentiment, setSentiment] = useState<Sentiment>("helpful");

    const handleSentiment = useStable((sentiment: Sentiment) => {
        setSentiment(sentiment);
        open();
    });

    return (
        <>
            <Group
                gap="sm"
                mt="xl"
                align="flex-end"
            >
                <Box>
                    <Text
                        fz="sm"
                        fw={600}
                    >
                        Was this page helpful?
                    </Text>
                    <Group
                        mt="xs"
                        gap="sm"
                    >
                        <Button
                            onClick={() => handleSentiment("helpful")}
                            leftSection={<Icon path={iconCheck} />}
                            size="xs"
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={() => handleSentiment("not-helpful")}
                            leftSection={<Icon path={iconClose} />}
                            size="xs"
                        >
                            No
                        </Button>
                    </Group>
                </Box>
                <Spacer />
                {lastModified && (
                    <Text
                        fz="sm"
                        c="dimmed"
                    >
                        Last updated{" "}
                        <Box
                            component="time"
                            dateTime={lastModified}
                        >
                            {formatDate(lastModified)}
                        </Box>
                    </Text>
                )}
                <Anchor
                    href={editUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="never"
                >
                    <Button
                        leftSection={<Icon path={iconEdit} />}
                        size="xs"
                    >
                        Edit page
                    </Button>
                </Anchor>
                <Anchor
                    href={GITHUB_ISSUES}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="never"
                    c="red"
                >
                    <Button
                        leftSection={<Icon path={iconBug} />}
                        size="xs"
                    >
                        Report an issue
                    </Button>
                </Anchor>
            </Group>
            <FeedbackModal
                opened={opened}
                sentiment={sentiment}
                onClose={close}
                path={`/docs${urlPathname}`}
            />
        </>
    );
}
