import {
    enum as _enum,
    boolean,
    literal,
    number,
    object,
    type output,
    strictObject,
    string,
} from "zod";
import { SECTION_ICONS_NAMES } from "./icons";
import { labCategories, labLanguages, labTopics } from "./labs";

/**
 * The schema for a page in a content collection.
 */
export const pageSchema = strictObject({
    title: string().optional(),
    description: string().optional(),
    position: number().optional(),
    /**
     * How early this page is offered a description in `llms.txt`.
     *
     * The index lists every page, but only spends descriptions until it hits
     * its size budget, so which pages carry one is a real editorial choice.
     * Ordering is by depth and then alphabetically by URL, which serves the
     * shallow pages well and then decides the rest by first letter - the
     * cutoff currently falls mid-alphabet at depth three, so
     * `/running/installation/linux` loses to pages that happen to start with
     * an earlier letter.
     *
     * A lower number is offered a description sooner; unset sorts after every
     * page that carries one. Setting it on a page shallow enough to be
     * described already changes nothing, so check the generated file before
     * adding one.
     *
     * | Value | Meaning | Rough cap |
     * | --- | --- | --- |
     * | `1` | A stranger's first hour **with one of our surfaces** | ~25 |
     * | `2` | Where a search for a named thing lands: statements, CLI commands, SDK methods | ~50 |
     * | `3` | Section landing pages that depth does not already reach | ~50 |
     *
     * "First hour" is per surface, not one funnel. A reader starting on
     * SurrealDB itself wants install, `surreal start` and `SELECT`; one
     * starting from Python wants the Python SDK; one evaluating GraphQL wants
     * the GraphQL overview. Each surface earns one entry point, not a path
     * through the whole product.
     *
     * Two rules that are easy to get wrong:
     *
     * - **A prioritised page needs a description of 70 characters or fewer.**
     *   Longer ones are truncated mid-sentence, and a promoted page that
     *   renders as `Use this tutorial to install SurrealDB on Linux or...` is
     *   a worse entry than the complete description it displaced.
     * - **This is zero-sum.** The budget is fixed, so every page promoted
     *   takes a description from another. Promote to change *which* pages are
     *   described, never expecting more of them.
     */
    priority: number().optional(),
    icon: _enum(SECTION_ICONS_NAMES).optional(),
    /**
     * Omit this page or folder from the navigation sidebar.
     *
     * The content is still built, routed, and reachable by URL - this only
     * removes the entry (and, on a `__category`, its whole subtree) from the
     * menu. Use it to park a section that is not ready to be advertised.
     */
    hidden: boolean().optional(),
});

export type PageSchema = output<typeof pageSchema>;

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
