import {
    iconAPI,
    iconAtom,
    iconAuthKeyhole,
    iconBraces,
    iconCloud,
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
    iconMemory,
    iconOffice,
    iconPlugin,
    iconProgressClock,
    iconQuery,
    iconRoutes,
    iconSandbox,
    iconSidekick,
    iconSpectron,
    iconSurrealist,
    iconTable,
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
    description?: string;
    external?: boolean;
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
                        label: "Spectron",
                        href: "/docs/spectron",
                        description: "The AI memory and knowledge layer.",
                        icon: iconSpectron,
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
                        label: "Deployment",
                        href: "/docs/build/deployment",
                        description: "Deploy to the cloud, edge, or on-premises.",
                        icon: iconRoutes,
                    },
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
                        label: "AI agents",
                        href: "/docs/build/ai-agents",
                        description: "Build AI agents on SurrealDB.",
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
                        description: "Run hosted instances from the Cloud console.",
                        icon: iconCloud,
                    },
                    {
                        label: "Self-hosted",
                        href: "/docs/manage/self-hosted",
                        description: "Run your own clusters and infrastructure.",
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
                        description: "Monitor metrics, logs, and slow queries.",
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
                        description: "Explore data in the official SurrealDB IDE.",
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
                        label: "CLI tool",
                        href: "/docs/reference/cli",
                        description: "Install, back up, and manage from the CLI.",
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
                        icon: iconLangRust,
                    },
                    {
                        label: "JavaScript",
                        href: "/docs/reference/javascript",
                        icon: iconLangJavaScript,
                    },
                    {
                        label: "Go",
                        href: "/docs/reference/golang",
                        icon: iconLangGo,
                    },
                    {
                        label: ".NET",
                        href: "/docs/reference/dotnet",
                        icon: iconLangDotNet,
                    },
                    {
                        label: "Java",
                        href: "/docs/reference/java",
                        icon: iconLangJava,
                    },
                    {
                        label: "Kotlin",
                        href: "/docs/reference/kotlin",
                        icon: iconLangKotlin,
                    },
                    {
                        label: "PHP",
                        href: "/docs/reference/php",
                        icon: iconLangPHP,
                    },
                    {
                        label: "Mojo",
                        href: "/docs/reference/mojo",
                        icon: iconLangMojo,
                    },
                    {
                        label: "Python",
                        href: "/docs/reference/python",
                        icon: iconLangPython,
                    },
                    {
                        label: "Swift",
                        href: "/docs/reference/swift",
                        icon: iconLangSwift,
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
