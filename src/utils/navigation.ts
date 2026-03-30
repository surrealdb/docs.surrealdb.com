import {
    getCollectionTree,
    type TypedFolderNode,
    type TypedTreeNode,
} from "vike-content-collection";
import type { SectionIconName } from "./icons";
import type { PageSchema } from "./schema";

export interface NavSection {
    title: string;
    icon?: SectionIconName;
    links: NavLink[];
}

export interface NavLink {
    title: string;
    path: string;
    children?: NavLink[];
}

type FolderNode = TypedFolderNode<PageSchema>;
type TreeNode = TypedTreeNode<PageSchema>;

interface Positioned<T> {
    value: T;
    position: number;
}

function sortByPosition<T>(items: Positioned<T>[]): T[] {
    return items.sort((a, b) => a.position - b.position).map(({ value }) => value);
}

/**
 * Collect child links for a folder as positioned items (unsorted),
 * excluding the folder's own entry.
 */
function collectLinks(folder: FolderNode, baseUrl: string): Positioned<NavLink>[] {
    const items: Positioned<NavLink>[] = [];

    for (const child of folder.children) {
        if (child.name === "__category") continue;

        if (isFolder(child)) {
            const category = getCategoryEntry(child);
            const children = sortByPosition(collectLinks(child, baseUrl));
            const href = child.entry
                ? join(baseUrl, child.entry.slug)
                : (children[0]?.path ?? join(baseUrl));

            items.push({
                value: {
                    title: category?.metadata.title ?? child.entry?.metadata.title ?? child.name,
                    path: href,
                    children: children.length > 0 ? children : undefined,
                },
                position: category?.metadata.position ?? 0,
            });
        } else {
            const { metadata, slug } = child.entry;

            items.push({
                value: {
                    title: metadata.title ?? child.name,
                    path: join(baseUrl, slug),
                },
                position: metadata.position ?? 0,
            });
        }
    }

    return items;
}

/**
 * Build a navigation section from a folder node.
 * The folder's own entry (if any) is included as a link,
 * sorted by its position alongside the other children.
 */
function buildSection(folder: FolderNode, baseUrl: string): Positioned<NavSection> {
    const category = getCategoryEntry(folder);
    const items = collectLinks(folder, baseUrl);

    if (folder.entry) {
        items.push({
            value: {
                title: folder.entry.metadata.title ?? folder.name,
                path: join(baseUrl, folder.entry.slug),
            },
            position: folder.entry.metadata.position ?? 0,
        });
    }

    return {
        value: {
            title: category?.metadata.title ?? folder.name,
            icon: category?.metadata.icon,
            links: sortByPosition(items),
        },
        position: category?.metadata.position ?? 0,
    };
}

/**
 * Build a navigation hierarchy from a content collection tree.
 *
 * The root folder becomes the first section, and each top-level
 * sub-folder becomes an additional section (with optional icons).
 * Deeper folders become links with children. Ordering is driven
 * by the `position` field in `__category` entries and page frontmatter.
 */
export function buildNavigation(id: string): NavSection[] {
    const root = getCollectionTree(id) as FolderNode;
    const rootCategory = getCategoryEntry(root);

    const rootLinks: Positioned<NavLink>[] = [];
    const sections: Positioned<NavSection>[] = [];

    if (root.entry) {
        rootLinks.push({
            value: {
                title: root.entry.metadata.title ?? "",
                path: join(id),
            },
            position: root.entry.metadata.position ?? 0,
        });
    }

    for (const child of root.children) {
        if (child.name === "__category") continue;

        if (isFolder(child)) {
            sections.push(buildSection(child, id));
        } else {
            const { metadata, slug } = child.entry;

            rootLinks.push({
                value: {
                    title: metadata.title ?? child.name,
                    path: join(id, slug),
                },
                position: metadata.position ?? 0,
            });
        }
    }

    const rootSection: NavSection = {
        title: rootCategory?.metadata.title ?? "Overview",
        icon: rootCategory?.metadata.icon,
        links: sortByPosition(rootLinks),
    };

    return [rootSection, ...sortByPosition(sections)];
}

/**
 * Flatten all navigable links from sections into a single ordered list.
 * Useful for prev/next page navigation.
 */
export function flattenNavigation(sections: NavSection[]): NavLink[] {
    const result: NavLink[] = [];

    function collect(links: NavLink[]) {
        for (const link of links) {
            result.push(link);

            if (link.children) {
                collect(link.children);
            }
        }
    }

    for (const section of sections) {
        collect(section.links);
    }

    return result;
}

/**
 * Find the index of the link that matches the given pathname.
 */
export function findLinkIndex(pages: NavLink[], pathname: string): number {
    const normalized = normalize(pathname);
    return pages.findIndex((page) => page.path === normalized);
}

function normalize(href: string) {
    return href.replace(/\/$/, "");
}

function join(...parts: string[]) {
    return `/${parts
        .flatMap((p) => p.split("/"))
        .filter(Boolean)
        .join("/")}`;
}

function isFolder(node: TreeNode): node is FolderNode {
    return "children" in node;
}

function getCategoryEntry(folder: FolderNode) {
    for (const child of folder.children) {
        if (child.name === "__category" && !isFolder(child)) {
            return child.entry;
        }
    }
    return undefined;
}
