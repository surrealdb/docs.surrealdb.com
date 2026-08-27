# Set up this environment for SurrealDB

You are an AI coding agent, and the person you are working with has asked you to set them up for SurrealDB. Work through this document in order and report what you did at the end.

Setup connects two things:

1. **Agent Skills** — packaged knowledge of SurrealQL, vector search, and the SurrealDB Python SDK, so the code you write matches how SurrealDB behaves.
2. **The SurrealDB MCP Server** — tools you can call against the user's SurrealDB Cloud account: deploy and manage instances, run SurrealQL against them, read metrics and logs, and check usage.

Install both unless the user asks for one of them.

## Before you start

- **Ask before you write to a file outside the project.** Editing a global MCP configuration changes the user's whole machine, not this repository. Say which file you are about to change and wait for a yes.
- **Never handle credentials.** Sign-in happens in the user's browser, and a personal access token is pasted by the user. Do not ask for a password, a card number, or a token value, and never write a token into a file that will be committed.
- **Do not deploy anything.** Creating a SurrealDB Cloud instance costs money. Setup ends with a connected client, not a running database.

## Step 1: Work out which agent you are

The MCP configuration differs per client. Identify yourself from the list below and use that row. If you are not listed, use the generic configuration at the end of Step 3.

| You are | Configuration style |
| --- | --- |
| Claude Code | `claude mcp add` |
| Claude Desktop, or the Claude app | Settings → Connectors |
| Codex | `codex mcp add`, or `~/.codex/config.toml` |
| Cursor | `mcpServers` with `url` |
| GitHub Copilot, or VS Code | `servers` with `"type": "http"` |
| Windsurf, or Antigravity | `mcpServers` with `serverUrl` |
| Zed | `context_servers` with `url` |
| JetBrains IDEs, OpenCode, or anything else | Generic `mcpServers` with `url` |

## Step 2: Install the Agent Skills

Run this in the root of the user's project:

```bash
npx skills add surrealdb/agent-skills
```

That installs all three official skills. To install only what the project needs, pass one or more:

```bash
npx skills add surrealdb/agent-skills --skill surrealql
npx skills add surrealdb/agent-skills --skill surrealdb-vector
npx skills add surrealdb/agent-skills --skill surrealdb-python
```

| Skill | Covers |
| --- | --- |
| `surrealql` | Query syntax, schema definitions, graph traversals, record IDs, live queries, and moving across from SQL |
| `surrealdb-vector` | HNSW indexes, KNN queries, similarity scoring, and tuning EFC, M, and M0 |
| `surrealdb-python` | The `surrealdb` package in client/server mode over WebSocket, and embedded in-memory or file-backed |

