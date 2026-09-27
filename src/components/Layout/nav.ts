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
    image?: string;
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
                heading: "Extending",
                items: [
                    {
                        label: "Agent Memory",
                        href: "/docs/agent-memory",
                        description: "The AI memory and knowledge layer.",
                        external: true,
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
        label: "Build",
        href: "/docs/build",
        sections: [
            {
                heading: "Running",
                items: [
                    {
                        label: "Embedding SurrealDB",
                        href: "/docs/build/embedding",
                        description: "Embed the engine natively or with WebAssembly.",
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
                    },
                    {
                        label: "Integrations",
                        href: "/docs/build/integrations",
                        description: "Connect SDKs, frameworks, and tools.",
                    },
                ],
            },
            {
                heading: "Intelligence",
                items: [
                    {
                        label: "AI Agents",
                        href: "/docs/build/ai-agents",
                        description: "Integrate SurrealDB with your agents.",
                    },
                ],
            },
        ],
    },
    {
        label: "Manage",
        href: "/docs/manage",
        sections: [
            {
                heading: "Resources",
                items: [
                    {
                        label: "Instances",
                        href: "/docs/manage/instances",
                        description: "Create, scale, and monitor your database instances.",
                    },
                    {
                        label: "Organisations",
                        href: "/docs/manage/organisations",
                        description: "Manage members, roles, and billing for your team.",
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
                        badge: "new",
                    },
                    {
                        label: "Observability",
                        href: "/docs/manage/observability",
                        description: "Monitor metrics, logs, and slow queries.",
                    },
                    {
                        label: "Schema migration",
                        href: "/docs/manage/schema-migration",
                        description: "Promote schema updates safely.",
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
                    },
                ],
            },
        ],
    },
    {
        label: "Explore",
        href: "/docs/explore",
        sections: [
            {
                heading: "Tools",
                items: [
                    {
                        label: "SurrealDB Studio",
                        href: "/docs/explore/studio",
                        description: "Explore data in the official SurrealDB dashboard.",
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
                    },
                    {
                        label: "SurrealDB Labs",
                        href: "/docs/labs",
                        description: "Preview experimental features and lab notes.",
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
                    {
                        label: "CLI Tools",
                        href: "/docs/reference/cli",
                        description: "Command reference for surrealctl, surreal, and surqlfmt.",
                    },
                ],
            },
            {
                heading: "SDKs",
                items: [
                    {
                        label: "Rust",
                        href: "/docs/reference/rust",
                        image: brandRust,
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
