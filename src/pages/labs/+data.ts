import { getCollection, sortCollection } from "vike-content-collection";

export default function data() {
    const entries = sortCollection(
        sortCollection(getCollection("labs-items"), "title", "asc"),
        "date",
        "desc",
    );

    const items = entries.map((entry) => ({
        slug: entry.slug,
        ...entry.metadata,
    }));

    return { items };
}

export type LabsPageData = ReturnType<typeof data>;
