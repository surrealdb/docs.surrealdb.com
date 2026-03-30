import { render } from "vike/abort";
import type { PageContext } from "vike/types";
import { type CollectionMap, getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { resolveMarkdown } from "./markdown";
import { getSuffixedMetaTitle } from "./meta";
import { getSidebarItemsFromCollection } from "./sidebar";

/**
 * Build the data for a page in a content collection.
 */
export function resolveDataFromCollection<K extends keyof CollectionMap>(
    context: PageContext,
    id: K,
) {
    // biome-ignore lint/correctness/useHookAtTopLevel: <ignore>
    const config = useConfig();

    const regex = new RegExp(`/${RegExp.escape(id)}/?`);
    const path = context.urlPathname.replace(regex, "");
    const entry = getCollectionEntry(id, path);

    if (!entry) {
        throw render(404, "Not Found");
    }

    config({
        title: entry.metadata.title ? getSuffixedMetaTitle(entry.metadata.title) : undefined,
        description: entry.metadata.description ?? undefined,
    });

    const { ast, headings } = resolveMarkdown(entry.content);
    const sidebar = getSidebarItemsFromCollection(id);
    const contentPath = entry.filePath.replace(/.*\/content\//, "");

    return {
        ast,
        headings,
        sidebar,
        contentPath,
    };
}
