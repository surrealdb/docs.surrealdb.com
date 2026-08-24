import { Button, Chip, Group, Modal, Stack, Text, Textarea } from "@mantine/core";
import { useCallback, useState } from "react";
import { submitFeedback } from "~/utils/feedback";

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
    /** Docs pathname the feedback is about, e.g. `/docs/surrealql`. */
    path: string;
}

export type Sentiment = "helpful" | "not-helpful";

type SubmitState = "idle" | "sending" | "sent" | "failed";

export function FeedbackModal({ sentiment, opened, onClose, path }: FeedbackModalProps) {
    const [reasons, setReasons] = useState<string[]>([]);
    const [comment, setComment] = useState("");
    const [state, setState] = useState<SubmitState>("idle");

    const reset = useCallback(() => {
        setReasons([]);
        setComment("");
        setState("idle");
    }, []);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

    const handleSubmit = useCallback(async () => {
        setState("sending");

        try {
            await submitFeedback({ path, sentiment, reasons, comment });
            setState("sent");
        } catch {
            // The reader's text stays in the form, so they can retry
            // or copy it out rather than losing it.
            setState("failed");
        }
    }, [sentiment, reasons, comment, path]);

    const options = sentiment === "helpful" ? HELPFUL_OPTIONS : NOT_HELPFUL_OPTIONS;
    const title = sentiment === "helpful" ? "What did you like?" : "What could be improved?";

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={sentiment ? title : <Text fw={600}>Was this page helpful?</Text>}
            size="md"
            centered
            aria-label="Page feedback"
        >
            {state === "sent" ? (
                <Stack gap="md">
                    <Text>Thanks - your feedback has been recorded.</Text>
                    <Group justify="flex-end">
                        <Button onClick={handleClose}>Close</Button>
                    </Group>
                </Stack>
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
                                    size="sm"
                                    styles={{
                                        label: {
                                            backgroundColor: "var(--mantine-color-obsidian-light)",
                                        },
                                    }}
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

                    {state === "failed" && (
                        <Text c="red">
                            Feedback was not submitted. Try again, or use the Report an issue link
                            instead.
                        </Text>
                    )}

                    <Group
                        justify="flex-end"
                        gap="sm"
                    >
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="gradient"
                            loading={state === "sending"}
                        >
                            {state === "failed" ? "Try again" : "Submit"}
                        </Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
}
