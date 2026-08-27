import { Box, Group, Image, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import {
    Icon,
    iconCheck,
    iconCopy,
    pictoClaudeSolid,
    pictoCursorSolid,
    pictoVisualStudioCodeSolid,
    pictoWindsurfSolid,
} from "@surrealdb/ui";
import { SETUP_PROMPT } from "~/utils/agents";
import classes from "./style.module.scss";

/** Long enough to read the confirmation, short enough to be gone on the next glance. */
const COPIED_TIMEOUT = 2000;

/** Stands in for "whichever agent you use", not for the four that are shown. */
const HERO_PICTOS = [
    { picto: pictoClaudeSolid, name: "Claude Code" },
    { picto: pictoCursorSolid, name: "Cursor" },
    { picto: pictoVisualStudioCodeSolid, name: "Visual Studio Code" },
    { picto: pictoWindsurfSolid, name: "Windsurf" },
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
                            {HERO_PICTOS.map(({ picto, name }) => (
                                <Image
                                    key={name}
                                    src={picto}
                                    alt={name}
                                    w={18}
                                    h={18}
                                />
                            ))}
                        </Group>
                    </Group>
                </UnstyledButton>
            </Tooltip>
        </Box>
    );
}
