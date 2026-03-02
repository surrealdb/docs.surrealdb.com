import { getEntries } from "@lib/content";

export default function data() {
    const entries = getEntries("labs-items");

    const items = entries
        .map((entry) => ({
            slug: entry.slug,
            ...entry.data,
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

    return { items };
}

export type LabsPageData = ReturnType<typeof data>;
