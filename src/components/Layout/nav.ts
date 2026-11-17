import type { MantineColor } from "@mantine/core";
import {
    brandDotNet,
    brandGo,
    brandJava,
    brandJavaScript,
    brandKotlin,
    brandPHP,
    brandPython,
    brandRust,
    brandSwift,
    iconLangMojo,
} from "@surrealdb/ui";
import rustDark from "~/assets/img/icon/brand/rust-dark.svg";
import { getProductFromPath } from "~/utils/product";

export interface NavItem {
    label: string;
    href: string;
}

/**
 * Badges flag a small, time-limited signal beside an item label.
 *
 * The union is deliberately closed: every value needs a matching label in
 * `header.tsx`, so widening it is an explicit decision rather than a typo.
 */
export type NavMenuBadge = "new";

export interface NavMenuItem {
    label: string;
    href: string;
    description?: string;
    external?: boolean;
    /**
     * Brand logo drawn in full colour in a square tile to the left of the
     * label. Takes precedence over `icon`.
     */
    image?: string | { light: string; dark: string };
    /** Icon path for the tile, for a brand the UI kit publishes no logo for. */
    icon?: string;
    /** Colour for `icon`: a Mantine colour key or a CSS colour. */
    iconColor?: MantineColor;
    /** Renders a small pill beside the label. */
    badge?: NavMenuBadge;
}

export interface NavMenuSection {
    heading?: string;
    items: NavMenuItem[];
}

export interface NavMenuGroup {
    label: string;
    /**
     * The section's own hub page.
     *
     * Without it the label is a menu and nothing else, so the section has no
     * address: `/docs/reference` answered 404 while "Reference" sat in the
     * header, which left the section unlinkable, unrankable, and unguessable by
     * an agent constructing a path. The menu still opens on hover; this is what
     * a click resolves to.
     */
    href?: string;
    sections: NavMenuSection[];
}

export type NavEntry = NavItem | NavMenuGroup;

export function isMenuGroup(entry: NavEntry): entry is NavMenuGroup {
    return "sections" in entry;
}

export function flattenMenuItems(group: NavMenuGroup): NavMenuItem[] {
    return group.sections.flatMap((section) => section.items);
}

