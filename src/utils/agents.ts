// The coding agents SurrealDB publishes setup for, and the prompt that sets one
// up on its own. Kept free of UI imports so the data can be read anywhere;
// components resolve their own brand marks from the ids below.

/** Where the agent runs, and the filter a reader picks it by. */
export type AgentWorkflow = "terminal" | "ide" | "extension";

export const WORKFLOW_LABELS: Record<AgentWorkflow, string> = {
    terminal: "Terminal",
    ide: "IDE",
    extension: "Extension",
};

/** How much freedom you have over the model behind the agent. */
export type ModelAccess = "Locked" | "BYOK" | "Multi-provider";

/** What the agent carries between turns and between sessions. */
export type ContextModel = "Project memory" | "Indexed codebase";

/** The configuration step for one agent, as the home page's setup panel shows it. */
export interface AgentSetup {
    /** The snippet's format, which decides how the panel lays it out. */
    language: "bash" | "json";
    /** The text the copy button puts on the clipboard. */
    code: string;
    /** Where the snippet goes and what to do next, with backticks around inline code. */
    where: string;
}

export interface AgentSummary {
    /** Matches the page slug under `/docs/agents`, and the brand mark lookup. */
    id: string;
    name: string;
    vendor: string;
    /** One sentence on what the agent is, in its own terms. */
    description: string;
    workflows: AgentWorkflow[];
    model: ModelAccess;
    context: ContextModel;
    openSource: boolean;
    setup: AgentSetup;
}

/** The hosted MCP server every agent connects to. */
export const MCP_URL = "https://mcp.surrealdb.com";

/**
 * Handed to an agent verbatim by the copy button, and by the same button on the
 * SurrealDB Studio organisation overview, so a change here needs the same change
 * there. It names the instructions document rather than spelling the setup out,
 * so the steps can change without the copied text going stale in anyone's
 * clipboard, and the document has the agent work out which client it is, so one
 * prompt serves every agent.
 */
export const SETUP_PROMPT =
    "Set me up for SurrealDB. Fetch https://surrealdb.com/docs/agents/instructions.md and follow it.";

/** Installs the official Agent Skills into the project it runs in. */
export const SKILLS_COMMAND = "npx skills add surrealdb/agent-skills";

/** The JSON body of an MCP configuration that holds only the SurrealDB server. */
function mcpConfig(key: string, server: Record<string, string>): string {
    return JSON.stringify({ [key]: { surrealdb: server } }, null, 2);
}

/** The document the prompt points at, served as raw markdown. */
export const INSTRUCTIONS_PATH = "/docs/agents/instructions.md";

/**
 * The agents in the picker, in the order their cards are laid out. Each one has
 * a setup page at `/docs/agents/<id>`; this is the shape the card and the
 * comparison table read from.
 */
export const AGENTS: AgentSummary[] = [
    {
        id: "claude-code",
        name: "Claude Code",
        vendor: "Anthropic",
        description:
            "Terminal coding agent that reads your codebase, runs commands, edits files, and manages git.",
        workflows: ["terminal", "ide", "extension"],
        model: "Locked",
        context: "Project memory",
        openSource: false,
        setup: {
            language: "bash",
            code: `claude mcp add --transport http surrealdb ${MCP_URL}\n${SKILLS_COMMAND}`,
            where: "Run both commands in your project root, then run `/mcp` in Claude Code to sign in.",
        },
    },
    {
        id: "codex",
        name: "Codex",
        vendor: "OpenAI",
        description:
            "OpenAI's coding agent, available as a terminal CLI and a desktop app, running commands in a sandbox.",
        workflows: ["terminal", "extension"],
        model: "Locked",
        context: "Project memory",
        openSource: true,
        setup: {
            language: "bash",
            code: `codex mcp add surrealdb --url ${MCP_URL}\n${SKILLS_COMMAND}`,
            where: "Run both commands in your project root, then approve the SurrealDB connection when Codex asks.",
        },
    },
    {
        id: "cursor",
        name: "Cursor",
        vendor: "Cursor",
        description:
            "AI-first editor built on VS Code, with multi-file edits and agents that run in the background.",
        workflows: ["ide"],
        model: "Multi-provider",
        context: "Indexed codebase",
        openSource: false,
        setup: {
            language: "json",
            code: mcpConfig("mcpServers", { url: MCP_URL }),
            where: `Add to \`~/.cursor/mcp.json\`, or \`.cursor/mcp.json\` for one project, and connect from Settings → MCP. Then run \`${SKILLS_COMMAND}\` in your project root.`,
        },
    },
    {
        id: "github-copilot",
        name: "GitHub Copilot",
        vendor: "GitHub",
        description:
            "Editor extension and CLI with agent mode, workspace context, and pull request integration.",
        workflows: ["extension", "terminal"],
        model: "Multi-provider",
        context: "Indexed codebase",
        openSource: false,
        setup: {
            language: "json",
            code: mcpConfig("servers", { type: "http", url: MCP_URL }),
            where: `Add to \`.vscode/mcp.json\` with agent mode enabled, and start the server from the MCP view. Then run \`${SKILLS_COMMAND}\` in your project root.`,
        },
    },
    {
        id: "vscode",
        name: "Visual Studio Code",
        vendor: "Microsoft",
        description:
            "Free, open-source editor with a native MCP client and support for third-party AI extensions.",
        workflows: ["ide", "extension"],
        model: "Multi-provider",
        context: "Project memory",
        openSource: true,
        setup: {
            language: "json",
            code: mcpConfig("servers", { type: "http", url: MCP_URL }),
            where: `Add to \`.vscode/mcp.json\`, or the user-level \`mcp.json\`, and start the server from the MCP view. Then run \`${SKILLS_COMMAND}\` in your project root.`,
        },
    },
    {
        id: "windsurf",
        name: "Windsurf",
        vendor: "Cognition",
        description:
            "Agentic IDE whose Cascade agent keeps context across multi-step tasks and long edits.",
        workflows: ["ide"],
        model: "Multi-provider",
        context: "Indexed codebase",
        openSource: false,
        setup: {
            language: "json",
            code: mcpConfig("mcpServers", { serverUrl: MCP_URL }),
            where: `Add to \`~/.codeium/windsurf/mcp_config.json\`, restart Windsurf, and connect from Settings → MCP. Then run \`${SKILLS_COMMAND}\` in your project root.`,
        },
    },
    {
        id: "zed",
        name: "Zed",
        vendor: "Zed Industries",
        description:
            "Fast, open-source editor whose assistant reaches MCP servers as what it calls context servers.",
        workflows: ["ide"],
        model: "BYOK",
        context: "Project memory",
        openSource: true,
        setup: {
            language: "json",
            code: mcpConfig("context_servers", { url: MCP_URL }),
            where: `Add to \`~/.config/zed/settings.json\` and restart Zed. Then run \`${SKILLS_COMMAND}\` in your project root.`,
        },
    },
];
