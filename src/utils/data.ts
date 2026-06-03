import type { Heading, Root } from "@surrealdb/ui";
import { render } from "vike/abort";
import type { PageContext } from "vike/types";
import { type CollectionMap, getCollection, getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { resolveMarkdown } from "./markdown";
import { getSuffixedMetaTitle } from "./meta";
import { buildNavigation, type NavSection } from "./navigation";
import { getProductFromPath } from "./product";

export interface PageData {
    ast: Root;
    headings: Heading[];
    navigation: NavSection[];
    contentPath: string;
    breadcrumbs: string[];
    title: string;
    description: string;
}

/**
 * Build the data for a page in a content collection.
 *
 * @param urlPrefix - URL prefix to strip from the pathname before
 *   looking up the entry. Defaults to the collection ID. Pass an
 *   empty string when the collection is served from the root.
 */
export function resolveDataFromCollection<K extends keyof CollectionMap>(
    context: PageContext,
    id: K,
    urlPrefix?: string,
): PageData {
    // biome-ignore lint/correctness/useHookAtTopLevel: <ignore>
    const config = useConfig();

    const prefix = urlPrefix ?? id;
    const path = prefix
        ? context.urlPathname.replace(new RegExp(`/${RegExp.escape(prefix)}/?`), "")
        : context.urlPathname.replace(/^\//, "");
    const entry = getCollectionEntry(id, path);

    if (!entry) {
        throw render(404, "Not Found");
    }

    const productId = getProductFromPath(context.urlPathname);
    const title = entry.metadata.title
        ? getSuffixedMetaTitle(entry.metadata.title, productId)
        : undefined;
    const description = "description" in entry.metadata ? entry.metadata?.description : undefined;

    config({
        title,
        description,
    });

    const navigation = buildNavigation(id, prefix);
    const { ast, headings } = resolveMarkdown(entry.content);
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
        navigation,
        contentPath,
        breadcrumbs,
        title: entry.metadata.title ?? "",
        description: description ?? "",
    };
}

/**
 * URLs for static prerendering. Omits category-only slug segments so crawlers
 * never enqueue paths such as `/spectron/__category`.
 */
export function prerenderCollectionUrls<K extends keyof CollectionMap>(
    collectionId: K,
    pathnameBase: string,
): string[] {
    return getCollection(collectionId)
        .filter((entry) => !entry.slug.includes("__category"))
        .map((entry) => (entry.slug === "" ? pathnameBase : `${pathnameBase}/${entry.slug}`));
}
