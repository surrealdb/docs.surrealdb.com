import { Anchor, Box, Group, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core";
import {
    pictoBrain,
    pictoClaude,
    pictoCursor,
    pictoLangChain,
    pictoSurrealMCP,
    pictoVisualStudioCode,
    pictoWindsurf,
} from "@surrealdb/ui";
import { useMemo, useState } from "react";
import type { AgentWorkflow } from "./catalogue";
import { AGENTS, MCP_URL, SETUP_PROMPT, WORKFLOW_LABELS } from "./catalogue";
import {
    AgentCard,
    AgentSetup,
    Concept,
    CopyPromptButton,
    LinkCard,
    Section,
    Snippet,
} from "./parts";
import classes from "./style.module.scss";

/** The workflow filters, with "all" first as the default view. */
const FILTERS: { id: AgentWorkflow | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "terminal", label: WORKFLOW_LABELS.terminal },
    { id: "ide", label: WORKFLOW_LABELS.ide },
    { id: "extension", label: WORKFLOW_LABELS.extension },
];

/** The marks on the hero button, standing in for the wider set below it. */
const HERO_PICTOS = [
    { picto: pictoClaude, name: "Claude Code" },
    { picto: pictoCursor, name: "Cursor" },
    { picto: pictoVisualStudioCode, name: "Visual Studio Code" },
    { picto: pictoWindsurf, name: "Windsurf" },
];

