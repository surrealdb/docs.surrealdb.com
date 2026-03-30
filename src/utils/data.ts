import type { Heading, Root } from "@surrealdb/ui";
import { render } from "vike/abort";
import type { PageContext } from "vike/types";
import { type CollectionMap, getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { resolveMarkdown } from "./markdown";
import { getSuffixedMetaTitle } from "./meta";
import { getSidebarItemsFromCollection, type SidebarItem } from "./sidebar";

export interface PageData {
    ast: Root;
    headings: Heading[];
    sidebar: SidebarItem[];
    contentPath: string;
    breadcrumbs: string[];
    title: string;
    description: string;
}

/**
 * Build the data for a page in a content collection.
 */
export function resolveDataFromCollection<K extends keyof CollectionMap>(
    context: PageContext,
    id: K,
): PageData {
    // biome-ignore lint/correctness/useHookAtTopLevel: <ignore>
    const config = useConfig();

    const regex = new RegExp(`/${RegExp.escape(id)}/?`);
    const path = context.urlPathname.replace(regex, "");
    const entry = getCollectionEntry(id, path);

    if (!entry) {
        throw render(404, "Not Found");
    }

    const title = entry.metadata.title ? getSuffixedMetaTitle(entry.metadata.title) : undefined;
    const description = entry.metadata.description ?? undefined;

    config({
        title,
        description,
    });

    const { ast, headings } = resolveMarkdown(entry.content);
    const sidebar = getSidebarItemsFromCollection(id);
    const contentPath = entry.filePath.replace(/.*\/content\//, "");

    const curPath: string[] = [];
    const breadcrumbs: string[] = [];

    for (const part of path.split("/")) {
        curPath.push(part);

        const slug = [...curPath, `__category`].filter(Boolean).join("/");
        const entry = getCollectionEntry(id, slug);

        if (entry) {
            breadcrumbs.push(entry.metadata.title ?? part);
        }
    }

    return {
        ast,
        headings,
        sidebar,
        contentPath,
        breadcrumbs,
        title: entry.metadata.title ?? "",
        description: entry.metadata.description ?? "",
    };
}
