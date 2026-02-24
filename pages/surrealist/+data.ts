import { getEntry } from "@lib/content";
import { getCollectionPartsFromURL } from "@util/collection";
import { resolveMarkdown } from "@util/markdown";
import { getSidebarItemsFromCollection } from "@util/sidebar";
import { render } from "vike/abort";
import type { PageContext } from "vike/types";
import { useConfig } from "vike-react/useConfig";

export default async function data(context: PageContext) {
    // biome-ignore lint/correctness/useHookAtTopLevel: <ignore>
    const config = useConfig();
    const id = "doc-surrealist" as const;

    const parts = getCollectionPartsFromURL(context.urlPathname, 2);
    const entry = getEntry(id, parts.join("/"));

    if (!entry) {
        throw render(404, "Not Found");
    }

    if (entry.data.title) {
        config({ title: entry.data.title });
    }

    if (entry.data.description) {
        config({ description: entry.data.description });
    }

    const { ast, headings } = resolveMarkdown(entry.body);
    const sidebar = getSidebarItemsFromCollection(id);
    const contentPath = entry.filePath.replace(/^\.\.\/content\//, "");

    return {
        entry,
        ast,
        headings,
        sidebar,
        contentPath,
    };
}

export type SurrealistPageData = Awaited<ReturnType<typeof data>>;
