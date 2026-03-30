import { defineCollection } from "vike-content-collection";
import { pageSchema } from "~/utils/collection";

export const Content = defineCollection({
    schema: pageSchema,
    type: "both",
});
