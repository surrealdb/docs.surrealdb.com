import {
    iconAPI,
    iconAtom,
    iconAuthKeyhole,
    iconBraces,
    iconCloud,
    iconIntegration,
    iconMemory,
    iconOffice,
    iconPlugin,
    iconProgressClock,
    iconQuery,
    iconRoutes,
    iconSidekick,
    iconSpectron,
    iconSurrealist,
    iconTable,
    iconText,
    iconTransfer,
    iconVideo,
    iconWrench,
} from "@surrealdb/ui";

export interface NavItem {
    label: string;
    href: string;
}

export interface NavMenuItem {
    label: string;
    href: string;
    description: string;
    icon: string;
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
    { label: "Start", href: "/docs/" },
    {
        label: "Learn",
        sections: [
            {
                heading: "Database",
                items: [
                    {
                        label: "Querying",
                        href: "/docs/learn/querying",
                        description: "SurrealQL and live result handling.",
                        icon: iconQuery,
                    },
                    {
                        label: "Schema management",
                        href: "/docs/learn/schema-management",
                        description: "Namespaces, tables, and indexes.",
                        icon: iconTable,
                    },
                    {
                        label: "Data models",
                        href: "/docs/learn/data-models",
                        description: "Documents, graphs, vectors, time series.",
                        icon: iconBraces,
                    },
                    {
                        label: "Security",
                        href: "/docs/learn/security",
                        description: "Authentication, scopes, and permissions.",
                        icon: iconAuthKeyhole,
                    },
                ],
            },
            {
                heading: "Extending",
                items: [
                    {
                        label: "Spectron",
                        href: "/docs/spectron",
                        description: "LLM memory and tool context patterns.",
                        icon: iconSpectron,
                    },
                    {
                        label: "Extensions",
                        href: "/docs/learn/extensions",
                        description: "Functions, procedures, and plugins.",
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
                        label: "Deployment",
                        href: "/docs/build/deployment",
                        description: "Cloud, edge, and on-premises.",
                        icon: iconRoutes,
                    },
                    {
                        label: "Embedding SurrealDB",
                        href: "/docs/build/embedding",
                        description: "Native and WebAssembly embedding.",
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
                        description: "Import data and schemas from elsewhere.",
                        icon: iconTransfer,
                    },
                    {
                        label: "Integrations",
                        href: "/docs/build/integrations",
                        description: "SDKs, frameworks, and connectors.",
                        icon: iconIntegration,
                    },
                ],
            },
            {
                heading: "Intelligence",
                items: [
                    {
                        label: "AI agents",
                        href: "/docs/build/ai-agents",
                        description: "Design patterns for AI agents.",
                        icon: iconSidekick,
                    },
                ],
            },
        ],
    },
    {
        label: "Manage",
        sections: [
            {
                heading: "Hosting",
                items: [
                    {
                        label: "SurrealDB Cloud",
                        href: "/docs/manage/cloud",
                        description: "Hosted instances and Cloud console.",
                        icon: iconCloud,
                    },
                    {
                        label: "Self-hosted",
                        href: "/docs/manage/self-hosted",
                        description: "Clusters, backups, your infrastructure.",
                        icon: iconOffice,
                    },
                ],
            },
            {
                heading: "Operations",
                items: [
                    {
                        label: "Observability",
                        href: "/docs/manage/observability",
                        description: "Metrics, OTLP, logging, audit and slow-query pipelines.",
                        icon: iconRoutes,
                    },
                    {
                        label: "Schema migration",
                        href: "/docs/manage/schema-migration",
                        description: "Promote schema updates safely.",
                        icon: iconProgressClock,
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
                        label: "Surrealist UI",
                        href: "/docs/explore/surrealist",
                        description: "Official SurrealDB IDE.",
                        icon: iconSurrealist,
                    },
                ],
            },
            {
                heading: "Guides and resources",
                items: [
                    {
                        label: "Tutorials & demos",
                        href: "/docs/explore/tutorials",
                        description: "Hands-on walkthroughs and demos.",
                        icon: iconVideo,
                    },
                    {
                        label: "SurrealDB Labs",
                        href: "/docs/labs",
                        description: "Preview features and lab notes.",
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
                        label: "Query language",
                        href: "/docs/reference/query-language",
                        description: "Syntax, statements, and builtins.",
                        icon: iconText,
                    },
                    {
                        label: "REST API",
                        href: "/docs/reference/rest-api",
                        description: "HTTP API for queries and admin.",
                        icon: iconAPI,
                    },
                    {
                        label: "CLI tool",
                        href: "/docs/reference/cli",
                        description: "CLI install, backup, and ops.",
                        icon: iconWrench,
                    },
                ],
            },
            {
                heading: "SDKs",
                items: [
                    {
                        label: "Rust",
                        href: "/docs/reference/rust",
                        description: "Async client and embedded engine.",
                        icon: iconBraces,
                    },
                    {
                        label: "JavaScript",
                        href: "/docs/reference/javascript",
                        description: "Browser, Node, and WASM client.",
                        icon: iconBraces,
                    },
                    {
                        label: "Go",
                        href: "/docs/reference/golang",
                        description: "Server-side client for Go.",
                        icon: iconBraces,
                    },
                    {
                        label: ".NET",
                        href: "/docs/reference/dotnet",
                        description: "C# client and embedded engine.",
                        icon: iconBraces,
                    },
                    {
                        label: "Java",
                        href: "/docs/reference/java",
                        description: "Client library for the JVM.",
                        icon: iconBraces,
                    },
                    {
                        label: "Kotlin",
                        href: "/docs/reference/kotlin",
                        description: "Idiomatic Kotlin client.",
                        icon: iconBraces,
                    },
                    {
                        label: "PHP",
                        href: "/docs/reference/php",
                        description: "Client for PHP applications.",
                        icon: iconBraces,
                    },
                    {
                        label: "Mojo",
                        href: "/docs/reference/mojo",
                        description: "Client for the Mojo language.",
                        icon: iconBraces,
                    },
                    {
                        label: "Python",
                        href: "/docs/reference/python",
                        description: "Sync and async Python client.",
                        icon: iconBraces,
                    },
                    {
                        label: "Swift",
                        href: "/docs/reference/swift",
                        description: "Native client for Swift.",
                        icon: iconBraces,
                    },
                ],
            },
        ],
    },
];

export const SPECTRON_NAV_LINKS: NavEntry[] = [
    /** Label is display-only; target is the `spectron/index` hub at `/spectron`. */
    { label: "Get started", href: "/docs/spectron" },
    { label: "Memory & knowledge", href: "/docs/spectron/agent-memory" },
    { label: "Integrations", href: "/docs/spectron/integrations" },
    { label: "Self-hosting", href: "/docs/spectron/self-hosting" },
    { label: "Cookbooks", href: "/docs/spectron/cookbooks" },
    { label: "Reference", href: "/docs/spectron/reference" },
];