export default function Page() {
    const [filter, setFilter] = useState<AgentWorkflow | "all">("all");
    const [selected, setSelected] = useState<string>(AGENTS[0].id);

    const visible = useMemo(
        () =>
            filter === "all" ? AGENTS : AGENTS.filter((agent) => agent.workflows.includes(filter)),
        [filter],
    );

    // Selecting a filter that excludes the open agent would leave its steps
    // below a grid that no longer offers it, so fall back to the first match.
    const selectedAgent = visible.find((agent) => agent.id === selected) ?? visible[0];

    return (
        <Box
            component="main"
            id="main-content"
            pb={80}
        >
            <Stack
                gap={64}
                pt={48}
            >
                <Box component="header">
                    <Title
                        order={1}
                        c="bright"
                        fw={500}
                    >
                        Agent setup
                    </Title>
                    <Text
                        fz="xl"
                        mt="md"
                        maw={832}
                    >
                        SurrealDB publishes Agent Skills and MCP servers, so the agent you already
                        code with can write correct SurrealQL, run it against your databases, and
                        manage the instances they live on.
                    </Text>
                    <Text
                        mt="sm"
                        maw={832}
                    >
                        Copy the setup prompt and paste it into your agent, or pick your agent below
                        and follow the steps by hand. For a deeper reference on every way SurrealDB
                        fits into AI tooling, see{" "}
                        <Anchor
                            href="/docs/build/ai-agents"
                            variant="vibrant"
                        >
                            AI agents
                        </Anchor>
                        .
                    </Text>

                    <Box mt="xl">
                        <CopyPromptButton
                            prompt={SETUP_PROMPT}
                            pictos={HERO_PICTOS}
                        />
                    </Box>
                </Box>

                <Section
                    id="one-prompt"
                    title="Set up in one prompt"
                    lead="Paste this into any agent that can fetch a URL. It reads the instructions, works out which agent it is running in, and configures the MCP server and the skills for you."
                >
                    <Stack gap="md">
                        <Snippet
                            code={SETUP_PROMPT}
                            language="text"
                        />
                        <Text fz="sm">
                            The instructions are served as plain markdown at{" "}
                            <Anchor
                                href="/docs/agents/instructions.md"
                                variant="vibrant"
                                fz="sm"
                            >
                                /docs/agents/instructions.md
                            </Anchor>
                            , so you can read exactly what your agent is about to do before you send
                            it.
                        </Text>
                    </Stack>
                </Section>

                <Section
                    id="pick-your-agent"
                    title="Pick your agent"
                    lead="Select an agent to see its setup steps. Every agent listed supports both Skills and MCP."
                >
                    <Stack gap="lg">
                        <Group gap="xs">
                            {FILTERS.map(({ id, label }) => (
                                <Box
                                    key={id}
                                    component="button"
                                    type="button"
                                    className={classes.filterChip}
                                    data-active={filter === id || undefined}
                                    aria-pressed={filter === id}
                                    onClick={() => setFilter(id)}
                                >
                                    {label}
                                </Box>
                            ))}
                        </Group>

                        <SimpleGrid
                            cols={{ base: 1, sm: 2, lg: 3 }}
                            spacing="md"
                        >
                            {visible.map((agent) => (
                                <AgentCard
                                    key={agent.id}
                                    agent={agent}
                                    selected={agent.id === selectedAgent?.id}
                                    onSelect={setSelected}
                                />
                            ))}
                        </SimpleGrid>

                        {selectedAgent && <AgentSetup agent={selectedAgent} />}
                    </Stack>
                </Section>

                <Section
                    id="compare-agents"
                    title="Compare agents"
                    lead="Where each agent runs, which models it can use, and what it remembers between sessions."
                >
                    <Table.ScrollContainer minWidth={720}>
                        <Table
                            withRowBorders
                            verticalSpacing="sm"
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Agent</Table.Th>
                                    <Table.Th>Workflow</Table.Th>
                                    <Table.Th>Model</Table.Th>
                                    <Table.Th>Context</Table.Th>
                                    <Table.Th>Open source</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {AGENTS.map((agent) => (
                                    <Table.Tr key={agent.id}>
                                        <Table.Td c="bright">{agent.name}</Table.Td>
                                        <Table.Td>
                                            {agent.workflows
                                                .map((workflow) => WORKFLOW_LABELS[workflow])
                                                .join(", ")}
                                        </Table.Td>
                                        <Table.Td>{agent.model}</Table.Td>
                                        <Table.Td>{agent.context}</Table.Td>
                                        <Table.Td>{agent.openSource ? "Yes" : "No"}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Section>

                <Section
                    id="what-your-agent-gets"
                    title="What your agent gets"
                    lead="Setup connects two things: packaged knowledge of how SurrealDB behaves, and tools it can call against your databases."
                >
                    <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing="md"
                    >
                        <LinkCard
                            title="Agent Skills"
                            description="Three official skills covering SurrealQL, vector search, and the Python SDK, so generated queries match how SurrealDB actually behaves. Built on the open Agent Skills standard, so they work in every agent listed above."
                            href="/docs/build/ai-agents/agent-skills"
                            picto={pictoBrain}
                        />
                        <LinkCard
                            title="SurrealDB MCP Server"
                            description="One hosted URL connects your agent to SurrealDB Cloud. It can deploy and resize instances, run SurrealQL against them, read metrics and logs, manage your team, and check what it all costs."
                            href="/docs/build/ai-agents/mcp"
                            picto={pictoSurrealMCP}
                        />
                        <LinkCard
                            title="Embedded MCP"
                            description="A database you run yourself publishes the same data tools, over HTTP at /mcp or over stdio with surreal mcp. Available from SurrealDB 3.1."
                            href="/docs/build/ai-agents/mcp/embedded"
                            picto={pictoSurrealMCP}
                        />
                        <LinkCard
                            title="AI frameworks"
                            description="Use SurrealDB from the agent library your application already has. LangChain, LlamaIndex, CrewAI, PydanticAI, Agno, and others connect through maintained integrations for vector stores, memory, and retrieval."
                            href="/docs/build/ai-agents/ai-frameworks"
                            picto={pictoLangChain}
                        />
                    </SimpleGrid>

                    <Stack
                        gap="md"
                        mt="xl"
                    >
                        <Text
                            fw={500}
                            c="bright"
                        >
                            The MCP server, if you would rather add it by hand
                        </Text>
                        <Snippet
                            code={MCP_URL}
                            language="text"
                        />
                        <Text fz="sm">
                            Sign in with your Surreal ID and the server acts as you: it sees only
                            the organisations you belong to, respects your role in each one, and
                            asks you to confirm anything that cannot be undone. For a client that
                            cannot open a browser, create a{" "}
                            <Anchor
                                href="/docs/build/ai-agents/mcp#signing-in"
                                variant="vibrant"
                                fz="sm"
                            >
                                personal access token
                            </Anchor>{" "}
                            and pass it as an Authorization header instead.
                        </Text>
                    </Stack>
                </Section>

                <Section
                    id="what-the-database-gives-an-agent"
                    title="What the database gives an agent"
                    lead="An agent needs somewhere to keep state, a way to query it that fits the question, and retrieval fast enough to answer in the loop. SurrealDB does all three in one engine."
                >
                    <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing="xl"
                    >
                        <Concept term="Memory">
                            Store conversation context, artefacts, and entity records as documents,
                            and model the relationships between users, tasks, tools, and outcomes as
                            a graph. Partition memory per tenant or per session while keeping one
                            query model.
                        </Concept>
                        <Concept term="Retrieval">
                            Combine structured filters with{" "}
                            <Anchor
                                href="/docs/learn/data-models/vector-search/vector-indexes"
                                variant="vibrant"
                                fz="sm"
                            >
                                vector indexes and similarity search
                            </Anchor>
                            , so a lookup can be semantic, exact, or both. That covers RAG and
                            hybrid retrieval without a second system.
                        </Concept>
                        <Concept term="Knowledge graphs">
                            Follow links between concepts, permissions, and resources inside the
                            database, so a question reaches supporting facts in a few hops instead
                            of several round trips through application code.
                        </Concept>
                        <Concept term="Tools the agent can call">
                            Express logic in SurrealQL, including{" "}
                            <Anchor
                                href="/docs/reference/query-language/functions/database-functions"
                                variant="vibrant"
                                fz="sm"
                            >
                                database functions
                            </Anchor>{" "}
                            for reusable server-side behaviour and HTTP functions for reaching
                            external APIs from the query layer.
                        </Concept>
                    </SimpleGrid>

                    <Text
                        mt="xl"
                        maw={832}
                        fz="sm"
                    >
                        For memory that has to survive across sessions, and to keep straight what
                        was said, what is true now, and what used to be true,{" "}
                        <Anchor
                            href="/docs/agent-memory"
                            variant="vibrant"
                            fz="sm"
                        >
                            SurrealDB Agent Memory
                        </Anchor>{" "}
                        models that in front of the database so you do not have to design it
                        yourself.
                    </Text>
                </Section>

                <Section
                    id="understanding-agents"
                    title="Understanding agents"
                    lead="The terms used above, and the trade-offs behind them."
                >
                    <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing="xl"
                    >
                        <Concept term="Skills">
                            Packages of instructions and reference material that teach an agent a
                            domain. The agent picks one up when the task calls for it, so it works
                            from documented behaviour rather than guesses.
                        </Concept>
                        <Concept term="MCP">
                            The Model Context Protocol, an open standard that lets agents call
                            external tools and APIs. A server publishes a set of tools, and the
                            agent calls them on your behalf.
                        </Concept>
                        <Concept term="Model flexibility">
                            Which models an agent can use. Locked means the vendor's own models
                            only. BYOK lets you bring your own API key. Multi-provider supports
                            several providers out of the box.
                        </Concept>
                        <Concept term="Context">
                            What the agent keeps. Project memory persists across sessions from files
                            in your repository. An indexed codebase is built up front and searched
                            on demand.
                        </Concept>
                        <Concept term="Terminal, IDE, and extension">
                            Terminal agents suit automation, scripting, and CI. An IDE puts the
                            agent beside visual diffs and multi-file edits. An extension is the
                            lightest install and keeps the editor you have.
                        </Concept>
                        <Concept term="Local and hosted">
                            A local agent runs on your machine and nothing leaves it. A hosted agent
                            reads your code over the network, which is what makes async,
                            long-running work possible.
                        </Concept>
                    </SimpleGrid>
                </Section>
            </Stack>
        </Box>
    );
}
