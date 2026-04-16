import { enum as _enum, number, type output, strictObject, string } from "zod";
import { SECTION_ICONS_NAMES } from "./icons";

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
