import { GITHUB_BASE, GITHUB_ISSUES } from "@components/PageAside";
import { Anchor, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon, iconBug, iconEdit } from "@surrealdb/ui";
import { FeedbackModal } from "modals/FeedbackModal";

const ICON_THUMB_UP =
    "M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z";

export function PageContentActions({ contentPath }: { contentPath: string }) {
    const editUrl = `${GITHUB_BASE}${contentPath}`;
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Group
                gap="md"
                mt="xl"
                pt="md"
                justify="space-between"
            >
                <Group gap="md">
                    <Anchor
                        href={editUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="never"
                        c="bright"
                    >
                        <Icon
                            path={iconEdit}
                            mr="sm"
                        />
                        Edit page
                    </Anchor>
                    <Anchor
                        href={GITHUB_ISSUES}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="never"
                        c="red"
                    >
                        <Icon
                            path={iconBug}
                            mr="sm"
                        />
                        Report an issue
                    </Anchor>
                </Group>
                <Button
                    variant="subtle"
                    size="compact-sm"
                    leftSection={
                        <Icon
                            path={ICON_THUMB_UP}
                            size="xs"
                        />
                    }
                    onClick={open}
                >
                    Was this page helpful?
                </Button>
            </Group>
            <FeedbackModal
                opened={opened}
                onClose={close}
            />
        </>
    );
}
