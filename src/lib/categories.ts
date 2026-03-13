export type CategoryMeta = {
	sidebar_label: string;
	sidebar_position: number;
};

const categoryModules = import.meta.glob("../content/**/_category_.json", {
	import: "default",
	eager: true,
}) as Record<string, CategoryMeta>;

const categoryIndex = new Map<string, Map<string, CategoryMeta>>();

for (const [filePath, data] of Object.entries(categoryModules)) {
	const m = filePath.match(/\/content\/([^/]+)\/(.+)\/_category_\.json$/);
	if (!m) continue;

	const collection = m[1];
	const dirPath = m[2];

	if (!categoryIndex.has(collection)) {
		categoryIndex.set(collection, new Map());
	}

	const collectionCategories = categoryIndex.get(collection);
	collectionCategories?.set(dirPath, data);
}

export function getCategories(collection: string): Map<string, CategoryMeta> {
	return categoryIndex.get(collection) ?? new Map();
}
