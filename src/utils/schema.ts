import { enum as _enum, literal, number, object, type output, strictObject, string } from "zod";
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
    sidebar_label: string().optional(),
});

export type PageSchema = output<typeof pageSchema>;

export const labSchema = strictObject({
    title: string(),
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
