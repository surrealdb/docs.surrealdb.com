import {
    AGENT_MEMORY_NAV_LINKS,
    isMenuGroup,
    type NavMenuGroup,
    SURREALDB_NAV_LINKS,
} from "~/components/Layout/nav";
import type { NavLink, NavSection } from "./navigation";

/** Base the docs are served from - `base` in `vite.config.ts`. */
const DOCS_BASE = "/docs";

/** The top-bar sections of both products that have a hub page. */
const SECTION_GROUPS: NavMenuGroup[] = [...SURREALDB_NAV_LINKS, ...AGENT_MEMORY_NAV_LINKS].filter(
    (entry): entry is NavMenuGroup => isMenuGroup(entry) && entry.href !== undefined,
);

/** Hub paths as the sidebar writes them, without the `/docs` base. */
const HUB_PATHS = new Set(SECTION_GROUPS.map((group) => stripBase(group.href ?? "")));

function stripBase(href: string): string {
    return href.startsWith(DOCS_BASE) ? href.slice(DOCS_BASE.length) || "/" : href;
}

function normalize(path: string): string {
    return path.replace(/\/$/, "") || "/";
}

/**
 * Removes the section hub pages from a sidebar.
 *
 * The hubs live in the root collection of each product, so the Get started
 * sidebar would otherwise list Learn, Integrate, Operate and Reference again
 * below the top bar that already lists them.
 */
export function withoutSectionHubs(sections: NavSection[]): NavSection[] {
    const keep = (links: NavLink[]): NavLink[] =>
        links
            .filter((link) => !HUB_PATHS.has(normalize(link.path)))
            .map((link) => (link.children ? { ...link, children: keep(link.children) } : link));

    return sections
        .map((section) => ({ ...section, links: keep(section.links) }))
        .filter((section) => section.links.length > 0);
}

/**
 * The sidebar of a section hub page: the parts of that section, grouped as its
 * menu in the top bar groups them. Returns undefined for any other page.
 */
export function sectionHubNavigation(pathname: string): NavSection[] | undefined {
    const path = normalize(pathname);
    const group = SECTION_GROUPS.find((candidate) => stripBase(candidate.href ?? "") === path);

    if (!group) return undefined;

    return group.sections.map((section) => ({
        title: section.heading ?? group.label,
        links: section.items.map((item) => ({
            title: item.label,
            path: stripBase(item.href),
        })),
    }));
}

/**
 * The paths of a section's menu items, in the order the top bar lists them and
 * without the `/docs` base. The section sidebar lists its groups in this order.
 */
export function sectionMenuPaths(hubPath: string): string[] {
    const path = normalize(hubPath);
    const group = SECTION_GROUPS.find((candidate) => stripBase(candidate.href ?? "") === path);

    return (
        group?.sections.flatMap((section) => section.items.map((item) => stripBase(item.href))) ??
        []
    );
}
