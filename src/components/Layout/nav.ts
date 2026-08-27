import type { MantineColor } from "@mantine/core";
import {
    iconAI,
    iconAPI,
    iconAtom,
    iconAuthKeyhole,
    iconBraces,
    iconChart,
    iconCommand,
    iconConsole,
    iconIntegration,
    iconLangDotNet,
    iconLangGo,
    iconLangJava,
    iconLangJavaScript,
    iconLangKotlin,
    iconLangMojo,
    iconLangPHP,
    iconLangPython,
    iconLangRust,
    iconLangSwift,
    iconMCP,
    iconMemory,
    iconOffice,
    iconOrganization,
    iconPlugin,
    iconProgressClock,
    iconQuery,
    iconSandbox,
    iconServer,
    iconStudio,
    iconSurreal,
    iconTable,
    iconTransfer,
    iconVideo,
} from "@surrealdb/ui";
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
    icon: string;
    /**
     * Mantine colour key used to tint the item's icon - e.g. `"orange"`.
     * Omit it to use the neutral chip, which is the default for most items.
     */
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
        sections: [
            {
                heading: "Database",
                items: [
                    {
                        label: "Querying",
                        href: "/docs/learn/querying",
                        description: "Mutate and query your data.",
                        icon: iconQuery,
                    },
                    {
                        label: "Schema management",
                        href: "/docs/learn/schema-management",
                        description: "Define namespaces, tables, and indexes.",
                        icon: iconTable,
                    },
                    {
                        label: "Data models",
                        href: "/docs/learn/data-models",
                        description: "Model documents, graphs, vectors, and more.",
                        icon: iconBraces,
                    },
                    {
                        label: "Security",
                        href: "/docs/learn/security",
                        description: "Configure authentication, scopes, and access.",
                        icon: iconAuthKeyhole,
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
                        icon: iconSurreal,
                        external: true,
                    },
                    {
                        label: "Extensions",
                        href: "/docs/learn/extensions",
                        description: "Extend SurrealDB with functions and plugins.",
                        icon: iconPlugin,
                    },
                ],
            },
        ],
    },
    {
        label: "Build",
        sections: [
            {
                heading: "Running",
                items: [
                    {
                        label: "Embedding SurrealDB",
                        href: "/docs/build/embedding",
                        description: "Embed the engine natively or with WebAssembly.",
                        icon: iconMemory,
                    },
                ],
            },
            {
                heading: "Ecosystem",
                items: [
                    {
                        label: "Migrating",
                        href: "/docs/build/migrating",
                        description: "Import data and schemas from other databases.",
                        icon: iconTransfer,
                    },
                    {
                        label: "Integrations",
                        href: "/docs/build/integrations",
                        description: "Connect SDKs, frameworks, and tools.",
                        icon: iconIntegration,
                    },
                ],
            },
            {
                heading: "Intelligence",
                items: [
                    {
                        label: "Agent setup",
                        href: "/docs/agents",
                        description: "Set up your coding agent for SurrealDB.",
                        icon: iconMCP,
                        badge: "new",
                    },
                    {
                        label: "AI Agents",
                        href: "/docs/build/ai-agents",
                        description: "Integrate SurrealDB with your agents.",
                        icon: iconAI,
                    },
                ],
            },
        ],
    },
    {
        label: "Manage",
        sections: [
            {
                heading: "Resources",
                items: [
                    {
                        label: "Instances",
                        href: "/docs/manage/instances",
                        description: "Create, scale, and monitor your database instances.",
                        icon: iconServer,
                    },
                    {
                        label: "Organisations",
                        href: "/docs/manage/organisations",
                        description: "Manage members, roles, and billing for your team.",
                        icon: iconOrganization,
                    },
                ],
            },
            {
                heading: "Operations",
                items: [
                    {
                        label: "surrealctl",
                        href: "/docs/manage/surrealctl",
                        description: "Manage instances and organisations from the command line.",
                        icon: iconCommand,
                        badge: "new",
                    },
                    {
                        label: "Observability",
                        href: "/docs/manage/observability",
                        description: "Monitor metrics, logs, and slow queries.",
                        icon: iconChart,
                    },
                    {
                        label: "Schema migration",
                        href: "/docs/manage/schema-migration",
                        description: "Promote schema updates safely.",
                        icon: iconProgressClock,
                    },
                ],
            },
            {
                heading: "Self-hosted",
                items: [
                    {
                        label: "Self-hosted instance",
                        href: "/docs/manage/self-hosted",
                        description: "Run and operate SurrealDB on your own infrastructure.",
                        icon: iconOffice,
                    },
                ],
            },
        ],
    },
    {
        label: "Explore",
        sections: [
            {
                heading: "Tools",
                items: [
                    {
                        label: "SurrealDB Studio",
                        href: "/docs/explore/studio",
                        description: "Explore data in the official SurrealDB dashboard.",
                        icon: iconStudio,
                    },
                ],
            },
            {
                heading: "Guides and resources",
                items: [
                    {
                        label: "Tutorials & demos",
                        href: "/docs/explore/tutorials",
                        description: "Follow hands-on walkthroughs and demos.",
                        icon: iconVideo,
                    },
                    {
                        label: "SurrealDB Labs",
                        href: "/docs/labs",
                        description: "Preview experimental features and lab notes.",
                        icon: iconAtom,
                    },
                ],
            },
        ],
    },
    {
        label: "Reference",
        sections: [
            {
                heading: "Core",
                items: [
                    {
                        label: "SurrealQL",
                        href: "/docs/reference/query-language",
                        description: "Explore the official SurrealQL query language.",
                        icon: iconSandbox,
                    },
                    {
                        label: "REST API",
                        href: "/docs/reference/rest-api",
                        description: "Call the HTTP API for queries and admin.",
                        icon: iconAPI,
                    },
                    {
                        label: "CLI Tools",
                        href: "/docs/reference/cli",
                        description: "Command reference for surrealctl, surreal, and surqlfmt.",
                        icon: iconConsole,
                    },
                ],
            },
            {
                // Tints are Mantine colour keys, resolved to the scheme-aware
                // `-light` pair, so each SDK reads as its own language without
                // breaking contrast in either theme.
                heading: "SDKs",
                items: [
                    {
                        label: "Rust",
                        href: "/docs/reference/rust",
                        icon: iconLangRust,
                        iconColor: "orange",
                    },
                    {
                        label: "JavaScript",
                        href: "/docs/reference/javascript",
                        icon: iconLangJavaScript,
                        iconColor: "yellow",
                    },
                    {
                        label: "Go",
                        href: "/docs/reference/golang",
                        icon: iconLangGo,
                        iconColor: "cyan",
                    },
                    {
                        label: ".NET",
                        href: "/docs/reference/dotnet",
                        icon: iconLangDotNet,
                        iconColor: "grape",
                    },
                    {
                        label: "Java",
                        href: "/docs/reference/java",
                        icon: iconLangJava,
                        iconColor: "red",
                    },
                    {
                        label: "Kotlin",
                        href: "/docs/reference/kotlin",
                        icon: iconLangKotlin,
                        iconColor: "violet",
                    },
                    {
                        label: "PHP",
                        href: "/docs/reference/php",
                        icon: iconLangPHP,
                        iconColor: "indigo",
                    },
                    {
                        label: "Mojo",
                        href: "/docs/reference/mojo",
                        icon: iconLangMojo,
                        iconColor: "orange",
                    },
                    {
                        label: "Python",
                        href: "/docs/reference/python",
                        icon: iconLangPython,
                        iconColor: "blue",
                    },
                    {
                        label: "Swift",
                        href: "/docs/reference/swift",
                        icon: iconLangSwift,
                        iconColor: "orange",
                    },
                ],
            },
        ],
    },
];

export const AGENT_MEMORY_NAV_LINKS: NavEntry[] = [
    /** Label is display-only; target is the `agent-memory/index` hub at `/agent-memory`. */
    { label: "Get started", href: "/docs/agent-memory" },
    { label: "Memory & knowledge", href: "/docs/agent-memory/memory-and-knowledge" },
    { label: "Integrations", href: "/docs/agent-memory/integrations" },
    { label: "Cookbooks", href: "/docs/agent-memory/cookbooks" },
    { label: "Reference", href: "/docs/agent-memory/reference" },
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
