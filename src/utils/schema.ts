import { enum as _enum, literal, number, object, type output, strictObject, string } from "zod";
import { SECTION_ICONS_NAMES } from "./icons";
import { labCategories, labLanguages, labTopics } from "./labs";
import { PRODUCT_ORDER } from "./product";

/**
 * How a collection's content behaves in search ranking.
 *
 * Docs search cannot rank on text relevance alone. The ten SDK
 * collections document the same method surface ten times with terse
 * titles ("Table", "Select", "Upsert") that exact-match short queries,
 * so a query for "table" matches every SDK copy before it matches
 * `DEFINE TABLE`. Search needs to know what *kind* of content a page is
 * to weigh those against each other, and that is editorial knowledge
 * about the docs — so it is declared in the content tree rather than
 * inferred from URLs (which broke when the SDK docs moved in #1856).
 *
 * The weight attached to each kind is search policy and lives in
 * `search/src/ranking.ts`.
 */
export const SEARCH_KINDS = [
    /** Docs entry point: what SurrealDB is, installing, running. */
    "start",
    /** Conceptual guides that teach a topic. */
    "guide",
    /** Canonical product reference: SurrealQL, the CLI, the HTTP API. */
    "reference",
    /** Per-language client library reference. Duplicated across languages. */
    "sdk",
    /** Deploying, hosting, and operating SurrealDB. */
    "operations",
    /** Companion tools and tutorials. */
    "tool",
    /** A separate product with its own docs tree. */
    "product",
] as const;

export type SearchKind = (typeof SEARCH_KINDS)[number];

/**
 * Search metadata, read from a collection's root `__category.json`.
 * Ignored on individual pages and on nested categories.
 */
const searchSchema = strictObject({
    /**
     * Display name for the collection, used as the leading breadcrumb crumb
     * and indexed as searchable text. Needed because most collections' root
     * `__category.json` is titled "Overview" — that labels the collection's
     * landing section in the sidebar, not the collection itself.
     */
    label: string(),
    kind: _enum(SEARCH_KINDS),
    /** Product this collection belongs to. Defaults to the first product. */
    product: _enum(PRODUCT_ORDER as readonly [string, ...string[]]).optional(),
});

/**
 * The schema for a page in a content collection.
 *
 * Also validates `__category.json` files, which the content-collection
 * plugin loads as entries (see `getCategoryEntry` in ./navigation.ts).
 */
export const pageSchema = strictObject({
    title: string().optional(),
    description: string().optional(),
    position: number().optional(),
    icon: _enum(SECTION_ICONS_NAMES).optional(),
    search: searchSchema.optional(),
});

export type PageSchema = output<typeof pageSchema>;
export type SearchMetadata = output<typeof searchSchema>;

export const labSchema = strictObject({
    title: string(),
    description: string().optional(),
    url: string().optional(),
    category: _enum(labCategories),
    author: literal("surrealdb").or(
        object({
            name: string(),
            role: string(),
            avatar: string(),
        }),
    ),
    topics: _enum(labTopics).array().max(2).default([]),
    languages: _enum(labLanguages).array().optional(),
});

export type LabSchema = output<typeof labSchema>;
