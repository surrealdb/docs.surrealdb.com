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
    /** From the folder's `__category.json`: what the section covers, for a card. */
    description?: string;
    picto?: string;
    pictoDark?: string;
    /**
     * The page the heading links to. Set when the section's first page repeats
     * the heading, so the heading is that page and `links` leaves it out.
     */
    landing?: NavLink;
    links: NavLink[];
}

export interface NavLink {
    title: string;
    path: string;
    /** What the page covers, set only on a section hub's own data, for its cards. */
    description?: string;
    children?: NavLink[];
}

/**
 * One collection as a group of its section's sidebar, such as Querying inside
 * Learn. The group's heading links to `path`, and its body is the collection's
 * own sidebar: `links` first, then `sections` under their headings.
 */
export interface NavGroup {
    title: string;
    /** The page the heading links to: the collection's landing page. */
    path: string;
    /** One sentence on what the group covers, from its `__category.json`. */
    description?: string;
    /** The picto a card for the group shows, from its `__category.json`. */
    picto?: string;
    /** The dark-mode counterpart of `picto`. */
    pictoDark?: string;
    /** Set when the landing page is the heading, so `links` leaves it out. */
    landing?: NavLink;
    links: NavLink[];
    sections: NavSection[];
}

type FolderNode = TypedFolderNode<PageSchema>;
type TreeNode = TypedTreeNode<PageSchema>;

interface Positioned<T> {
    value: T;
    position: number;
}

const words = (title: string): string[] =>
    title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

/** A rough stem, enough to treat "get" and "getting", or "start" and "started", alike. */
function stem(word: string): string {
    return word
        .replace(/(ing|ed|es|s)$/, "")
        .replace(/(.)\1$/, "$1")
        .replace(/e$/, "");
}

const stemmed = (title: string): string => [...new Set(words(title).map(stem))].sort().join(" ");

/** Whether two titles use the same words, ignoring case, punctuation and endings. */
function sameTitle(a: string, b: string): boolean {
    const key = stemmed(a);
    return key !== "" && key === stemmed(b);
}

/**
 * Makes a section's heading a link to its first page when that page repeats the
 * heading, such as an "Agent setup" page under an "Agent setup" heading. The
 * page moves from the list to the heading. A section with nothing else in it
 * keeps the page as its only row, so the sidebar never shows a bare heading.
 */
