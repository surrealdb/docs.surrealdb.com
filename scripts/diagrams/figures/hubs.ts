// Orienting figures for section landing pages: running SurrealDB, AI agents,
// agent setup and migrating. Each one maps the choices its page lists.

import { arrow, type Figure, MONO, markers, rect, svg, type Theme, text } from "../lib";

const card = (
    s: string[],
    t: Theme,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    lines: string[],
    kind: "plain" | "accent" | "panel" = "plain",
) => {
    const fill = kind === "accent" ? t.accentBg : kind === "panel" ? t.panel : t.card;
    s.push(rect(x, y, w, h, { fill, stroke: kind === "accent" ? t.accent : undefined }));
    s.push(text(x + 30, y + 52, title, { size: 30, fill: t.text, weight: 700, anchor: "start" }));
    lines.forEach((l, i) => {
        s.push(text(x + 30, y + 96 + i * 38, l, { size: 24, fill: t.muted, anchor: "start" }));
    });
};

// The ways to run SurrealDB on running/overview, from least to most set-up
const runningPaths: Figure = {
    name: "hub-running-paths",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        s.push(text(80, 70, "Least set-up", { size: 26, fill: t.muted, anchor: "start" }));
        s.push(text(2320, 70, "Most control", { size: 26, fill: t.muted, anchor: "end" }));
        s.push(arrow(320, 62, 2080, 62, t.line, 3));
        card(s, t, 80, 120, 620, 220, "Studio Sandbox", [
            "In the browser, under a minute",
            "Nothing to install",
            "Data is not kept",
        ]);
        card(s, t, 860, 120, 620, 220, "SurrealDB Cloud", [
            "About 5 minutes, with an email",
            "Data is kept",
            "The instance is managed for you",
        ]);
        card(
            s,
            t,
            1640,
            120,
            680,
            220,
            "Install the surreal CLI",
            ["About 10 minutes", "Run it locally or on your servers", "Full control, offline work"],
            "accent",
        );
        s.push(
            `<path d="M1980,350 V400 M80,440 V412 H2280 V440" fill="none" stroke="${t.line}" stroke-width="3"/>`,
        );
        s.push(
            text(80, 396, "On your own infrastructure, choose storage and topology:", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );
        const own: [string, string[]][] = [
            ["In memory", ["one node, SurrealMX,", "optional persistence"]],
            ["On disk", ["one node, SurrealKV"]],
            ["Multi-node", ["a cluster of nodes"]],
            ["Docker", ["the same options", "in a container"]],
        ];
        own.forEach(([title, lines], i) => {
            card(s, t, 80 + i * 570, 480, 530, 200, title, lines, "panel");
        });
        s.push(
            text(80, 790, "Every option runs the same database and the same SurrealQL.", {
                size: 26,
                fill: t.text,
                anchor: "start",
            }),
        );
        return svg(runningPaths, t, s.join(""));
    },
};

// The three places SurrealDB meets AI tooling, from build/ai-agents
const aiAgents: Figure = {
    name: "hub-ai-agents",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        s.push(rect(960, 360, 480, 180, { fill: t.accentBg, stroke: t.accent }));
        s.push(text(1200, 440, "SurrealDB", { size: 40, fill: t.text, weight: 700 }));
        s.push(text(1200, 488, "documents, graph, vectors", { size: 24, fill: t.muted }));
        card(s, t, 80, 80, 700, 230, "The assistant you code with", [
            "MCP: tools that query and manage",
            "your databases and Cloud instances",
            "Agent Skills: SurrealQL knowledge",
        ]);
        card(s, t, 80, 590, 700, 230, "Your application's framework", [
            "LangChain, LlamaIndex, CrewAI,",
            "PydanticAI, Agno and others,",
            "through maintained integrations",
        ]);
        card(s, t, 1620, 330, 700, 240, "Agent Memory", [
            "A memory and knowledge layer,",
            "running on SurrealDB, for agents",
            "that remember across sessions",
        ]);
        s.push(arrow(790, 230, 950, 380, t.accent, 4));
        s.push(arrow(790, 700, 950, 520, t.accent, 4));
        s.push(arrow(1610, 450, 1450, 450, t.accent, 4));
        s.push(
            text(
                80,
                870,
                "The assistant and the framework work with your own databases. Agent Memory keeps an agent's memory in a SurrealDB of its own.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(aiAgents, t, s.join(""));
    },
};

// What agent setup connects, from agents/index
const agentSetup: Figure = {
    name: "hub-agent-setup",
    width: 2200,
    height: 700,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent])];
        s.push(rect(80, 120, 820, 440, { fill: t.panel }));
        s.push(
            text(120, 180, "Your coding agent", {
                size: 32,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        card(
            s,
            t,
            120,
            220,
            740,
            150,
            "Agent Skills",
            ["knowledge inside the agent: how SurrealQL behaves"],
            "accent",
        );
        card(s, t, 120, 390, 740, 140, "MCP client", ["calls tools on a server"]);
        s.push(arrow(870, 460, 1180, 460, t.accent, 5));
        s.push(text(1025, 436, "https", { size: 22, fill: t.muted, font: MONO }));
        card(
            s,
            t,
            1190,
            360,
            900,
            200,
            "SurrealDB MCP Server",
            [
                "mcp.surrealdb.com, hosted",
                "deploy and resize instances, run queries,",
                "read metrics, logs and costs",
            ],
            "accent",
        );
        s.push(
            text(
                80,
                640,
                "Skills shape the queries an agent writes. MCP lets it run them and manage the instances they run on.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(agentSetup, t, s.join(""));
    },
};

// Where data comes from on build/migrating, and the tool that moves it
const migrating: Figure = {
    name: "hub-migrating-sources",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        const sources: [string, string][] = [
            ["Other databases", "PostgreSQL, MySQL, MongoDB, Neo4j, Snowflake"],
            ["Files and streams", "CSV, JSON Lines, Kafka"],
        ];
        sources.forEach(([title, sub], i) => {
            card(s, t, 80, 100 + i * 260, 760, 200, title, [sub]);
        });
        s.push(rect(1060, 210, 460, 200, { fill: t.accentBg, stroke: t.accent }));
        s.push(text(1290, 300, "Surreal Sync", { size: 34, fill: t.text, weight: 700 }));
        s.push(text(1290, 344, "surreal-sync", { size: 24, fill: t.muted, font: MONO }));
        s.push(arrow(850, 200, 1050, 280, t.accent, 4));
        s.push(arrow(850, 460, 1050, 350, t.accent, 4));
        s.push(rect(1760, 210, 560, 200, { fill: t.accentBg, stroke: t.accent }));
        s.push(text(2040, 324, "SurrealDB", { size: 38, fill: t.text, weight: 700 }));
        s.push(arrow(1530, 310, 1750, 310, t.accent, 5));
        card(s, t, 80, 620, 760, 200, "An older SurrealDB", [
            "upgrade guides list what changes",
            "between versions",
        ]);
        s.push(arrow(850, 720, 1750, 400, t.line, 3, "10 8"));
        s.push(
            text(1400, 700, "follow the upgrade guide for each version", {
                size: 24,
                fill: t.muted,
                halo: t.bg,
            }),
        );
        s.push(
            text(
                80,
                880,
                "A database Surreal Sync does not cover can be exported as JSON and loaded with surreal import.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(migrating, t, s.join(""));
    },
};

export default [runningPaths, aiAgents, agentSetup, migrating];
