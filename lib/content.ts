// lib/content.ts
import { schema } from "@content/config";
import matter from "gray-matter";
import type { ZodObject, z } from "zod";

const collections = Object.keys(schema) as CollectionName[];

export type CategoryMeta = {
    sidebar_label: string;
    sidebar_position: number;
};

export type CollectionsSchema = Record<string, ZodObject>;
export type CollectionName = keyof typeof schema;
export type CollectionSchema<T extends CollectionName = CollectionName> = (typeof schema)[T];

export type Entry<T extends CollectionName = CollectionName> = {
    collection: T;
    slug: string; // Title-based slug for blogs, filename for authors
    filePath: string; // "/content/blogs/2026-01-14.md" or "/content/authors/dave.md"
    data: z.output<CollectionSchema<T>>; // frontmatter
    body: string; // markdown content (no frontmatter)
};

// Load markdown as raw strings at build time.
// Works for SSR + SPA (bundled by Vite).
const modules = import.meta.glob(["../content/**/*.md", "../content/**/*.mdx"], {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

function parsePath(filePath: string): { collection: CollectionName; fileSlug: string } | null {
    const m = filePath.match(/\/content\/([^/]+)\/(.+)\.mdx?$/);
    if (!m) return null;
    const collection = m[1] as CollectionName;
    const fileSlug = m[2];
    if (!collections.includes(collection)) return null;
    return { collection, fileSlug };
}

const index = Object.fromEntries(collections.map((name) => [name, {}])) as {
    [T in CollectionName]: Record<string, Entry<T>>;
};

const collectionFilePaths: Map<CollectionName, string[]> = new Map();

function persist<T extends CollectionName>(
    collection: T,
    slug: string,
    entry: Omit<Entry<T>, "collection" | "slug">,
) {
    (index[collection] as Record<string, Entry<T>>)[slug] = {
        collection,
        slug,
        ...entry,
    };

    const routes = collectionFilePaths.get(collection) ?? [];
    routes.push(slug);

    collectionFilePaths.set(collection, routes);
}

// Build an in-memory index once.
for (const [filePath, raw] of Object.entries(modules)) {
    try {
        const parsed = parsePath(filePath);
        if (!parsed) continue;

        let { collection, fileSlug } = parsed;
        const { data, content } = matter(raw);

        if (fileSlug.includes("/index")) {
            fileSlug = fileSlug.replace("/index", "");
        }

        persist(collection, fileSlug, {
            filePath,
            data: schema[collection].parse(data),
            body: content,
        });
    } catch (error) {
        throw new Error(`Failed to process content file: ${filePath}\nFailure: ${error}`);
    }
}

export function getEntries<T extends CollectionName>(collection: T): Entry<T>[] {
    return Object.values(index[collection]) as Entry<T>[];
}

export function getEntry<T extends CollectionName>(collection: T, slug: string): Entry<T> | null {
    return index[collection][slug] ?? null;
}

export function getCollectionFilePaths(collection: CollectionName): string[] {
    return collectionFilePaths.get(collection) ?? [];
}

const categoryModules = import.meta.glob("../content/**/_category_.json", {
    import: "default",
    eager: true,
}) as Record<string, CategoryMeta>;

const categoryIndex = new Map<CollectionName, Map<string, CategoryMeta>>();

for (const [filePath, data] of Object.entries(categoryModules)) {
    const m = filePath.match(/\/content\/([^/]+)\/(.+)\/_category_\.json$/);
    if (!m) continue;

    const collection = m[1] as CollectionName;
    const dirPath = m[2];

    if (!collections.includes(collection)) continue;

    if (!categoryIndex.has(collection)) {
        categoryIndex.set(collection, new Map());
    }

    const collectionCategories = categoryIndex.get(collection);
    collectionCategories?.set(dirPath, data);
}

export function getCategories(collection: CollectionName): Map<string, CategoryMeta> {
    return categoryIndex.get(collection) ?? new Map();
}