function withLanding(section: NavSection): NavSection {
    const [first, ...rest] = section.links;

    if (!first || rest.length === 0) return section;
    if (first.children?.length || !sameTitle(section.title, first.title)) return section;

    return { ...section, landing: first, links: rest };
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
        if (isHidden(child)) continue;

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
        value: withLanding({
            title: category?.metadata.title ?? folder.name,
            icon: category?.metadata.icon,
            description: category?.metadata.description,
            picto: category?.metadata.picto,
            pictoDark: category?.metadata.pictoDark,
            links: sortByPosition(items),
        }),
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
export function buildNavigation(id: string, baseUrl?: string): NavSection[] {
    const root = getCollectionTree(id) as FolderNode;
    const rootCategory = getCategoryEntry(root);
    const base = baseUrl ?? id;

    const rootLinks: Positioned<NavLink>[] = [];
    const sections: Positioned<NavSection>[] = [];

    if (root.entry) {
        rootLinks.push({
            value: {
                title: root.entry.metadata.title ?? "",
                path: join(base),
            },
            position: root.entry.metadata.position ?? 0,
        });
    }

    for (const child of root.children) {
        if (child.name === "__category") continue;
        if (isHidden(child)) continue;

        if (isFolder(child)) {
            const category = getCategoryEntry(child);
            if (category?.metadata.icon) {
                sections.push(buildSection(child, base));
            } else {
                const children = sortByPosition(collectLinks(child, base));
                const href = child.entry
                    ? join(base, child.entry.slug)
                    : (children[0]?.path ?? join(base));

                rootLinks.push({
                    value: {
                        title:
                            category?.metadata.title ?? child.entry?.metadata.title ?? child.name,
                        path: href,
                        children: children.length > 0 ? children : undefined,
                    },
                    position: category?.metadata.position ?? 0,
                });
            }
        } else {
            const { metadata, slug } = child.entry;

            rootLinks.push({
                value: {
                    title: metadata.title ?? child.name,
                    path: join(base, slug),
                },
                position: metadata.position ?? 0,
            });
        }
    }

    const rootSection = withLanding({
        title: rootCategory?.metadata.title ?? "Overview",
        icon: rootCategory?.metadata.icon,
        description: rootCategory?.metadata.description,
        picto: rootCategory?.metadata.picto,
        pictoDark: rootCategory?.metadata.pictoDark,
        links: sortByPosition(rootLinks),
    });

    // With nothing else in the section the landing page stays a row, and one
    // that repeats the heading exactly is listed as the section's overview.
    if (!rootSection.landing) {
        rootSection.links = rootSection.links.map((link) =>
            link.path === join(base) &&
            link.title.trim().toLowerCase() === rootSection.title.trim().toLowerCase()
                ? { ...link, title: "Overview" }
                : link,
        );
    }

    return [rootSection, ...sortByPosition(sections)];
}

/** The collections that share a sidebar, by the section they belong to. */
const SECTION_COLLECTIONS: Record<string, (id: string) => boolean> = {
    learn: (id) => id.startsWith("learn/"),
    integrate: (id) => id.startsWith("integrate/"),
    operate: (id) => id.startsWith("operate/"),
    reference: (id) => id.startsWith("reference/") || id === "libraries",
    "agent-memory-learn": (id) => id === "agent-memory/learn" || id === "agent-memory/cookbooks",
};

/** The hub page of each section that shares a sidebar, as the sidebar writes paths. */
export const SECTION_HUBS: Record<string, string> = {
    learn: "/learn",
    integrate: "/integrate",
    operate: "/operate",
    reference: "/reference",
    "agent-memory-learn": "/agent-memory/learn",
};

/**
 * The sections that are a single collection: the hub page of each, and the
 * collection it opens. Their sidebar is that collection's own, with its
 * sections shown as groups.
 */
export const SOLO_SECTIONS: Record<string, string> = {
    "/agent-memory/integrate": "agent-memory/integrations",
    "/agent-memory/operate": "agent-memory/operate",
    "/agent-memory/reference": "agent-memory/reference",
};

/** The collection that a hub page or a collection page belongs to, if it is a section of its own. */
export function soloCollectionOf(id: string, pathname: string): string | undefined {
    if (Object.values(SOLO_SECTIONS).includes(id)) return id;

    return SOLO_SECTIONS[normalize(pathname)];
}

/** The section sidebar that a collection is part of, if it shares one. */
export function sectionOf(id: string): string | undefined {
    return Object.keys(SECTION_COLLECTIONS).find((section) => SECTION_COLLECTIONS[section](id));
}

/** The section sidebar that a hub page shows, if it shares one. */
export function sectionOfHub(pathname: string): string | undefined {
    const path = normalize(pathname);

    return Object.keys(SECTION_HUBS).find((section) => SECTION_HUBS[section] === path);
}

const sectionCache = new Map<string, NavGroup[]>();

/**
 * Where a group sits in its section's menu: the index of the first menu item
 * that points into the group's collection. A group the menu does not list
 * goes last.
 */
function menuIndex(collectionId: string, menu: string[]): number {
    const at = menu.findIndex((path) => {
        const prefix = `/${collectionId}`;

        return path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}#`);
    });

    return at === -1 ? Number.MAX_SAFE_INTEGER : at;
}

