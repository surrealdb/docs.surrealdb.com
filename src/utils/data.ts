import { redirect, render } from "vike/abort";
import type { PageContext } from "vike/types";
import { type CollectionMap, getCollection, getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { type DocHeading, resolveMarkdown } from "./markdown";
import { BASE_URL, type BreadcrumbItem, getSuffixedMetaTitle } from "./meta";
import { buildNavigation, type NavSection, resolveFolderLanding } from "./navigation";
import { getProductFromPath } from "./product";

export interface PageData {
    content: string;
    headings: DocHeading[];
    navigation: NavSection[];
    contentPath: string;
    breadcrumbs: string[];
    /** Ancestor trail for BreadcrumbList JSON-LD: Docs, categories, then the page. */
    breadcrumbItems: BreadcrumbItem[];
    title: string;
    description: string;
}

/** Base the docs are served from - `base` in `vite.config.ts`. */
const DOCS_BASE = "/docs";

/** One path segment up (e.g. `/a/b` → `/a`). */
/**
 * Category titles that name a position in a tree rather than a subject. They are
 * accurate in a sidebar, where the surrounding tree supplies the context, but
 * useless in a document title.
 */
const GENERIC_SECTION_TITLES = new Set([
    "overview",
    "index",
    "introduction",
    "getting started",
    // The structural folders every SDK tree repeats. Left in a title they
    // produce nine pages called "Authentication | Concepts | Database";
    // skipping them lets the SDK-level crumb (or the collection name)
    // qualify the title instead.
    "concepts",
    "methods",
    "api",
    "core",
    "data types",
    "engines",
    "frameworks",
    "libraries",
    "advanced topics",
]);

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

    // The collection's own landing page already carries the proper name
    // ("JavaScript SDK", "PHP SDK"), so prefer it to prettifying the
    // directory name, which would title-case "Javascript".
    const rootTitle = getCollectionEntry(collectionId as keyof CollectionMap, "")?.metadata?.title;

    if (rootTitle && !GENERIC_SECTION_TITLES.has(rootTitle.trim().toLowerCase())) {
        return rootTitle;
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
        // A folder with no page of its own still names something real, so it
        // sends the reader to its first child - the same page the sidebar
        // points at. Anything else 404s.
        //
        // This used to be a 302 one path segment up, applied to every miss.
        // That meant a stale link landed on a section index that said nothing
        // about what had been asked for, and a crawler recorded a redirect
        // rather than a gap. Both hid the breakage: twelve unreachable
        // tutorials went unnoticed for seven weeks, because each one answered
        // 302 and resolved to a page that returned 200. A page that has really
        // moved belongs in `redirects.ts`, where the destination is stated
        // rather than guessed at.
        const landing = resolveFolderLanding(id, path, prefix);

        if (landing) {
            throw redirect(`${DOCS_BASE}${landing}` as `/${string}`, 301);
        }

        throw render(404, "Not Found");
    }

    const productId = getProductFromPath(context.urlPathname);
    const description = "description" in entry.metadata ? entry.metadata?.description : undefined;

    const curPath: string[] = [];
    const breadcrumbs: string[] = [];
    const prefixSegments = prefix.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [{ name: "Docs", item: BASE_URL }];

    for (const part of path.split("/")) {
        curPath.push(part);

        const slug = [...curPath, `__category`].filter(Boolean).join("/");
        const entry = getCollectionEntry(id, slug);

        if (entry) {
            const name = entry.metadata.title ?? part;

            breadcrumbs.push(name);
            breadcrumbItems.push({
                name,
                item: `${BASE_URL}/${[...prefixSegments, ...curPath].join("/")}`,
            });
        }
    }

    const title = entry.metadata.title
        ? getSuffixedMetaTitle(entry.metadata.title, productId, resolveSection(breadcrumbs, id))
        : undefined;

    // A page sitting directly in a collection root has no ancestor folder, so
    // the walk above finds nothing and the page loses its eyebrow. Fall back to
    // the collection's own category, which is what the index page shows.
    if (!breadcrumbs.length) {
        const root = getCollectionEntry(id, "__category");

        if (root?.metadata.title) {
            breadcrumbs.push(root.metadata.title);

            if (prefixSegments.length) {
                breadcrumbItems.push({
                    name: root.metadata.title,
                    item: `${BASE_URL}/${prefixSegments.join("/")}`,
                });
            }
        }
    }

    // The page itself closes the trail. The final element may omit `item`.
    if (entry.metadata.title) {
        breadcrumbItems.push({ name: entry.metadata.title });
    }

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
        breadcrumbItems,
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