export const SURREALDB_NAV_LINKS: NavEntry[] = [
    { label: "Get started", href: "/docs" },
    {
        label: "Learn",
        href: "/docs/learn",
        sections: [
            {
                heading: "Database",
                items: [
                    {
                        label: "Database basics",
                        href: "/docs/learn/database-basics",
                        description: "What databases do, for readers new to them.",
                    },
                    {
                        label: "Querying",
                        href: "/docs/learn/querying",
                        description: "Mutate and query your data.",
                    },
                    {
                        label: "Schema management",
                        href: "/docs/learn/schema-management",
                        description: "Define namespaces, tables, and indexes.",
                    },
                    {
                        label: "Data models",
                        href: "/docs/learn/data-models",
                        description: "Model documents, graphs, vectors, and more.",
                    },
                    {
                        label: "Security",
                        href: "/docs/learn/security",
                        description: "Configure authentication, scopes, and access.",
                    },
                ],
            },
            {
                heading: "Examples",
                items: [
                    {
                        label: "Tutorials & demos",
                        href: "/docs/learn/tutorials",
                        description: "Follow hands-on walkthroughs and demos.",
                    },
                    {
                        label: "SurrealDB Labs",
                        href: "/docs/labs",
                        description: "Talks, videos and projects from the community.",
                    },
                ],
            },
            {
                heading: "Extending",
                items: [
                    {
                        label: "Agent Memory",
                        href: "/docs/agent-memory",
                        description: "The AI memory and knowledge layer.",
                        external: true,
                        badge: "new",
                    },
                    {
                        label: "Extensions",
                        href: "/docs/learn/extensions",
                        description: "Extend SurrealDB with functions and plugins.",
                    },
                ],
            },
        ],
    },
    {
        label: "Integrate",
        href: "/docs/integrate",
        sections: [
            {
                heading: "Connect",
                items: [
                    {
                        label: "Integrations",
                        href: "/docs/integrate/integrations",
                        description: "Connect SDKs, frameworks, and tools.",
                    },
                    {
                        label: "AI Agents",
                        href: "/docs/integrate/ai-agents",
                        description: "Integrate SurrealDB with your agents.",
                    },
                    {
                        label: "Embedding SurrealDB",
                        href: "/docs/integrate/embedding",
                        description: "Embed the engine natively or with WebAssembly.",
                    },
                ],
            },
            {
                heading: "Migrate",
                items: [
                    {
                        label: "Migrating",
                        href: "/docs/integrate/migrating",
                        description: "Import data and schemas from other databases.",
                    },
                ],
            },
        ],
    },
    {
        label: "Operate",
        href: "/docs/operate",
        sections: [
            {
                heading: "SurrealDB Cloud",
                items: [
                    {
                        label: "Instances",
                        href: "/docs/operate/instances",
                        description: "Create, scale, and monitor your database instances.",
                    },
                    {
                        label: "SurrealDB Earth",
                        href: "/docs/operate/instances/earth",
                        description: "Run serverless SurrealDB on the Cloudflare network.",
                        badge: "new",
                    },
                    {
                        label: "Organisations",
                        href: "/docs/operate/organisations",
                        description: "Manage members, roles, and billing for your team.",
                    },
                    {
                        label: "Enterprises",
                        href: "/docs/operate/enterprise",
                        description: "Manage your enterprises and their single sign-on.",
                        badge: "new",
                    },
                ],
            },
            {
                heading: "Operations",
                items: [
                    {
                        label: "Observability",
                        href: "/docs/operate/observability",
                        description: "Monitor metrics, logs, and slow queries.",
                    },
                    {
                        label: "Schema migration",
                        href: "/docs/operate/schema-migration",
                        description: "Promote schema updates safely.",
                    },
                    {
                        label: "Upgrading",
                        href: "/docs/operate/upgrading",
                        description: "Move to a newer major or minor version.",
                    },
                ],
            },
            {
                heading: "Self-hosted",
                items: [
                    {
                        label: "Self-hosted instance",
                        href: "/docs/operate/self-hosted",
                        description: "Run and operate SurrealDB on your own infrastructure.",
                    },
                ],
            },
        ],
    },
    {
        label: "Reference",
        href: "/docs/reference",
        sections: [
            {
                heading: "Core",
                items: [
                    {
                        label: "SurrealQL",
                        href: "/docs/reference/query-language",
                        description: "Explore the official SurrealQL query language.",
                    },
                    {
                        label: "APIs & protocols",
                        href: "/docs/reference/rest-api",
                        description:
                            "REST, HTTP, RPC, CBOR and Postgres wire protocols, and the error format they share.",
                    },
                ],
            },
            {
                heading: "Tools",
                items: [
                    {
                        label: "CLI",
                        href: "/docs/reference/cli",
                        description:
                            "Install and use the surreal command, with every command and flag.",
                    },
                    {
                        label: "SurrealDB Studio",
                        href: "/docs/reference/studio",
                        description: "Explore data in the official SurrealDB dashboard.",
                    },
                ],
            },
            {
                heading: "SDKs",
                items: [
                    {
                        label: "Rust",
                        href: "/docs/reference/rust",
                        // The kit's mark is light grey; light mode takes a dark copy.
                        image: { light: rustDark, dark: brandRust },
                    },
                    {
                        label: "JavaScript",
                        href: "/docs/reference/javascript",
                        image: brandJavaScript,
                    },
                    {
                        label: "Go",
                        href: "/docs/reference/golang",
                        image: brandGo,
                    },
                    {
                        label: ".NET",
                        href: "/docs/reference/dotnet",
                        image: brandDotNet,
                    },
                    {
                        label: "Java",
                        href: "/docs/reference/java",
                        image: brandJava,
                    },
                    {
                        label: "Kotlin",
                        href: "/docs/reference/kotlin",
                        image: brandKotlin,
                    },
                    {
                        label: "PHP",
                        href: "/docs/reference/php",
                        image: brandPHP,
                    },
                    {
                        label: "Mojo",
                        href: "/docs/reference/mojo",
                        icon: iconLangMojo,
                        iconColor: "#ff6a2c",
                    },
                    {
                        label: "Python",
                        href: "/docs/reference/python",
                        image: brandPython,
                    },
                    {
                        label: "Swift",
                        href: "/docs/reference/swift",
                        image: brandSwift,
                    },
                ],
            },
            {
                heading: "Libraries",
                items: [
                    {
                        label: "Surqlize for TypeScript",
                        href: "/docs/libraries/surqlize-typescript",
                        description: "A type-safe TypeScript ORM for SurrealDB.",
                    },
                    {
                        label: "Surqlize for PHP",
                        href: "/docs/libraries/surqlize-php",
                        description: "An object-relational mapper for SurrealDB in PHP.",
                    },
                    {
                        label: "SQL drivers for JavaScript",
                        href: "/docs/libraries/sql-drivers",
                        description:
                            "PostgreSQL and MySQL dialect clients for edge and serverless runtimes.",
                    },
                ],
            },
        ],
    },
];