/**
 * Build the sidebar of a whole section, with one group for each of its
 * collections. The groups follow the order of the section's menu in the top
 * bar, so the sidebar and the menu list the parts alike, and then the
 * `__category` positions.
 *
 * The trees are built once in production, because the content does not change
 * while the server runs.
 *
 * @param section - A key of `SECTION_COLLECTIONS`.
 * @param collectionIds - Every collection id, of which the section takes its own.
 * @param menu - The paths of the section's menu items, in the order the menu lists them.
 */
export function buildSectionNavigation(
    section: string,
    collectionIds: string[],
    menu: string[],
): NavGroup[] {
    const cached = process.env.NODE_ENV === "production" ? sectionCache.get(section) : undefined;

    if (cached) return cached;

    const groups: { value: NavGroup; order: number; position: number }[] = [];

    for (const collectionId of collectionIds.filter(SECTION_COLLECTIONS[section])) {
        const root = getCollectionTree(collectionId) as FolderNode;
        const category = getCategoryEntry(root);

        if (category?.metadata.hidden === true) continue;

        const [rootSection, ...sections] = buildNavigation(collectionId);
        let landing = rootSection.landing;
        let links = rootSection.links;

        // A collection's own page is the heading's page, not a row beside the
        // parts that it groups the other pages into. A group of one page is that
        // page, so its heading links to it and has nothing to open.
        const own = links.findIndex(
            (link) => link.path === `/${collectionId}` && link.children === undefined,
        );

        if (!landing && own !== -1 && (links.length > 1 || sections.length > 0)) {
            landing = links[own];
            links = links.filter((_, index) => index !== own);
        }

        if (!landing && sections.length === 0 && links.length === 1) {
            landing = links[0];
            links = [];
        }

        const first = landing ?? links[0] ?? sections[0]?.links[0];

        if (!first) continue;

        groups.push({
            value: {
                title: category?.metadata.title ?? rootSection.title,
                path: first.path,
                description: category?.metadata.description,
                picto: category?.metadata.picto,
                pictoDark: category?.metadata.pictoDark,
                landing,
                links,
                sections,
            },
            order: menuIndex(collectionId, menu),
            position: category?.metadata.position ?? 0,
        });
    }

    const result = groups
        .sort((a, b) => a.order - b.order || a.position - b.position)
        .map(({ value }) => value);

    if (process.env.NODE_ENV === "production") sectionCache.set(section, result);

    return result;
}

/**
 * Turns the sections of a sidebar into the groups of a section sidebar, so
 * that every row at the top is a group and no page stands alone.
 *
 * The first section holds the pages that open the product. Its first page is
 * the heading's page and the others are the group's rows. When that section is
 * a single page and another section follows, the page becomes the heading of
 * that section instead, so that a group is never only a heading. Every other
 * section is a group with its own landing page, where it has one.
 */
export function groupsFromSections(sections: NavSection[]): NavGroup[] {
    const toGroup = (section: NavSection, opening: boolean): NavGroup[] => {
        const landing = section.landing ?? (opening ? section.links[0] : undefined);
        const links = opening && !section.landing ? section.links.slice(1) : section.links;
        const target = landing ?? links[0];

        if (!target) return [];

        return [
            {
                title: section.title,
                path: target.path,
                description: section.description,
                picto: section.picto,
                pictoDark: section.pictoDark,
                landing,
                links,
                sections: [],
            },
        ];
    };

    const [first, second, ...rest] = sections;

    if (first && second && (first.landing ? 1 : 0) + first.links.length === 1) {
        const only = (first.landing ?? first.links[0]) as NavLink;
        const rows = [...(second.landing ? [second.landing] : []), ...second.links];

        return [
            {
                title: first.title,
                path: only.path,
                description: first.description,
                picto: first.picto,
                pictoDark: first.pictoDark,
                landing: only,
                links: rows,
                sections: [],
            },
            ...rest.flatMap((section) => toGroup(section, false)),
        ];
    }

    return [
        ...(first ? toGroup(first, true) : []),
        ...(second ? toGroup(second, false) : []),
        ...rest.flatMap((section) => toGroup(section, false)),
    ];
}

