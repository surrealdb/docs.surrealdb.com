export type CategoryMeta = {
    sidebar_label: string;
    sidebar_position: number;
};

let categoryIndex: Map<string, Map<string, CategoryMeta>> | undefined;

function loadCategoryIndex(): Map<string, Map<string, CategoryMeta>> {
    const categoryModules = import.meta.glob("../content/**/_category_.json", {
        import: "default",
        eager: true,
    }) as Record<string, CategoryMeta>;

    const index = new Map<string, Map<string, CategoryMeta>>();

    for (const [filePath, data] of Object.entries(categoryModules)) {
        const m = filePath.match(/\/content\/([^/]+)\/(.+)\/_category_\.json$/);
        if (!m) continue;

        const collection = m[1];
        const dirPath = m[2];

        if (!index.has(collection)) {
            index.set(collection, new Map());
        }

        index.get(collection)?.set(dirPath, data);
    }

    return index;
}

export function getCategories(collection: string): Map<string, CategoryMeta> {
    categoryIndex ??= loadCategoryIndex();
    return categoryIndex.get(collection) ?? new Map();
}
