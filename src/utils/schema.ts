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
    icon: _enum(SECTION_ICONS_NAMES).optional(),
    /**
     * Omit this page or folder from the navigation sidebar.
     *
     * The content is still built, routed, and reachable by URL — this only
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
