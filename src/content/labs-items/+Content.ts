import { defineCollection } from "vike-content-collection";
import { labSchema } from "~/utils/schema";

export const Content = defineCollection({
    schema: labSchema,
    type: "content",
});
