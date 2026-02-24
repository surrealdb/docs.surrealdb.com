import { Button, Chip, Group, Modal, Stack, Text, Textarea, UnstyledButton } from "@mantine/core";
import { Icon } from "@surrealdb/ui";
import { useCallback, useState } from "react";
import classes from "./style.module.scss";

const ICON_THUMB_UP =
    "M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z";
const ICON_THUMB_DOWN =
    "M22 4h-2c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h2V4zM2.17 11.12c-.11.25-.17.52-.17.8V13c0 1.1.9 2 2 2h5.5l-.92 4.65c-.05.22-.02.46.08.66.23.45.52.86.88 1.22L10 22l6.41-6.41c.38-.38.59-.89.59-1.42V6.34C17 5.05 15.95 4 14.66 4h-8.1c-.71 0-1.36.37-1.72.97l-2.67 6.15z";

const HELPFUL_OPTIONS = [
    "Accurate",
    "Easy to understand",
    "Solved my problem",
    "Helped me decide to use the product",
    "Other",
];

const NOT_HELPFUL_OPTIONS = [
    "Hard to understand",
    "Incorrect information",
    "Missing the information",
    "Other",
];

export interface FeedbackModalProps {
    opened: boolean;
    onClose: () => void;
}

type Sentiment = "helpful" | "not-helpful";

export function FeedbackModal({ opened, onClose }: FeedbackModalProps) {
    const [sentiment, setSentiment] = useState<Sentiment | null>(null);
    const [reasons, setReasons] = useState<string[]>([]);
    const [comment, setComment] = useState("");

    const reset = useCallback(() => {
        setSentiment(null);
        setReasons([]);
        setComment("");
    }, []);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

    const handleSubmit = useCallback(() => {
        console.info("Feedback submitted:", { sentiment, reasons, comment });
        handleClose();
    }, [sentiment, reasons, comment, handleClose]);

    const options = sentiment === "helpful" ? HELPFUL_OPTIONS : NOT_HELPFUL_OPTIONS;
    const title = sentiment === "helpful" ? "What did you like?" : "What went wrong?";

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={sentiment ? title : <Text fw={600}>Was this page helpful?</Text>}
            size="md"
            centered
            aria-label="Page feedback"
        >
            {!sentiment ? (
                <Group grow>
                    <UnstyledButton
                        className={classes.sentimentButton}
                        onClick={() => setSentiment("helpful")}
                        aria-label="Yes, this page was helpful"
                    >
                        <Icon
                            path={ICON_THUMB_UP}
                            size="lg"
                        />
                        <Text
                            fw={500}
                            mt="xs"
                        >
                            Helpful
                        </Text>
                    </UnstyledButton>
                    <UnstyledButton
                        className={classes.sentimentButton}
                        onClick={() => setSentiment("not-helpful")}
                        aria-label="No, this page was not helpful"
                    >
                        <Icon
                            path={ICON_THUMB_DOWN}
                            size="lg"
                        />
                        <Text
                            fw={500}
                            mt="xs"
                        >
                            Not helpful
                        </Text>
                    </UnstyledButton>
                </Group>
            ) : (
                <Stack gap="md">
                    <Chip.Group
                        multiple
                        value={reasons}
                        onChange={setReasons}
                    >
                        <Group gap="xs">
                            {options.map((option) => (
                                <Chip
                                    key={option}
                                    value={option}
                                    variant="outline"
                                    size="sm"
                                >
                                    {option}
                                </Chip>
                            ))}
                        </Group>
                    </Chip.Group>

                    <Textarea
                        placeholder="Any additional feedback..."
                        value={comment}
                        onChange={(e) => setComment(e.currentTarget.value)}
                        minRows={3}
                        autosize
                    />

                    <Group
                        justify="flex-end"
                        gap="sm"
                    >
                        <Button
                            variant="default"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
}