The skills follow the [Agent Skills](https://agentskills.io/) open standard, so they work in Claude Code, Cursor, GitHub Copilot, Cline, and other agents that read the format. If `npx skills` is unavailable, clone [surrealdb/agent-skills](https://github.com/surrealdb/agent-skills) and copy its `skills/` directory to wherever you read context files from.

## Step 3: Add the MCP server

The hosted server is one URL, with nothing to install and nothing to keep running:

```text
https://mcp.surrealdb.com
```

Use the configuration for the agent you identified in Step 1.

### Claude Code

```bash
claude mcp add --transport http surrealdb https://mcp.surrealdb.com
```

Add `--scope project` to write the entry to `.mcp.json` in the repository instead of the user's global configuration. The file holds no credentials, so it is safe to commit; everyone who opens the project signs in as themselves.

### Claude Desktop and the Claude app

These have no configuration file to edit. Tell the user to open **Settings → Connectors → Add custom connector** and enter the name `SurrealDB` and the URL `https://mcp.surrealdb.com`.

### Codex

```bash
codex mcp add surrealdb --url https://mcp.surrealdb.com
```

Or add it to `~/.codex/config.toml`, or `.codex/config.toml` in a trusted project:

```toml
[mcp_servers.surrealdb]
url = "https://mcp.surrealdb.com"
```

### Cursor

Add the entry to `~/.cursor/mcp.json` for every project, or `.cursor/mcp.json` for this one. Merge it with any servers already listed rather than replacing the file.

```json
{
  "mcpServers": {
    "surrealdb": {
      "url": "https://mcp.surrealdb.com"
    }
  }
}
```

### GitHub Copilot and VS Code

Both read the same file: `.vscode/mcp.json` for the workspace, or the user-level `mcp.json`. VS Code uses a `servers` object with an explicit type.

```json
{
  "servers": {
    "surrealdb": {
      "type": "http",
      "url": "https://mcp.surrealdb.com"
    }
  }
}
```

Copilot also needs agent mode: set `github.copilot.chat.agent.enabled` to `true` in VS Code settings, on Copilot 1.99 or later.

### Windsurf and Antigravity

These use `serverUrl` in place of `url`. Windsurf's file is `~/.codeium/windsurf/mcp_config.json`.

```json
{
  "mcpServers": {
    "surrealdb": {
      "serverUrl": "https://mcp.surrealdb.com"
    }
  }
}
```

### Zed

Zed calls MCP servers context servers. The file is `~/.config/zed/settings.json`.

```json
{
  "context_servers": {
    "surrealdb": {
      "url": "https://mcp.surrealdb.com"
    }
  }
}
```

### Any other client

Add `https://mcp.surrealdb.com` as a remote MCP server in whatever form the client accepts. The usual shape is:

```json
{
  "mcpServers": {
    "surrealdb": {
      "url": "https://mcp.surrealdb.com"
    }
  }
}
```

## Step 4: Have the user sign in

The server acts as the user: it sees only the organisations they belong to, respects the role they hold in each one, and asks them to confirm anything that cannot be undone. Nothing is stored in the configuration file.

Most clients open a browser window for sign-in. Tell the user what to do in theirs:

- **Claude Code** — run `/mcp`, choose **surrealdb**, and approve the connection.
- **Cursor** — open **Settings → MCP**, find **surrealdb**, and click **Connect**. The indicator turns green.
- **VS Code** — reload the window, start the server from the MCP view, and approve the connection.
- **Windsurf** — restart, then connect from **Settings → MCP**.
- **Anything else** — the client prompts on first use, or offers a connect action in its MCP settings.

If the client cannot open a browser, or the setup has to run unattended, the user creates a personal access token at [account.surrealdb.com/tokens](https://account.surrealdb.com/tokens) and passes it as a header:

```json
{
  "mcpServers": {
    "surrealdb": {
      "url": "https://mcp.surrealdb.com",
      "headers": {
        "Authorization": "Bearer <your-token>"
      }
    }
  }
}
```

A token carries only the permissions ticked when it was created, and those cannot be changed afterwards. Include `read:cloud` alongside anything else, because without it there is no way to look up which organisation or instance to act on.

| Permission | Allows |
| --- | --- |
| `read:cloud` | Read organisations, instances, contexts, usage, and logs |
| `write:cloud-instances` | Deploy, resize, pause, upgrade, and delete instances |
| `query:cloud-instances` | Read and write the data inside instances |
| `write:cloud-organization` | Create organisations, and manage members, roles, and invitations |
| `write:cloud-billing` | Update billing details and manage plans |

A personal access token stands in for the whole account and does not expire on its own. Keep it out of any file that will be committed: put it in the user-level configuration, never a project one.

## Step 5: Check it worked

Confirm the client sees the server:

```bash
claude mcp list    # Claude Code
codex mcp list     # Codex
```

Other clients show connection status in their MCP settings panel.

Then confirm the tools answer. Ask for something read-only:

> Which SurrealDB Cloud organisations can you see?

A list of the user's organisations means setup is complete. An authentication error means Step 4 is unfinished.

## Step 6: Report back

Tell the user, briefly:

- Which skills you installed, and where.
- Which file you added the MCP server to.
- Whether the connection is signed in and answering.
- Anything left for them to do, such as approving the connection in a browser.

## Reference: what the MCP server can do

You never call these by hand — the client offers them, and most clients show the call before it runs. Read-only tools are marked safe, so a client can approve them without asking every time.

| Group | Tools cover |
| --- | --- |
| Profile and organisations | Who the user is signed in as, which organisations they can work in, and creating or renaming one |
| Members and invitations | Who has access, inviting someone, changing a role, withdrawing an invitation |
| Instances | List, deploy, pause, resume, resize, upgrade, adjust backups, delete |
| Instance data | `use`, `query`, `select`, `create`, `insert`, `upsert`, `update`, `delete`, `relate`, `run`, `list`, `info` |
| Monitoring and usage | Instance status, metrics, logs, and usage |
| Billing | Billing details, deployment readiness, usage and invoices |
| Catalogue | Available regions, instance types, and SurrealDB versions |

Data tools need the instance to be running and on **SurrealDB 3.1 or later**. An older instance answers management calls but not queries; ask the user before upgrading one.

Four things the server will not do, whatever it is asked:

- **Delete an instance on a guess.** Deletion is permanent and takes the instance's backups with it, so the name has to match exactly.
- **Handle a card.** Payment details are entered by the user on a secure checkout page. No tool accepts a card number.
- **Accept terms.** You can fetch the documents and link to them. The agreement is the user's to give.
- **Show a secret twice.** New keys and access tokens appear once, when they are created.

## Reference: databases the user runs themselves

The hosted server covers SurrealDB Cloud. For a database the user runs, SurrealDB 3.1 and later ship an MCP server inside the binary, publishing the same data tools.

Over HTTP, `surreal start` exposes `POST /mcp` on the same address as the REST API, authenticated the same way:

```bash
surreal start --user root --pass secret --bind 127.0.0.1:8000 memory
# MCP endpoint: http://127.0.0.1:8000/mcp
```

Over stdio, the client spawns SurrealDB as a child process with an embedded datastore:

```bash
surreal mcp --user root --pass secret --ns main --db main memory
```

Every stdio call runs with owner-level access, because there is no network handshake to attach credentials to. Use it for local development on a trusted machine, and use HTTP for anything shared. Run `/mcp` behind TLS in production: the session header acts like a bearer token until the session expires.

## Where to read more

- [Agent setup](https://surrealdb.com/docs/agents) — this document as a page, with per-agent steps
- [SurrealDB MCP Server](https://surrealdb.com/docs/build/ai-agents/mcp) — the hosted server in full
- [Embedded MCP](https://surrealdb.com/docs/build/ai-agents/mcp/embedded) — the server inside SurrealDB
- [Agent Skills](https://surrealdb.com/docs/build/ai-agents/agent-skills) — what each skill covers
- [AI agents](https://surrealdb.com/docs/build/ai-agents) — frameworks, memory, and what the database gives an agent
- [SurrealDB Agent Memory](https://surrealdb.com/docs/agent-memory) — memory that persists across sessions
- [SurrealDB documentation](https://surrealdb.com/docs/llms.txt) — the full documentation index, as markdown
