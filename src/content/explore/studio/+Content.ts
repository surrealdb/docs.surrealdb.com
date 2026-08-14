import { defineCollection } from "vike-content-collection";
import { pageSchema } from "~/utils/schema";

export const Content = defineCollection({
    schema: pageSchema,
    type: "both",
});
