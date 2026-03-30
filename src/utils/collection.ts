import { number, strictObject, string } from "zod";

/**
 * The schema for a page in a content collection.
 */
export const pageSchema = strictObject({
    title: string().optional(),
    description: string().optional(),
    position: number().optional(),
    icon: string().optional(),
});
