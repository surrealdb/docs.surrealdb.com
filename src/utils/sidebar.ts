import type { TypedCollectionEntry } from "vike-content-collection";

export type SidebarItem = {
    label: string;
    href: string;
    children?: SidebarItem[];
};

export function getSidebarItemsFromCollection(
    _collection: string,
    _baseUrlOverride?: string,
): SidebarItem[] {
    // const entries = getCollection(collection);
    // const categories = getCategories(collection);
    // const baseUrl =
    //     baseUrlOverride ?? `/docs/${urlForCollection[collection as keyof typeof urlForCollection]}`;

    // return wrapRootLeafItems(buildLevel(entries, categories, baseUrl, ""));
    return [];
}

function _buildLevel(
    entries: TypedCollectionEntry<Record<string, unknown>>[],
    categories: Map<string, unknown>,
    baseUrl: string,
    prefix: string,
): SidebarItem[] {
    const items: { item: SidebarItem; position: number }[] = [];

    const groupPaths = new Set<string>();
    for (const [catPath] of categories) {
        if (prefix) {
            if (!catPath.startsWith(`${prefix}/`)) continue;
            const relative = catPath.slice(prefix.length + 1);
            if (!relative.includes("/")) groupPaths.add(catPath);
        } else {
            if (!catPath.includes("/")) groupPaths.add(catPath);
        }
    }

    for (const entry of entries) {
        const { slug } = entry;

        if (prefix) {
            if (!slug.startsWith(`${prefix}/`)) continue;
            const relative = slug.slice(prefix.length + 1);
            if (relative.includes("/")) continue;
        } else {
            if (slug.includes("/")) continue;
        }

        if (groupPaths.has(slug)) continue;

        const href = slug === "" ? baseUrl : `${baseUrl}/${slug}`;
        const meta = entry.metadata as Record<string, string | number | undefined>;

        items.push({
            item: {
                label: (meta.sidebar_label ?? meta.title ?? slug) as string,
                href,
            },
            position: (meta.sidebar_position as number) ?? 0,
        });
    }

    for (const groupPath of groupPaths) {
        const meta = categories.get(groupPath);
        if (!meta) continue;

        const groupEntry = entries.find((e) => e.slug === groupPath);
        const children = _buildLevel(entries, categories, baseUrl, groupPath);

        if (groupEntry && !prefix) {
            children.unshift({
                label: "Introduction",
                href: `${baseUrl}/${groupPath}`,
            });
        }

        // items.push({
        //     item: {
        //         label: meta.sidebar_label ?? groupPath,
        //         href: groupEntry ? `${baseUrl}/${groupPath}` : (children[0]?.href ?? baseUrl),
        //         children: children.length > 0 ? children : undefined,
        //     },
        //     position: meta.sidebar_position ?? 0,
        // });
    }

    items.sort((a, b) => a.position - b.position);

    return items.map(({ item }) => item);
}

function _wrapRootLeafItems(items: SidebarItem[]): SidebarItem[] {
    const leaves: SidebarItem[] = [];
    const sections: SidebarItem[] = [];

    for (const item of items) {
        if (item.children?.length) {
            sections.push(item);
        } else {
            leaves.push(item);
        }
    }

    if (leaves.length === 0) return items;

    return [
        {
            label: "Overview",
            href: leaves[0].href,
            children: leaves,
        },
        ...sections,
    ];
}

function appendSlash(href: string) {
    return href.endsWith("/") ? href : `${href}/`;
}

function stripDocsPrefix(href: string) {
    return href.replace("/docs/", "/");
}

export function flattenSidebar(items: SidebarItem[]): SidebarItem[] {
    const result: SidebarItem[] = [];

    for (const item of items) {
        const firstChildHref = item.children?.[0]?.href;
        if (!item.children?.length || item.href !== firstChildHref) {
            result.push(item);
        }
        if (item.children?.length) {
            result.push(...flattenSidebar(item.children));
        }
    }

    return result;
}

export function findBreadcrumbTrail(
    items: SidebarItem[],
    urlPathname: string,
): SidebarItem[] | null {
    const normalized = appendSlash(urlPathname);

    for (const item of items) {
        if (appendSlash(stripDocsPrefix(item.href)) === normalized) {
            return [item];
        }

        if (item.children?.length) {
            const trail = findBreadcrumbTrail(item.children, urlPathname);
            if (trail) {
                return [item, ...trail];
            }
        }
    }

    return null;
}

export function findCurrentPageIndex(pages: SidebarItem[], urlPathname: string): number {
    const normalized = appendSlash(urlPathname);
    return pages.findIndex((item) => appendSlash(stripDocsPrefix(item.href)) === normalized);
}
