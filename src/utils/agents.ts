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
}

/** The hosted MCP server every agent connects to. */
export const MCP_URL = "https://mcp.surrealdb.com";

/**
 * Handed to an agent verbatim by the copy button, and by the same button on the
 * SurrealDB Studio organisation overview. It names the instructions document
 * rather than spelling the setup out, so the steps can change without the copied
 * text going stale in anyone's clipboard.
 */
export const SETUP_PROMPT =
    "Fetch and execute the appropriate instructions to set me up for SurrealDB from https://surrealdb.com/docs/agents/instructions.md";

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
    },
];
