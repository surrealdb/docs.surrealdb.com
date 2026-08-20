import { redirect, render } from "vike/abort";
import type { PageContext } from "vike/types";
import { type CollectionMap, getCollection, getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { type DocHeading, resolveMarkdown } from "./markdown";
import { getSuffixedMetaTitle } from "./meta";
import { buildNavigation, type NavSection } from "./navigation";
import { getProductFromPath } from "./product";

export interface PageData {
    content: string;
    headings: DocHeading[];
    navigation: NavSection[];
    contentPath: string;
    breadcrumbs: string[];
    title: string;
    description: string;
}

/** Base the docs are served from — `base` in `vite.config.ts`. */
const DOCS_BASE = "/docs";

/** One path segment up (e.g. `/a/b` → `/a`). */
/**
 * Category titles that name a position in a tree rather than a subject. They are
 * accurate in a sidebar, where the surrounding tree supplies the context, but
 * useless in a document title.
 */
const GENERIC_SECTION_TITLES = new Set(["overview", "index", "introduction", "getting started"]);

/**
 * Collection segments whose casing is part of the name. Executables are written
 * as they are typed, so title-casing them would be wrong.
 */
const LITERAL_SECTION_NAMES = new Map([
    ["surrealctl", "surrealctl"],
    ["surrealdb-cli", "surreal"],
    ["surqlfmt", "surqlfmt"],
]);

/**
 * Picks the section that best identifies where a page sits, for use in its
 * document title.
 *
 * The deepest meaningful breadcrumb wins. When every crumb is a generic tree
 * label, the collection's own name is used instead, so a page one level inside a
 * collection is still qualified.
 */
function resolveSection(breadcrumbs: string[], collectionId: string): string | undefined {
    const meaningful = breadcrumbs.filter(
        (crumb) => !GENERIC_SECTION_TITLES.has(crumb.trim().toLowerCase()),
    );

    if (meaningful.length) {
        return meaningful.at(-1);
    }

    const segment = collectionId.split("/").at(-1);

    if (!segment) return undefined;

    return (
        LITERAL_SECTION_NAMES.get(segment) ??
        segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
}

export function getParentPathname(pathname: string): string | null {
    const pathOnly = pathname.includes("://") ? new URL(pathname).pathname : pathname;
    const trimmed = pathOnly.replace(/\/+$/, "");

    if (trimmed === "" || trimmed === "/") {
        return null;
    }

    const i = trimmed.lastIndexOf("/");

    if (i <= 0) {
        return "/";
    }

    return trimmed.slice(0, i) || "/";
}

/**
 * One path segment up, as a browser URL.
 *
 * `getParentPathname` walks Vike's `urlPathname`, which has the base
 * stripped. A `Location` header needs the base back on, or walking up from
 * a missing page lands outside the docs entirely (`/docs/agent-memory/typo`
 * would redirect to `/agent-memory`, which no route serves).
 */
export function getParentUrl(pathname: string): string | null {
    const parent = getParentPathname(pathname);

    return parent === null ? null : `${DOCS_BASE}${parent}`;
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
        const parent = getParentUrl(context.urlPathname);

        if (parent) {
            throw redirect(parent, 302);
        }

        throw render(404, "Not Found");
    }

    const productId = getProductFromPath(context.urlPathname);
    const description = "description" in entry.metadata ? entry.metadata?.description : undefined;

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

    const title = entry.metadata.title
        ? getSuffixedMetaTitle(entry.metadata.title, productId, resolveSection(breadcrumbs, id))
        : undefined;

    config({
        title,
        description,
    });

    const navigation = buildNavigation(id, prefix);
    const { content, headings } = resolveMarkdown(entry.content);
    const contentPath = entry.filePath.replace(/.*\/content\//, "");

    return {
        content,
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
 * never enqueue paths such as `/agent-memory/__category`.
 */
export function prerenderCollectionUrls<K extends keyof CollectionMap>(
    collectionId: K,
    pathnameBase: string,
): string[] {
    return getCollection(collectionId)
        .filter((entry) => !entry.slug.includes("__category"))
        .map((entry) => (entry.slug === "" ? pathnameBase : `${pathnameBase}/${entry.slug}`));
}
