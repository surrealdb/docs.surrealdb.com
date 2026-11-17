/**
 * Guides addressed to coding agents, keyed by the slug each one is served under.
 *
 * `/docs/llms/guides/<slug>` answers with the markdown of the page the slug
 * names, which is what that page's `.md` URL returns. www.surrealdb.com
 * rewrites `/llms/guides/*` to that route, so
 * `https://surrealdb.com/llms/guides/<slug>` is the address to give an agent.
 *
 * A slug is quoted in release notes and in prompts, so it is a stable address.
 * When a guide's page moves, change its path here and keep the slug.
 */
const AGENT_GUIDES: ReadonlyMap<string, string> = new Map([
    ["python-migration-2x-to-3x", "/reference/python/migrating-to-3x"],
    ["go-migration-1x-to-2x", "/reference/golang/migrating-to-2x"],
]);

/** The documentation path, without `/docs`, of the guide served at *slug*. */
export function agentGuidePath(slug: string): string | undefined {
    return AGENT_GUIDES.get(slug);
}
