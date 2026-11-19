# Set up this environment for SurrealDB Agent Memory

You are an AI coding agent, and the person you are working with has asked you to set them up for SurrealDB Agent Memory. Work through this document in order and report what you did at the end.

SurrealDB Agent Memory turns messages and documents into facts that an agent can recall later. It runs on SurrealDB Cloud, and each memory store is a **context** with its own host and API keys.

Setup connects three things:

1. **Agent Skills** - packaged knowledge of SurrealDB and Agent Memory, so the code you write matches how they behave.
2. **The Agent Memory MCP server** - tools you can call against the user's context: `remember`, `recall`, `context`, `reflect`, `forget`, `upload` and `inspect`.
3. **The Agent guide** - the rules for writing code that calls Agent Memory: authentication, scopes, endpoints and common mistakes.

Install all three unless the user asks for only some of them.

## Before you start

- **Ask before you write to a file outside the project.** Editing a global MCP configuration changes the user's whole machine, not this repository. Say which file you are about to change and wait for a yes.
- **Never handle credentials.** An API key is shown once in SurrealDB Studio and belongs to the user. Do not ask for its value, do not print it, and never write it into a file that will be committed. Where a key is needed, have the user put it in an environment variable or run the command themselves.
- **Do not create contexts or change plans.** Contexts are created in SurrealDB Studio, and a plan costs money. Setup ends with a connected client, not a new context.

## Step 1: Find out what the user already has

Ask whether the user has an Agent Memory context. They need its **host** and an **API key**, both from the context's **API keys** view in [SurrealDB Studio](https://studio.surrealdb.com). The host is not a secret, so you can ask for it.

If they have no context yet, tell them to sign in to SurrealDB Studio, open their organisation, go to **Contexts**, create a context, and then create a key in its **API keys** view. [Agent Memory on SurrealDB Cloud](/docs/agent-memory/operate/cloud) describes these steps. Wait until they have done this before Step 4.

## Step 2: Work out which agent you are

The MCP configuration differs per client. Identify yourself from the list below and use that row in Step 4. If you are not listed, use the manual configuration at the end of Step 4.

| You are | Configuration style |
| --- | --- |
| [Claude Code, Cowork or Claude Desktop](/docs/agent-memory/integrations/mcp-server/coding-assistants/claude-desktop-and-code) | The `agent-memory` plugin |
| [Codex](/docs/agent-memory/integrations/mcp-server/coding-assistants/codex) | `~/.codex/config.toml` |
| [Cursor](/docs/agent-memory/integrations/mcp-server/coding-assistants/cursor), [VS Code](/docs/agent-memory/integrations/mcp-server/coding-assistants/vscode), [Windsurf](/docs/agent-memory/integrations/mcp-server/coding-assistants/windsurf), [Zed](/docs/agent-memory/integrations/mcp-server/coding-assistants/zed) or [OpenCode](/docs/agent-memory/integrations/mcp-server/coding-assistants/opencode) | `npx install-mcp` |
| JetBrains IDEs, Antigravity, or anything else | Manual configuration |

## Step 3: Install the Agent Skills

Run this in the root of the user's project:

```bash
npx skills add surrealdb/agent-skills
```

The skills include `surrealdb-agent-memory-docs`, which covers Agent Memory, alongside skills for SurrealQL and the SurrealDB SDKs.

## Step 4: Connect the MCP server

**Claude Code and Cowork.** Ask the user to run these two commands in Claude Code, since they are slash commands rather than shell commands:

```text
/plugin marketplace add surrealdb/ai-claude-plugin
/plugin install agent-memory@surrealdb
```

The plugin connects to SurrealDB's managed MCP server, and the first tool call opens a browser so the user can sign in with their Surreal ID. The plugin's optional memory hooks need two environment variables, which the [Claude guide](/docs/agent-memory/integrations/mcp-server/coding-assistants/claude-desktop-and-code) describes.

**Codex.** Add this entry to `~/.codex/config.toml`, with the user's host in place of the placeholder:

```toml
[mcp_servers.agent-memory]
url = "https://<your-context-host>/mcp"
bearer_token_env_var = "AGENT_MEMORY_API_KEY"
```

Then ask the user to set `AGENT_MEMORY_API_KEY` to their key in their own shell.

**Cursor, VS Code, Windsurf, Zed and OpenCode.** Give the user this command to run themselves, with their host and key in place of the placeholders and `--client` set to their editor (`cursor`, `vscode`, `windsurf`, `zed` or `opencode`):

```bash
npx install-mcp https://<your-context-host>/mcp \
  --client cursor \
  --header "Authorization: Bearer <your-api-key>" \
  --oauth no
```

**Manual configuration.** Any MCP client can be configured by hand. Most take this shape. Windsurf and Antigravity use `serverUrl` instead of `url`, and VS Code uses a `servers` object with `"type": "http"`:

```json
{
  "mcpServers": {
    "agent-memory": {
      "url": "https://<your-context-host>/mcp",
      "headers": {
        "Authorization": "Bearer <your-api-key>"
      }
    }
  }
}
```

The key goes in the user's own copy of the file, written by them. If the file is inside the project, make sure it is ignored by version control before the key goes in.

## Step 5: Read the Agent guide

Before you write any code that calls Agent Memory, read the [Agent guide](/docs/agent-memory/reference/agents). It covers authentication, scopes, the endpoints to use and the mistakes to avoid. Offer to add it to the project's `AGENTS.md`, so that later sessions follow it too.

## Step 6: Check and report

If the MCP server is connected, call `recall` with a short question such as "What do you know about this project?". An empty result is fine for a new context: it shows the connection works.

Then tell the user:

- which skills you installed,
- which MCP configuration you added or asked them to add, and where,
- anything they still need to do themselves, such as setting an environment variable or restarting their editor.

The [quickstart](/docs/agent-memory) shows the same steps for people, with SDK and REST examples.
