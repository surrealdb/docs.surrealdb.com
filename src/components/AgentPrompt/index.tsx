import { Box, Tooltip, UnstyledButton } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { SETUP_PROMPT } from "~/utils/agents";
import classes from "./style.module.scss";

/** Long enough to read the confirmation, short enough to be gone on the next glance. */
const COPIED_TIMEOUT = 2000;

export interface AgentPromptProps {
    /** Overrides the button text where the surrounding copy already explains it. */
    label?: string;
}

/**
 * Puts the setup prompt on the clipboard, ready to paste into an agent. The same
 * control, with the same prompt, sits on the SurrealDB Studio organisation
 * overview.
 *
 * Drawn as www.surrealdb.com's solid call to action, in the product accent: a
 * lilac pill with white text and no icons, where a white arrow slides in beside
 * the label on hover.
 *
 * The tooltip is controlled rather than hover-triggered, because it confirms the
 * copy rather than explaining a button whose purpose is written on its face.
 */
export function AgentPrompt({ label = "Onboard your agent to SurrealDB" }: AgentPromptProps) {
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
                    <span className={classes.label}>{label}</span>
                </UnstyledButton>
            </Tooltip>
        </Box>
    );
}
