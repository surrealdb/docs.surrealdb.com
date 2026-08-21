import type { PageContext } from "vike/types";

/** First path segment after `/agent-memory/` owned by another Agent Memory page tree. */
const AGENT_MEMORY_SIBLING_SECTIONS = new Set(["cookbooks", "integrations", "reference"]);

export default function route({ urlPathname }: PageContext) {
    const path = urlPathname.replace(/\/$/, "") || "/";
    if (path === "/agent-memory") return true;
    if (!path.startsWith("/agent-memory/")) return false;
    const rest = path.slice("/agent-memory/".length);
    const top = rest.split("/")[0] ?? "";
    return !AGENT_MEMORY_SIBLING_SECTIONS.has(top);
}
