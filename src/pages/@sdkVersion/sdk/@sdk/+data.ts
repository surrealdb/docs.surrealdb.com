import { render } from "vike/abort";
import type { PageContext } from "vike/types";
import { getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { getCollectionIdForVersion, getVersionUrl, type Sdk } from "~/content/config";
import { getCollectionPartsFromURL } from "~/utils/collection";
import { resolveMarkdown } from "~/utils/markdown";
import { getSidebarItemsFromCollection } from "~/utils/sidebar";

export default async function data(context: PageContext) {
    // biome-ignore lint/correctness/useHookAtTopLevel: <ignore>
    const config = useConfig();
    const sdk = context.routeParams.sdk as Sdk;
    const version = context.routeParams.sdkVersion;
    const id = getCollectionIdForVersion(sdk, version);

    const parts = getCollectionPartsFromURL(context.urlPathname, 4);
    const entry = getCollectionEntry(id, parts.join("/"));

    if (!entry) {
        throw render(404, "Not Found");
    }

    if (entry.metadata.title) {
        config({ title: entry.metadata.title });
    }

    if (entry.metadata.description) {
        config({ description: entry.metadata.description });
    }

    const { ast, headings } = resolveMarkdown(entry.content);
    const sidebarBaseUrl = getVersionUrl(sdk, version);
    const sidebar = getSidebarItemsFromCollection(id, sidebarBaseUrl);
    const contentPath = entry.filePath.replace(/.*\/content\//, "");

    return {
        ast,
        headings,
        sidebar,
        contentPath,
        sdk,
        sdkVersion: version,
    };
}

export type VersionedSDKPageData = Awaited<ReturnType<typeof data>>;
