import {
    pictoClaude,
    pictoCursor,
    pictoGitHub,
    pictoOpenAI,
    pictoVisualStudioCode,
    pictoWindsurf,
    pictoZed,
} from "@surrealdb/ui";

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

export interface AgentSetupStep {
    /** Imperative title, e.g. "Add the MCP server". */
    title: string;
    /** One sentence on what the step does or where the file lives. */
    body: string;
    /** The command or configuration to run, when the step has one. */
    code?: string;
    /** Fence language for `code`, defaulting to `bash`. */
    language?: string;
}

export interface AgentDefinition {
    id: string;
    name: string;
    vendor: string;
    /** Brand mark shown on the card. */
    picto: string;
    /** One sentence on what the agent is, in its own terms. */
    description: string;
    workflows: AgentWorkflow[];
    model: ModelAccess;
    context: ContextModel;
    openSource: boolean;
    /** Ordered setup, from installing the MCP server to a prompt that proves it. */
    steps: AgentSetupStep[];
    /** Documentation covering this client in more depth, when there is any. */
    guide?: { label: string; href: string };
}

/** The hosted MCP server every agent below connects to. */
export const MCP_URL = "https://mcp.surrealdb.com";

/**
 * Handed to an agent verbatim by the copy button, and by the same button on the
 * SurrealDB Studio overview. It names the instructions document rather than
 * spelling the setup out, so these steps can change without the copied text
 * going stale in anyone's clipboard.
 */
export const SETUP_PROMPT =
    "Fetch and execute the appropriate instructions to set me up for SurrealDB from https://surrealdb.com/docs/agents/instructions.md";

/** Installs every official skill, and closes each agent's setup. */
const INSTALL_SKILLS: AgentSetupStep = {
    title: "Install the Agent Skills",
    body: "Teaches the agent SurrealQL, vector search, and the Python SDK. Run it in your project root.",
    code: "npx skills add surrealdb/agent-skills",
};

/**
 * The agents SurrealDB publishes setup for, in the order the cards are laid out.
 *
 * Each entry carries the whole card, its row in the comparison table, and the
 * steps revealed when it is selected, because a reader compares agents and then
 * sets one up without leaving the page.
 */
