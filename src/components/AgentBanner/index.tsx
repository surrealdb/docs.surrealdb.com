import { Anchor, Box, Group, Text, Title } from "@mantine/core";
import { Icon, iconArrowRight } from "@surrealdb/ui";
import { AgentBrand } from "~/components/AgentBrand";
import { AgentPrompt } from "~/components/AgentPrompt";
import { AGENTS } from "~/utils/agents";
import classes from "./style.module.scss";

/**
 * The agent setup banner at the top of the documentation home page.
 *
 * It sits above the section cards because it is the shortest route into
 * SurrealDB there is: a reader who already has an agent open pastes one prompt
 * and has the skills and the tooling without reading anything first. The link
 * beside it is for the reader who would rather see the steps.
 *
 * One panel rather than a split: the marks say which agents this covers, so the
 * banner needs only a line of copy and the two things a reader can do with it.
 */
export function AgentBanner() {
    return (
        <Box className={classes.banner}>
            <Group
                gap="sm"
                wrap="nowrap"
                className={classes.marks}
            >
                {AGENTS.map((agent) => (
                    <AgentBrand
                        key={agent.id}
                        agent={agent.id}
                        size={20}
                        alt={agent.name}
                    />
                ))}
            </Group>

            <Title
                order={2}
                fz={24}
                fw={500}
                c="bright"
                mt="md"
                mb={0}
            >
                Already using an AI agent?
            </Title>

            <Text
                mt={6}
                maw={560}
                opacity={0.8}
            >
                Paste one prompt and your agent installs SurrealDB's skills and connects to the MCP
                server, ready to write SurrealQL against a real database.
            </Text>

            <Group
                mt="lg"
                gap="lg"
                wrap="wrap"
            >
                <AgentPrompt label="Copy setup prompt" />
                <Anchor
                    href="/docs/agents"
                    variant="vibrant"
                    fz="sm"
                    fw={500}
                >
                    <Group
                        gap={6}
                        wrap="nowrap"
                        component="span"
                    >
                        Learn more about SurrealDB for agents
                        <Icon
                            path={iconArrowRight}
                            size="sm"
                        />
                    </Group>
                </Anchor>
            </Group>
        </Box>
    );
}
