import { Box, Group, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Icon, iconCheck, iconCopy } from "@surrealdb/ui";
import { AgentBrand } from "~/components/AgentBrand";
import { SETUP_PROMPT } from "~/utils/agents";
import classes from "./style.module.scss";

/** Long enough to read the confirmation, short enough to be gone on the next glance. */
const COPIED_TIMEOUT = 2000;

/** Stands in for "whichever agent you use", not for the four that are shown. */
const HERO_AGENTS = [
    { id: "claude-code", name: "Claude Code" },
    { id: "cursor", name: "Cursor" },
    { id: "vscode", name: "Visual Studio Code" },
    { id: "windsurf", name: "Windsurf" },
];

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
                        <Icon
                            path={clipboard.copied ? iconCheck : iconCopy}
                            size="sm"
                        />
                        <Text
                            fw={500}
                            c="bright"
                        >
                            Onboard your agent to SurrealDB
                        </Text>
                        <Group
                            gap={6}
                            wrap="nowrap"
                        >
                            {HERO_AGENTS.map(({ id, name }) => (
                                <AgentBrand
                                    key={id}
                                    agent={id}
                                    size={18}
                                    alt={name}
                                />
                            ))}
                        </Group>
                    </Group>
                </UnstyledButton>
            </Tooltip>
        </Box>
    );
}