export const AGENTS: AgentDefinition[] = [
    {
        id: "claude-code",
        name: "Claude Code",
        vendor: "Anthropic",
        picto: pictoClaude,
        description:
            "Terminal coding agent that reads your codebase, runs commands, edits files, and manages git.",
        workflows: ["terminal", "ide", "extension"],
        model: "Locked",
        context: "Project memory",
        openSource: false,
        guide: { label: "MCP in Claude", href: "/docs/build/ai-agents/mcp/claude" },
        steps: [
            {
                title: "Add the MCP server",
                body: "Registers the hosted server with Claude Code. Add --scope project to commit it to the repository instead.",
                code: `claude mcp add --transport http surrealdb ${MCP_URL}`,
            },
            {
                title: "Sign in",
                body: "Run /mcp inside Claude Code, choose surrealdb, and approve the connection in the browser window that opens.",
                code: "/mcp",
                language: "text",
            },
            INSTALL_SKILLS,
            {
                title: "Check it worked",
                body: "surrealdb should be listed as connected. Ask Claude which SurrealDB organisations it can see.",
                code: "claude mcp list",
            },
        ],
    },
    {
        id: "codex",
        name: "Codex",
        vendor: "OpenAI",
        picto: pictoOpenAI,
        description:
            "OpenAI's coding agent, available as a terminal CLI and a desktop app, running commands in a sandbox.",
        workflows: ["terminal", "extension"],
        model: "Locked",
        context: "Project memory",
        openSource: true,
        steps: [
            {
                title: "Add the MCP server",
                body: "Codex reads MCP servers from ~/.codex/config.toml, or .codex/config.toml in a trusted project.",
                code: `codex mcp add surrealdb --url ${MCP_URL}`,
            },
            {
                title: "Sign in",
                body: "Start a Codex session and approve the SurrealDB connection when it prompts you.",
            },
            INSTALL_SKILLS,
            {
                title: "Check it worked",
                body: "surrealdb should appear in the list. Ask Codex what SurrealDB tools it has available.",
                code: "codex mcp list",
            },
        ],
    },
    {
        id: "cursor",
        name: "Cursor",
        vendor: "Cursor",
        picto: pictoCursor,
        description:
            "AI-first editor built on VS Code, with multi-file edits and agents that run in the background.",
        workflows: ["ide"],
        model: "Multi-provider",
        context: "Indexed codebase",
        openSource: false,
        guide: { label: "MCP in Cursor", href: "/docs/build/ai-agents/mcp/cursor" },
        steps: [
            {
                title: "Add the MCP server",
                body: "Add the entry to ~/.cursor/mcp.json for every project, or .cursor/mcp.json for one. Nothing about your account is stored there, so a project file is safe to commit.",
                language: "json",
                code: `{
  "mcpServers": {
    "surrealdb": {
      "url": "${MCP_URL}"
    }
  }
}`,
            },
            {
                title: "Sign in",
                body: "Open Settings → MCP, find surrealdb, and click Connect. The indicator turns green when it is ready.",
            },
            INSTALL_SKILLS,
            {
                title: "Check it worked",
                body: "Ask the chat panel which SurrealDB Cloud organisations it can see.",
            },
        ],
    },
    {
        id: "github-copilot",
        name: "GitHub Copilot",
        vendor: "GitHub",
        picto: pictoGitHub,
        description:
            "Editor extension and CLI with agent mode, workspace context, and pull request integration.",
        workflows: ["extension", "terminal"],
        model: "Multi-provider",
        context: "Indexed codebase",
        openSource: false,
        steps: [
            {
                title: "Turn on agent mode",
                body: "In VS Code settings, search for github.copilot.chat.agent.enabled and set it to true. Copilot needs version 1.99 or later.",
            },
            {
                title: "Add the MCP server",
                body: "Copilot reads the same file VS Code does: .vscode/mcp.json for the workspace, or the user-level mcp.json for every project.",
                language: "json",
                code: `{
  "servers": {
    "surrealdb": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`,
            },
            INSTALL_SKILLS,
            {
                title: "Check it worked",
                body: "Open Copilot Chat in agent mode and ask which SurrealDB tools it can use.",
            },
        ],
    },
    {
        id: "vscode",
        name: "Visual Studio Code",
        vendor: "Microsoft",
        picto: pictoVisualStudioCode,
        description:
            "Free, open-source editor with a native MCP client and support for third-party AI extensions.",
        workflows: ["ide", "extension"],
        model: "Multi-provider",
        context: "Project memory",
        openSource: true,
        steps: [
            {
                title: "Add the MCP server",
                body: "VS Code uses a servers object with an explicit type. Put it in .vscode/mcp.json for the workspace, or the user-level mcp.json for every project.",
                language: "json",
                code: `{
  "servers": {
    "surrealdb": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`,
            },
            {
                title: "Sign in",
                body: "Reload the window, then start the server from the MCP view and approve the connection in the browser.",
            },
            INSTALL_SKILLS,
            {
                title: "Check it worked",
                body: "Ask chat which SurrealDB tools it has available.",
            },
        ],
    },
    {
        id: "windsurf",
        name: "Windsurf",
        vendor: "Cognition",
        picto: pictoWindsurf,
        description:
            "Agentic IDE whose Cascade agent keeps context across multi-step tasks and long edits.",
        workflows: ["ide"],
        model: "Multi-provider",
        context: "Indexed codebase",
        openSource: false,
        steps: [
            {
                title: "Add the MCP server",
                body: "Windsurf uses serverUrl rather than url. The file is ~/.codeium/windsurf/mcp_config.json.",
                language: "json",
                code: `{
  "mcpServers": {
    "surrealdb": {
      "serverUrl": "${MCP_URL}"
    }
  }
}`,
            },
            {
                title: "Sign in",
                body: "Restart Windsurf, then open Settings → MCP and connect. The panel reports each server's status.",
            },
            INSTALL_SKILLS,
            {
                title: "Check it worked",
                body: "Open the Cascade panel and ask which SurrealDB tools it has access to.",
            },
        ],
    },
    {
        id: "zed",
        name: "Zed",
        vendor: "Zed Industries",
        picto: pictoZed,
        description:
            "Fast, open-source editor whose assistant reaches MCP servers as what it calls context servers.",
        workflows: ["ide"],
        model: "BYOK",
        context: "Project memory",
        openSource: true,
        steps: [
            {
                title: "Add the MCP server",
                body: "Open settings with cmd/ctrl , to edit ~/.config/zed/settings.json, and add SurrealDB under context_servers.",
                language: "json",
                code: `{
  "context_servers": {
    "surrealdb": {
      "url": "${MCP_URL}"
    }
  }
}`,
            },
            {
                title: "Sign in",
                body: "Restart Zed and approve the connection in the browser window it opens.",
            },
            INSTALL_SKILLS,
            {
                title: "Check it worked",
                body: "Ask the assistant panel which SurrealDB tools it can call.",
            },
        ],
    },
];
