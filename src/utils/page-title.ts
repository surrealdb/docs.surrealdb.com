import { type CollectionMap, getCollection, getCollectionEntry } from "vike-content-collection";
import { COLLECTION_ROUTES } from "./collections";
import { type MetaTitleParts, metaTitleCandidates } from "./meta";
import { getProductFromPath, PRODUCT_META } from "./product";

/** One folder above a page that carries a `__category.json`, nearest the root first. */
export interface CategoryCrumb {
    name: string;
    /** The folder's path inside its collection, e.g. `api/values`. */
    path: string;
}

/**
 * The folders above a page that name themselves in a `__category.json`, from
 * the collection root down. A folder without one is skipped, as it is in the
 * breadcrumbs.
 */
export function categoryTrail(id: string, path: string): CategoryCrumb[] {
    const trail: CategoryCrumb[] = [];
    const parts: string[] = [];

    for (const part of path.split("/")) {
        parts.push(part);

        const folder = parts.filter(Boolean).join("/");
        const slug = [folder, "__category"].filter(Boolean).join("/");
        const entry = getCollectionEntry(id as keyof CollectionMap, slug);

        if (entry) {
            trail.push({ name: entry.metadata.title ?? part, path: folder });
        }
    }

    return trail;
}

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
    // produce nine pages called "Authentication | Concepts"; skipping them
    // lets the SDK-level crumb (or the collection name) qualify the title
    // instead.
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
    ["cli", "surreal CLI"],
    ["surqlfmt", "surqlfmt"],
]);

function isGeneric(title: string): boolean {
    return GENERIC_SECTION_TITLES.has(title.trim().toLowerCase());
}

function collectionRootTitle(id: string): string | undefined {
    return getCollectionEntry(id as keyof CollectionMap, "")?.metadata?.title;
}

/** Whether `title` already says `name`, so naming it again would only repeat it. */
function says(title: string, name: string): boolean {
    return title.toLowerCase().includes(name.trim().toLowerCase());
}

/**
 * Picks the section that best identifies where a page sits, for use in its
 * document title.
 *
 * The deepest meaningful breadcrumb that the title does not already contain
 * wins, so `ALTER ACCESS` is qualified by "Statements" rather than by "ALTER".
 * When every crumb is a generic tree label, the collection's own name is used
 * instead, so a page one level inside a collection is still qualified.
 */
