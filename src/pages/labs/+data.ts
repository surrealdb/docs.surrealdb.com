import { getCollection } from "vike-content-collection";

export default function data() {
	const entries = getCollection("labs-items");

	const items = entries
		.map((entry) => ({
			slug: entry.slug,
			...entry.metadata,
		}))
		.sort((a, b) => a.title.localeCompare(b.title));

	return { items };
}

export type LabsPageData = ReturnType<typeof data>;