/** A card on a section hub page. */
export interface HubCard {
    title: string;
    /** The page the card links to, as the sidebar writes paths, without the `/docs` base. */
    path: string;
    description?: string;
    picto?: string;
    pictoDark?: string;
}

const normalized = (path: string) => path.replace(/\/$/, "") || "/";

/**
 * The cards a hub page shows for its groups, one for each group of the
 * sidebar. A group whose landing page is the hub itself, such as Learn inside
 * the Learn hub of Agent Memory, is the hub's own collection, so its parts
 * give the cards instead.
 */
export function hubCards(groups: NavGroup[], hubPath: string): HubCard[] {
    const own = normalized(hubPath);

    return groups.flatMap((group) => {
        const isHub = [group.path, group.landing?.path].some(
            (path) => path && normalized(path) === own,
        );

        if (isHub && group.sections.length > 0) {
            return group.sections.flatMap((section) => {
                const target = section.landing ?? section.links[0];

                return target
                    ? [
                          {
                              title: section.title,
                              path: target.path,
                              description: section.description,
                              picto: section.picto,
                              pictoDark: section.pictoDark,
                          },
                      ]
                    : [];
            });
        }

        return [
            {
                title: group.title,
                path: group.path,
                description: group.description,
                picto: group.picto,
                pictoDark: group.pictoDark,
            },
        ];
    });
}

/**
 * The cards a hub page shows for the pages of a section that is one flat list:
 * the rows of its groups, other than the hub itself.
 */
export function hubPages(groups: NavGroup[], hubPath: string): HubCard[] {
    const own = normalized(hubPath);

    return groups
        .flatMap((group) => [...(group.landing ? [group.landing] : []), ...group.links])
        .filter((link) => normalized(link.path) !== own)
        .map((link) => ({ title: link.title, path: link.path, description: link.description }));
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
        if (section.landing) result.push(section.landing);
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

/**
 * The address of a navigation path under the docs base. The docs root is
 * `/docs`, not `/docs/`, which redirects to it.
 */
export function docsHref(path: string): string {
    return path === "/" ? "/docs" : `/docs${path}`;
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

/**
 * Whether a node opts out of the navigation sidebar.
 *
 * A folder is hidden by `"hidden": true` on its `__category` entry, which takes
 * its whole subtree with it; a page by `hidden: true` in its own frontmatter.
 * Hidden content is still built and reachable by URL.
 */
function isHidden(node: TreeNode): boolean {
    if (isFolder(node)) {
        return getCategoryEntry(node)?.metadata.hidden === true;
    }
    return node.entry.metadata.hidden === true;
}

function getCategoryEntry(folder: FolderNode) {
    for (const child of folder.children) {
        if (child.name === "__category" && !isFolder(child)) {
            return child.entry;
        }
    }
    return undefined;
}

/**
 * Where a folder that has no page of its own should send a reader.
 *
 * Some folders are pure containers: `reference/javascript/concepts` holds pages
 * but is not one. The tree already answers this - `collectLinks` gives such a
 * folder its first child's href - so the URL answers it the same way, through
 * the same ordering, and the reader lands on the page the sidebar highlights.
 *
 * Returns undefined when the path names no folder, which is a real 404 rather
 * than something to guess at.
 */
export function resolveFolderLanding(
    id: string,
    path: string,
    baseUrl?: string,
): string | undefined {
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) return undefined;

    let node = getCollectionTree(id) as FolderNode;

    for (const segment of segments) {
        const next = node.children.find((child) => isFolder(child) && child.name === segment);

        if (!next || !isFolder(next)) return undefined;

        node = next;
    }

    return sortByPosition(collectLinks(node, baseUrl ?? id))[0]?.path;
}