function resolveSection(
    title: string,
    breadcrumbs: string[],
    collectionId: string,
): string | undefined {
    const meaningful = breadcrumbs.filter((crumb) => !isGeneric(crumb) && !says(title, crumb));

    if (meaningful.length) {
        return meaningful.at(-1);
    }

    // The root collection is not a section, it is where the sections start, so
    // there is nothing true to qualify its pages with.
    if (collectionId === "index") {
        return undefined;
    }

    // The collection's own landing page already carries the proper name
    // ("JavaScript SDK", "PHP SDK"), so prefer it to prettifying the
    // directory name, which would title-case "Javascript".
    const rootTitle = collectionRootTitle(collectionId);

    if (rootTitle && !isGeneric(rootTitle)) {
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

/** A collection root title that names an SDK, such as "JavaScript SDK". */
const SDK_NAME = /\bSDK$/;

/**
 * The SDK a page documents, for an SDK reference collection, or undefined.
 *
 * Every SDK reference tree holds the same page names - `Table`, `RecordId`,
 * `Errors` - so the SDK is what tells one from another, and it is the one
 * qualifier a title never drops. It is the title of the nearest landing page
 * that names an SDK, which is the collection root ("JavaScript SDK") or, in a
 * tree split by major version, the version's own landing page ("PHP SDK v2").
 */
function resolveSdk(id: string, path: string): string | undefined {
    if (!id.startsWith("reference/")) return undefined;

    const rootTitle = collectionRootTitle(id);

    if (!rootTitle || !SDK_NAME.test(rootTitle)) return undefined;

    const folders = path.split("/").filter(Boolean).slice(0, -1);

    // A version's landing page extends the SDK's name ("PHP SDK v2"). Other
    // landing pages inside the tree ("SDK methods") name a part of it.
    for (let depth = folders.length; depth > 0; depth--) {
        const landing = getCollectionEntry(
            id as keyof CollectionMap,
            folders.slice(0, depth).join("/"),
        )?.metadata?.title;

        if (landing?.startsWith(rootTitle)) return landing;
    }

    return rootTitle;
}

/**
 * The folder a page sits in, as its breadcrumbs name it, generic or not, for
 * telling apart two pages that every other part of a title leaves the same:
 * PHP SDK v2 has a "Data types" page under both "API Reference" and
 * "Concepts".
 */
function resolveDetail(id: string, path: string, title: string): string | undefined {
    const crumbs = categoryTrail(id, path).map((crumb) => crumb.name);
    const root = getCollectionEntry(id as keyof CollectionMap, "__category")?.metadata?.title;

    return [root, ...crumbs]
        .filter((crumb): crumb is string => !!crumb && !says(title, crumb))
        .at(-1);
}

/**
 * What the document title of the page at `path` in collection `id` is built
 * from: the page title, the SDK or section it sits in, and whether that
 * qualifier may be dropped to keep the title short.
 */
function titleParts(id: string, prefix: string, path: string): MetaTitleParts | undefined {
    const entry = getCollectionEntry(id as keyof CollectionMap, path);
    const title = entry?.metadata?.title;

    if (!title) return undefined;

    const detail = resolveDetail(id, path, title);
    const sdk = resolveSdk(id, path);

    if (sdk) {
        return { title, qualifier: sdk, required: true, detail };
    }

    const urlPath = `/${[prefix, path].filter(Boolean).join("/")}`;
    const productId = getProductFromPath(urlPath);

    // Agent Memory is a product of its own, and its section names ("Welcome",
    // "Integrations") say nothing about which product a page belongs to.
    if (productId !== "surrealdb") {
        return { title, qualifier: PRODUCT_META[productId].label, required: false, detail };
    }

    const section = resolveSection(
        title,
        categoryTrail(id, path).map((crumb) => crumb.name),
        id,
    );

    return { title, qualifier: section, required: false, detail };
}

interface TitleIndex {
    /** How many pages take each title on their own. */
    preferred: Map<string, number>;
    /** How many pages take each title with their qualifier kept. */
    full: Map<string, number>;
}

let titleIndex: TitleIndex | undefined;

function count(map: Map<string, number>, key: string) {
    map.set(key, (map.get(key) ?? 0) + 1);
}

/**
 * Counts the titles every page would take, once per server instance.
 *
 * Dropping a qualifier to keep a title short can leave two pages with one
 * title - "Search, vector, and geometry" exists in both Surqlize libraries -
 * and two pages can share a qualifier as well as a name. See `documentTitle`.
 */
function getTitleIndex(): TitleIndex {
    if (titleIndex) return titleIndex;

    const index: TitleIndex = { preferred: new Map(), full: new Map() };

    for (const { prefix, id } of COLLECTION_ROUTES) {
        for (const entry of getCollection(id as keyof CollectionMap)) {
            if (entry.slug.endsWith("__category")) continue;

            const parts = titleParts(id, prefix, entry.slug);

            if (!parts) continue;

            const { preferred, full } = metaTitleCandidates(parts);

            count(index.preferred, preferred);
            count(index.full, full);
        }
    }

    titleIndex = index;

    return titleIndex;
}

/**
 * The document title for the page at `path` in collection `id`, served under
 * `prefix`: `{page} | {SDK or section} | SurrealDB Docs`. See
 * `metaTitleCandidates` for the length rule.
 *
 * A title no other page takes is used as it is. One that another page also
 * takes keeps its qualifier, and one that is still shared adds the folder the
 * page sits in, so no two pages share a title.
 */
export function documentTitle(id: string, prefix: string, path: string): string | undefined {
    const parts = titleParts(id, prefix, path);

    if (!parts) return undefined;

    const { preferred, full, detailed } = metaTitleCandidates(parts);
    const index = getTitleIndex();

    if ((index.preferred.get(preferred) ?? 0) <= 1) return preferred;
    if ((index.full.get(full) ?? 0) <= 1) return full;

    return detailed;
}
