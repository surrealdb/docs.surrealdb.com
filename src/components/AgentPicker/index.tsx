import { Anchor, Badge, Box, Group, SimpleGrid, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { AgentBrand } from "~/components/AgentBrand";
import { AGENTS, type AgentSummary, type AgentWorkflow, WORKFLOW_LABELS } from "~/utils/agents";
import classes from "./style.module.scss";

/** The workflow filters, with "all" first as the default view. */
const FILTERS: { id: AgentWorkflow | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "terminal", label: WORKFLOW_LABELS.terminal },
    { id: "ide", label: WORKFLOW_LABELS.ide },
    { id: "extension", label: WORKFLOW_LABELS.extension },
];

interface AgentCardProps {
    agent: AgentSummary;
}

function AgentCard({ agent }: AgentCardProps) {
    return (
        <Anchor
            href={`/docs/agents/${agent.id}`}
            underline="never"
            c="unset"
            className={classes.anchor}
        >
            <Box className={classes.card}>
                <Group
                    gap="sm"
                    wrap="nowrap"
                >
                    <AgentBrand
                        agent={agent.id}
                        size={28}
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
                            mt={-2}
                            fw={500}
                            c="bright"
                            lineClamp={1}
                            className={classes.name}
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
            </Box>
        </Anchor>
    );
}

/**
 * The agent picker on the setup page: a grid of cards, filterable by where the
 * agent runs, each linking to that agent's setup page.
 *
 * Filtering is client state rather than a URL parameter, unlike the labs index.
 * A reader narrows the grid to find their own agent and leaves for its page
 * immediately, so there is no filtered view worth sharing or restoring.
 */
export function AgentPicker() {
    const [filter, setFilter] = useState<AgentWorkflow | "all">("all");

    const visible = useMemo(
        () =>
            filter === "all" ? AGENTS : AGENTS.filter((agent) => agent.workflows.includes(filter)),
        [filter],
    );

    return (
        <Box className={classes.root}>
            <Group gap="xs">
                {FILTERS.map(({ id, label }) => (
                    <Box
                        key={id}
                        component="button"
                        type="button"
                        className={classes.chip}
                        data-active={filter === id || undefined}
                        aria-pressed={filter === id}
                        onClick={() => setFilter(id)}
                    >
                        {label}
                    </Box>
                ))}
            </Group>

            <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing="md"
                mt="lg"
            >
                {visible.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        agent={agent}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
}
