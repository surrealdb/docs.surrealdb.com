import { Button, Chip, Group, Modal, Stack, Text, Textarea } from "@mantine/core";
import { useCallback, useState } from "react";

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
    sentiment: Sentiment;
    opened: boolean;
    onClose: () => void;
}

export type Sentiment = "helpful" | "not-helpful";

export function FeedbackModal({ sentiment, opened, onClose }: FeedbackModalProps) {
    const [reasons, setReasons] = useState<string[]>([]);
    const [comment, setComment] = useState("");

    const reset = useCallback(() => {
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
        </Modal>
    );
}
