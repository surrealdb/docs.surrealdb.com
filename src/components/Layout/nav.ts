import {
    iconAPI,
    iconAuthKeyhole,
    iconAutoFix,
    iconBraces,
    iconCloud,
    iconFunction,
    iconMemory,
    iconProgressClock,
    iconQuery,
    iconRelation,
    iconRoutes,
    iconSandbox,
    iconServerSecure,
    iconSidekick,
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
                        label: "Agent memory context",
                        href: "/docs/learn/context",
                        description: "LLM memory and tool context patterns.",
                        icon: iconMemory,
                    },
                    {
                        label: "Extensions",
                        href: "/docs/learn/extensions",
                        description: "Functions, procedures, and plugins.",
                        icon: iconFunction,
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
                        icon: iconSandbox,
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
                        icon: iconRelation,
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
                        icon: iconServerSecure,
                    },
                ],
            },
            {
                heading: "Operations",
                items: [
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
                        icon: iconAutoFix,
                    },
                ],
            },
        ],
    },
    {
        label: "Reference",
        sections: [
            {
                items: [
                    {
                        label: "Query language",
                        href: "/docs/reference/query-language",
                        description: "Syntax, statements, and builtins.",
                        icon: iconText,
                    },
                    {
                        label: "CLI tools",
                        href: "/docs/reference/cli",
                        description: "CLI install, backup, and ops.",
                        icon: iconWrench,
                    },
                    {
                        label: "REST API",
                        href: "/docs/reference/rest-api",
                        description: "HTTP API for queries and admin.",
                        icon: iconAPI,
                    },
                ],
            },
        ],
    },
];

export const SPECTRON_NAV_LINKS: NavEntry[] = [{ label: "Start", href: "/docs/spectron" }];