export const AGENT_MEMORY_NAV_LINKS: NavEntry[] = [
    /** Label is display-only; target is the `agent-memory/index` hub at `/agent-memory`. */
    { label: "Get started", href: "/docs/agent-memory" },
    {
        label: "Learn",
        href: "/docs/agent-memory/learn",
        sections: [
            {
                heading: "Concepts",
                items: [
                    {
                        label: "Mental model",
                        href: "/docs/agent-memory/learn/mental-model",
                        description: "Contexts, scopes, sessions and memory categories.",
                    },
                    {
                        label: "Architecture",
                        href: "/docs/agent-memory/learn/architecture",
                        description: "Pillars, tri-temporal facts and retrieval tiers.",
                    },
                ],
            },
            {
                heading: "Storing",
                items: [
                    {
                        label: "Ingest",
                        href: "/docs/agent-memory/learn/ingest",
                        description: "Add documents, turns and facts.",
                    },
                    {
                        label: "Sessions",
                        href: "/docs/agent-memory/learn/sessions",
                        description: "Group turns into conversations.",
                    },
                ],
            },
            {
                heading: "Using",
                items: [
                    {
                        label: "Retrieve",
                        href: "/docs/agent-memory/learn/retrieve",
                        description: "Recall and search what is stored.",
                    },
                    {
                        label: "Reasoning",
                        href: "/docs/agent-memory/learn/reasoning",
                        description: "How facts are reconciled over time.",
                    },
                ],
            },
            {
                heading: "Managing",
                items: [
                    {
                        label: "Operations",
                        href: "/docs/agent-memory/learn/operations",
                        description: "Forget, reflect, profiles and the judge.",
                    },
                    {
                        label: "Tuning",
                        href: "/docs/agent-memory/learn/tuning",
                        description: "Caching, models and vocabulary.",
                    },
                ],
            },
            {
                heading: "Examples",
                items: [
                    {
                        label: "Showcase",
                        href: "/docs/agent-memory/cookbooks/showcase",
                        description: "Complete demos built on Agent Memory.",
                    },
                    {
                        label: "Cookbooks",
                        href: "/docs/agent-memory/cookbooks/build",
                        description: "Step-by-step agent builds.",
                    },
                    {
                        label: "Patterns",
                        href: "/docs/agent-memory/cookbooks/patterns",
                        description: "Reusable memory patterns.",
                    },
                ],
            },
        ],
    },
    {
        label: "Integrate",
        href: "/docs/agent-memory/integrate",
        sections: [
            {
                heading: "Connect",
                items: [
                    {
                        label: "SDKs",
                        href: "/docs/agent-memory/integrations/sdks",
                        description: "Client libraries for each language.",
                    },
                    {
                        label: "MCP server",
                        href: "/docs/agent-memory/integrations/mcp-server",
                        description: "Connect any MCP-capable agent.",
                    },
                    {
                        label: "Agent frameworks",
                        href: "/docs/agent-memory/integrations/frameworks",
                        description: "Memory for agent frameworks.",
                    },
                    {
                        label: "AI SDKs",
                        href: "/docs/agent-memory/integrations/ai-sdks",
                        description: "Memory for AI SDK applications.",
                    },
                    {
                        label: "Voice & realtime",
                        href: "/docs/agent-memory/integrations/voice",
                        description: "Memory for voice agents.",
                    },
                    {
                        label: "Automation",
                        href: "/docs/agent-memory/integrations/automation",
                        description: "Workflow and automation tools.",
                    },
                    {
                        label: "Surfaces",
                        href: "/docs/agent-memory/integrations/surfaces",
                        description: "Other ways to reach memory.",
                    },
                ],
            },
            {
                heading: "Migrate",
                items: [
                    {
                        label: "Migrating",
                        href: "/docs/agent-memory/cookbooks/migrate",
                        description: "Move from another memory layer.",
                    },
                ],
            },
        ],
    },
    {
        label: "Operate",
        href: "/docs/agent-memory/operate",
        sections: [
            {
                heading: "Where it runs",
                items: [
                    {
                        label: "SurrealDB Cloud",
                        href: "/docs/agent-memory/quickstarts/surrealdb-cloud",
                        description: "How contexts and keys work on Cloud.",
                    },
                    {
                        label: "Enterprise",
                        href: "/docs/agent-memory/operate/enterprise",
                        description: "Single-tenant and self-hosted deployments.",
                    },
                ],
            },
            {
                heading: "Operations",
                items: [
                    {
                        label: "Enterprise configuration",
                        href: "/docs/agent-memory/operate/enterprise/configuration",
                        description: "Models, storage, limits and security.",
                    },
                    {
                        label: "Observability",
                        href: "/docs/agent-memory/integrations/observability",
                        description: "Trace and monitor memory calls.",
                    },
                ],
            },
        ],
    },
    {
        label: "Reference",
        href: "/docs/agent-memory/reference",
        sections: [
            {
                heading: "APIs",
                items: [
                    {
                        label: "REST API",
                        href: "/docs/agent-memory/reference/rest-api",
                        description: "Every HTTP endpoint.",
                    },
                    {
                        label: "MCP tools",
                        href: "/docs/agent-memory/reference/mcp-tools",
                        description: "Every tool the MCP server offers.",
                    },
                    {
                        label: "CLI",
                        href: "/docs/agent-memory/reference/cli",
                        description: "The command-line client.",
                    },
                ],
            },
            {
                heading: "SDKs",
                items: [
                    {
                        label: "Python",
                        href: "/docs/agent-memory/reference/sdk-python",
                        description: "Python SDK reference.",
                    },
                    {
                        label: "JavaScript",
                        href: "/docs/agent-memory/reference/sdk-javascript",
                        description: "JavaScript SDK reference.",
                    },
                    {
                        label: "Kotlin",
                        href: "/docs/agent-memory/reference/sdk-kotlin",
                        description: "Kotlin SDK reference.",
                    },
                    {
                        label: "Swift",
                        href: "/docs/agent-memory/reference/sdk-swift",
                        description: "Swift SDK reference.",
                    },
                ],
            },
            {
                heading: "Lookup",
                items: [
                    {
                        label: "Configuration",
                        href: "/docs/agent-memory/reference/configuration",
                        description: "Every Context setting.",
                    },
                    {
                        label: "Errors",
                        href: "/docs/agent-memory/reference/errors",
                        description: "Error codes and their causes.",
                    },
                    {
                        label: "Glossary",
                        href: "/docs/agent-memory/reference/glossary",
                        description: "Terms used across these docs.",
                    },
                ],
            },
        ],
    },
];

/**
 * Top navigation for a path.
 *
 * The header is rendered once for the whole site, above the page groups, so it
 * has to work out its own links rather than take them from a group's layout.
 * Product is the only thing that varies, and the path already determines that.
 */
export function navLinksForPath(pathname: string): NavEntry[] {
    return getProductFromPath(pathname) === "agent-memory"
        ? AGENT_MEMORY_NAV_LINKS
        : SURREALDB_NAV_LINKS;
}
