/**
 * The documentation split into bundles an agent can read in one fetch, served
 * at `/docs/llms-full/<slug>.txt` and listed in `llms.txt` with their sizes.
 *
 * `llms-full.txt` holds every page in one response, about 2.4 million tokens,
 * which is more than any agent's context. A bundle holds one section or one
 * SDK, so an agent that needs the Python SDK reads the Python SDK.
 *
 * Plain data, imported by the server and by `scripts/generate-llms-txt.mjs`,
 * so the bundles the index lists are the bundles the server answers. A slug is
 * part of a URL agents are given, so it stays as it is when a section moves:
 * change the prefixes instead.
 */

export interface LlmsBundle {
    /** The bundle's file name without `.txt`. */
    slug: string;
    title: string;
    /** What the bundle holds, in a few words, for its `llms.txt` entry. */
    description: string;
    /**
     * The page paths it holds, without `/docs`. A page belongs to the first
     * bundle in `LLMS_BUNDLES` with a prefix that matches its path, so a
     * narrower prefix is listed before a wider one.
     */
    prefixes: string[];
}

const SDKS: [slug: string, name: string][] = [
    ["javascript", "JavaScript"],
    ["python", "Python"],
    ["rust", "Rust"],
    ["golang", "Go"],
    ["java", "Java"],
    ["dotnet", ".NET"],
    ["php", "PHP"],
    ["kotlin", "Kotlin"],
    ["swift", "Swift"],
    ["mojo", "Mojo"],
];

export const LLMS_BUNDLES: LlmsBundle[] = [
    {
        slug: "surrealql-statements",
        title: "SurrealQL statements",
        description: "Every statement, with syntax and examples.",
        prefixes: ["/reference/query-language/statements"],
    },
    {
        slug: "surrealql-functions",
        title: "SurrealQL functions",
        description: "Every function, with signatures and examples.",
        prefixes: ["/reference/query-language/functions"],
    },
    {
        slug: "surrealql",
        title: "SurrealQL language",
        description: "Data types, operators, idioms, clauses.",
        prefixes: ["/reference/query-language"],
    },
    {
        slug: "rest-api",
        title: "Protocols and APIs",
        description: "HTTP, RPC, CBOR, PostgreSQL and MySQL protocols.",
        prefixes: ["/reference/protocols"],
    },
    {
        slug: "cli",
        title: "CLI and Studio",
        description: "surreal db, surreal cloud, environment variables, Studio.",
        prefixes: ["/reference/cli", "/reference/studio"],
    },
    ...SDKS.map(([slug, name]) => ({
        slug: `sdk-${slug}`,
        title: `${name} SDK`,
        description: "Quickstart, concepts and API reference.",
        prefixes: [`/reference/${slug}`, `/languages/${slug}`],
    })),
    {
        slug: "learn",
        title: "Learn",
        description: "Data models, querying, schemas, security, tutorials, Labs.",
        prefixes: ["/learn", "/labs"],
    },
    {
        slug: "integrate",
        title: "Integrate",
        description: "AI agents, embedding, integrations, migrating.",
        prefixes: ["/integrate"],
    },
    {
        slug: "operate",
        title: "Operate",
        description: "Cloud, Earth, self-hosting, enterprise, observability, upgrading.",
        prefixes: ["/operate"],
    },
    {
        slug: "libraries",
        title: "Libraries",
        description: "SQL drivers and the Surqlize query builders.",
        prefixes: ["/libraries"],
    },
    {
        slug: "agent-memory",
        title: "Agent Memory",
        description: "Concepts, integrations, cookbooks, reference.",
        prefixes: ["/agent-memory"],
    },
    {
        slug: "get-started",
        title: "Get started",
        description: "Installing and running SurrealDB, agent setup.",
        prefixes: ["/"],
    },
];

/** Whether `path` is `prefix` or a page below it. */
function within(path: string, prefix: string): boolean {
    return prefix === "/" || path === prefix || path.startsWith(`${prefix}/`);
}

/** The bundle that holds the page at `path`, a docs path without `/docs`. */
export function bundleFor(path: string): LlmsBundle {
    const normalised = `/${path.replace(/^\/+|\/+$/g, "")}`;
    const bundle = LLMS_BUNDLES.find((candidate) =>
        candidate.prefixes.some((prefix) => within(normalised, prefix)),
    );

    // The last bundle's `/` prefix matches every path.
    return bundle ?? (LLMS_BUNDLES.at(-1) as LlmsBundle);
}

/** The bundle with this slug, or undefined. */
export function bundleBySlug(slug: string): LlmsBundle | undefined {
    return LLMS_BUNDLES.find((bundle) => bundle.slug === slug);
}
