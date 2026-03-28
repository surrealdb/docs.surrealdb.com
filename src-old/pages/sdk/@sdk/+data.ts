import { render } from "vike/abort";
import type { PageContext } from "vike/types";
import { getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import type { Sdk } from "~/content/config";
import { getCollectionPartsFromURL } from "~/utils/collection";
import { resolveMarkdown } from "~/utils/markdown";
import { getSuffixedMetaTitle } from "~/utils/meta";
import { getSidebarItemsFromCollection } from "~/utils/sidebar";

export default async function data(context: PageContext) {
    // biome-ignore lint/correctness/useHookAtTopLevel: <ignore>
    const config = useConfig();
    const sdk = context.routeParams.sdk as Sdk;
    const id = `doc-sdk-${sdk}` as const;

    const parts = getCollectionPartsFromURL(context.urlPathname);
    const entry = getCollectionEntry(id, parts.join("/"));

    if (!entry) {
        throw render(404, "Not Found");
    }

    if (entry.metadata.title) {
        config({ title: getSuffixedMetaTitle(entry.metadata.title) });
    }

    if (entry.metadata.description) {
        config({ description: entry.metadata.description });
    }

    const { ast, headings } = resolveMarkdown(entry.content);
    const sidebar = getSidebarItemsFromCollection(id);
    const contentPath = entry.filePath.replace(/.*\/content\//, "");

    return {
        ast,
        headings,
        sidebar,
        contentPath,
        sdk,
        sdkVersion: "latest" as const,
    };
}

export type SDKPageData = Awaited<ReturnType<typeof data>>;
