import { Box, Group, Image, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Icon, iconCheck, iconCopy, pictoAISolid } from "@surrealdb/ui";
import { SETUP_PROMPT } from "~/utils/agents";
import classes from "./style.module.scss";

/** Long enough to read the confirmation, short enough to be gone on the next glance. */
const COPIED_TIMEOUT = 2000;

/**
 * Puts the setup prompt on the clipboard, ready to paste into an agent. The same
 * control, with the same prompt, sits on the SurrealDB Studio organisation
 * overview.
 *
 * The tooltip is controlled rather than hover-triggered, because it confirms the
 * copy rather than explaining a button whose purpose is written on its face.
 */
export function AgentPrompt() {
    const clipboard = useClipboard({ timeout: COPIED_TIMEOUT });

    return (
        <Box className={classes.root}>
            <Tooltip
                label="Setup prompt copied"
                opened={clipboard.copied}
                position="bottom"
                withArrow
            >
                <UnstyledButton
                    className={classes.button}
                    onClick={() => clipboard.copy(SETUP_PROMPT)}
                >
                    <Group
                        gap="sm"
                        wrap="nowrap"
                    >
                        <Image
                            src={pictoAISolid}
                            mr="xs"
                            w={16}
                        />
                        <Text
                            fw={500}
                            c="bright"
                        >
                            Onboard your agent to SurrealDB
                        </Text>
                        <Icon
                            path={clipboard.copied ? iconCheck : iconCopy}
                            size="sm"
                        />
                    </Group>
                </UnstyledButton>
            </Tooltip>
        </Box>
    );
}
