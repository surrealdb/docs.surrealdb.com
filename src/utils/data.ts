import { redirect, render } from "vike/abort";
import type { PageContext } from "vike/types";
import { type CollectionMap, getCollection, getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { COLLECTION_ROUTES } from "./collections";
import { lastModifiedFor } from "./last-modified";
import { type DocHeading, resolveMarkdown } from "./markdown";
import { BASE_URL, type BreadcrumbItem, metaDescription } from "./meta";
import {
    buildNavigation,
    buildSectionNavigation,
    groupsFromSections,
    type NavGroup,
    type NavSection,
    resolveFolderLanding,
    SECTION_HUBS,
    sectionOf,
    sectionOfHub,
    soloCollectionOf,
} from "./navigation";
import { categoryTrail, documentTitle } from "./page-title";
import { getRelated, type RelatedItem } from "./related";
import { sectionHubNavigation, sectionMenuPaths, withoutSectionHubs } from "./section-hubs";

export interface PageData {
    content: string;
    headings: DocHeading[];
    navigation: NavSection[];
    /**
     * The sidebar of the whole section the page belongs to, one group for each
     * of its collections. Absent where a collection is a section of its own.
     */
    sectionNavigation?: NavGroup[];
    contentPath: string;
    breadcrumbs: string[];
    /** Ancestor trail for BreadcrumbList JSON-LD: Docs, categories, then the page. */
    breadcrumbItems: BreadcrumbItem[];
    title: string;
    description: string;
    /** When the page's source last changed, as an ISO 8601 date, if known. */
    lastModified?: string;
    /** University lessons and blog posts on the same subject, if any. */
    related: RelatedItem[];
}

/** Base the docs are served from - `base` in `vite.config.ts`. */
const DOCS_BASE = "/docs";

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
    // Escaped by hand rather than with `RegExp.escape`, which needs Node 24
    // and breaks `bun run dev` on the Node 22 the repo otherwise supports.
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const path = prefix
        ? context.urlPathname.replace(new RegExp(`/${escapedPrefix}/?`), "")
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

    const description = "description" in entry.metadata ? entry.metadata?.description : undefined;

    const breadcrumbs: string[] = [];
    const prefixSegments = prefix.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbItem[] = [{ name: "Docs", item: BASE_URL }];

    for (const crumb of categoryTrail(id, path)) {
        breadcrumbs.push(crumb.name);
        breadcrumbItems.push({
            name: crumb.name,
            item: `${BASE_URL}/${[...prefixSegments, crumb.path].filter(Boolean).join("/")}`,
        });
    }

    const title = documentTitle(id, prefix, path);

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
        description: description ? metaDescription(description) : undefined,
    });

    // The hubs that sit in a product's root collection show the parts of their
    // section, and the Get started sidebar leaves out the hubs the top bar
    // already lists. A hub that is a collection's own landing page keeps that
    // collection's sidebar.
    const isRootCollection = id === "index" || id === "agent-memory/index";
    const navigation = isRootCollection
        ? (sectionHubNavigation(context.urlPathname) ??
          withoutSectionHubs(buildNavigation(id, prefix)))
        : buildNavigation(id, prefix);
    // A hub page of a section with several collections shows the same tree as
    // the pages of the section, with every group closed.
    const section = isRootCollection ? sectionOfHub(context.urlPathname) : sectionOf(id);
    let sectionNavigation = section
        ? buildSectionNavigation(
              section,
              COLLECTION_ROUTES.map((route) => route.id),
              sectionMenuPaths(SECTION_HUBS[section]),
          )
        : undefined;

    // The Get started sidebar of a product is a list of sections, which the
    // sidebar shows as groups in the same way. So is the sidebar of a section
    // that is a single collection, and of its hub page.
    const solo = section ? undefined : soloCollectionOf(id, context.urlPathname);

    if (solo || (isRootCollection && !section && !sectionHubNavigation(context.urlPathname))) {
        sectionNavigation = groupsFromSections(solo ? buildNavigation(solo) : navigation);
    }
    const { content, headings } = resolveMarkdown(entry.content);
    const contentPath = entry.filePath.replace(/.*\/content\//, "");

    return {
        content,
        headings,
        navigation,
        sectionNavigation,
        contentPath,
        breadcrumbs,
        breadcrumbItems,
        title: entry.metadata.title ?? "",
        description: description ?? "",
        lastModified: lastModifiedFor(context.urlPathname),
        related: getRelated(
            [DOCS_BASE, ...prefixSegments, ...path.split("/")].filter(Boolean).join("/"),
        ),
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
