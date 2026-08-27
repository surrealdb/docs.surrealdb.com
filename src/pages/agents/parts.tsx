import {
    ActionIcon,
    Anchor,
    Badge,
    Box,
    Code,
    Group,
    Image,
    Paper,
    Stack,
    Text,
    Title,
    Tooltip,
    UnstyledButton,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Icon, iconArrowUpRight, iconCheck, iconCopy, useStable } from "@surrealdb/ui";
import type { ReactNode } from "react";
import type { AgentDefinition, AgentSetupStep } from "./catalogue";
import { WORKFLOW_LABELS } from "./catalogue";
import classes from "./style.module.scss";

/** Long enough to read the confirmation, short enough to be gone on the next glance. */
const COPIED_TIMEOUT = 2000;

export interface CopyPromptButtonProps {
    /** The text written to the clipboard. */
    prompt: string;
    /** Brand marks shown after the label, standing in for "whichever agent you use". */
    pictos: { picto: string; name: string }[];
}

/**
 * The page's primary action: one click puts the setup prompt on the clipboard,
 * ready to paste into an agent.
 *
 * The tooltip is controlled rather than hover-triggered, because it confirms the
 * copy rather than explaining a button whose purpose is written on its face.
 */
export function CopyPromptButton({ prompt, pictos }: CopyPromptButtonProps) {
    const clipboard = useClipboard({ timeout: COPIED_TIMEOUT });

    const handleCopy = useStable(() => {
        clipboard.copy(prompt);
    });

    return (
        <Tooltip
            label="Setup prompt copied"
            opened={clipboard.copied}
            position="bottom"
            withArrow
        >
            <UnstyledButton
                className={classes.promptButton}
                onClick={handleCopy}
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
                        {pictos.map(({ picto, name }) => (
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
    );
}

export interface SnippetProps {
    /** The command or configuration shown, copied verbatim. */
    code: string;
    /** Fence language, used only to label the block. */
    language?: string;
}

/** A copyable command or configuration block, for a page with no markdown pipeline. */
export function Snippet({ code, language = "bash" }: SnippetProps) {
    const clipboard = useClipboard({ timeout: COPIED_TIMEOUT });

    const handleCopy = useStable(() => {
        clipboard.copy(code);
    });

    return (
        <Box className={classes.snippet}>
            <Code
                block
                className={classes.snippetCode}
            >
                {code}
            </Code>
            <Group
                className={classes.snippetActions}
                gap="xs"
            >
                <Text
                    fz="xs"
                    c="slate"
                >
                    {language}
                </Text>
                <Tooltip label={clipboard.copied ? "Copied" : "Copy"}>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label="Copy to clipboard"
                        onClick={handleCopy}
                    >
                        <Icon
                            path={clipboard.copied ? iconCheck : iconCopy}
                            size="sm"
                        />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Box>
    );
}

export interface AgentCardProps {
    agent: AgentDefinition;
    selected: boolean;
    onSelect: (id: string) => void;
}

/** One agent in the picker. Selecting it reveals its steps beneath the grid. */
export function AgentCard({ agent, selected, onSelect }: AgentCardProps) {
    return (
        <UnstyledButton
            className={classes.agentCard}
            data-selected={selected || undefined}
            aria-pressed={selected}
            onClick={() => onSelect(agent.id)}
        >
            <Group
                gap="sm"
                wrap="nowrap"
                align="flex-start"
            >
                <Image
                    src={agent.picto}
                    alt=""
                    w={28}
                    h={28}
                />
                <Box miw={0}>
                    <Text
                        fz="xs"
                        c="slate"
                        lineClamp={1}
                    >
                        {agent.vendor}
                    </Text>
                    <Text
                        fw={500}
                        c="bright"
                        lineClamp={1}
                        className={classes.agentName}
                    >
                        {agent.name}
                    </Text>
                </Box>
            </Group>
            <Text
                fz="sm"
                mt="sm"
                opacity={0.8}
            >
                {agent.description}
            </Text>
            <Group
                gap={6}
                mt="md"
            >
                {agent.workflows.map((workflow) => (
                    <Badge
                        key={workflow}
                        variant="default"
                        size="sm"
                        fw={400}
                    >
                        {WORKFLOW_LABELS[workflow]}
                    </Badge>
                ))}
            </Group>
        </UnstyledButton>
    );
}

interface SetupStepProps {
    index: number;
    step: AgentSetupStep;
}

function SetupStep({ index, step }: SetupStepProps) {
    return (
        <Box
            component="li"
            className={classes.step}
        >
            <Text
                fw={500}
                c="bright"
            >
                {index}. {step.title}
            </Text>
            <Text
                fz="sm"
                mt={4}
                opacity={0.8}
            >
                {step.body}
            </Text>
            {step.code && (
                <Box mt="sm">
                    <Snippet
                        code={step.code}
                        language={step.language}
                    />
                </Box>
            )}
        </Box>
    );
}

export interface AgentSetupProps {
    agent: AgentDefinition;
}

/** The steps for the selected agent, from installing the server to proving it works. */
export function AgentSetup({ agent }: AgentSetupProps) {
    return (
        <Paper
            className={classes.setupPanel}
            radius="var(--surreal-radius-card)"
            p="xl"
        >
            <Group
                gap="sm"
                wrap="nowrap"
            >
                <Image
                    src={agent.picto}
                    alt=""
                    w={24}
                    h={24}
                />
                <Title
                    order={3}
                    fz="lg"
                    fw={500}
                    c="bright"
                >
                    Set up {agent.name}
                </Title>
            </Group>

            <Box
                component="ol"
                className={classes.steps}
            >
                {agent.steps.map((step, index) => (
                    <SetupStep
                        key={step.title}
                        index={index + 1}
                        step={step}
                    />
                ))}
            </Box>

            {agent.guide && (
                <Anchor
                    href={agent.guide.href}
                    variant="vibrant"
                    fz="sm"
                >
                    <Group
                        gap={4}
                        wrap="nowrap"
                        component="span"
                    >
                        {agent.guide.label}
                        <Icon
                            path={iconArrowUpRight}
                            size="sm"
                        />
                    </Group>
                </Anchor>
            )}
        </Paper>
    );
}

export interface SectionProps {
    id: string;
    title: string;
    /** One sentence on what the section is for, shown under the heading. */
    lead?: string;
    children: ReactNode;
}

/** A titled block of the page, with the anchor the page aside would otherwise add. */
export function Section({ id, title, lead, children }: SectionProps) {
    return (
        <Box
            component="section"
            id={id}
        >
            <Title
                order={2}
                fz="h3"
                fw={500}
                c="bright"
            >
                {title}
            </Title>
            {lead && (
                <Text
                    mt="xs"
                    maw={832}
                >
                    {lead}
                </Text>
            )}
            <Box mt="lg">{children}</Box>
        </Box>
    );
}

export interface LinkCardProps {
    title: string;
    description: string;
    href: string;
    /** Brand or concept mark shown at the leading edge. */
    picto: string;
}

/** A card linking out to the reference page that covers a topic in full. */
export function LinkCard({ title, description, href, picto }: LinkCardProps) {
    return (
        <Anchor
            href={href}
            underline="never"
            c="unset"
            className={classes.linkCardAnchor}
        >
            <Paper
                className={classes.linkCard}
                radius="var(--surreal-radius-card)"
                p="lg"
            >
                <Group
                    gap="sm"
                    wrap="nowrap"
                >
                    <Image
                        src={picto}
                        alt=""
                        w={22}
                        h={22}
                    />
                    <Text
                        fw={500}
                        c="bright"
                        className={classes.linkCardTitle}
                    >
                        {title}
                    </Text>
                </Group>
                <Text
                    fz="sm"
                    mt="sm"
                    opacity={0.8}
                >
                    {description}
                </Text>
            </Paper>
        </Anchor>
    );
}

export interface ConceptProps {
    term: string;
    children: ReactNode;
}

/** A defined term in the closing explainer. */
export function Concept({ term, children }: ConceptProps) {
    return (
        <Stack gap={4}>
            <Text
                fw={500}
                c="bright"
            >
                {term}
            </Text>
            <Text
                fz="sm"
                opacity={0.8}
            >
                {children}
            </Text>
        </Stack>
    );
}
