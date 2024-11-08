import fs from 'node:fs';
import path from 'node:path';
import {
    type CollectionEntry,
    type CollectionKey,
    type SchemaContext,
    getCollection,
    getEntry,
} from 'astro:content';
import type { SidebarItem } from '@components/Sidebar/SidebarItem.astro';
import { collections, urlForCollection } from '@src/content/config';
import { z } from 'astro/zod';

type Item = SidebarItem & {
    slug: string;
};

export async function generateSidebar(
    name: CollectionKey
): Promise<{ items: Item[]; flat: Item[] }> {
    // biome-ignore lint/suspicious/noExplicitAny: alternative is a cirular type definition which is not allowed
    const urls = {} as Record<string, any>;
    const collection = await getCollection(name);

    for (const item of collection) {
        let temp = urls;
        for (const key of item.slug.split('/')) {
            if (!(key in temp)) {
                temp[key] = {};
            }

            temp = temp[key];
        }
    }

    async function getItems(
        base: string,
        // biome-ignore lint/suspicious/noExplicitAny: alternative is a cirular type definition which is not allowed
        urls: Record<string, any>
    ): Promise<SidebarItem[]> {
        const items = await Promise.all(
            Object.entries(urls).map(async ([key, nested]) => {
                const isGroup = Object.keys(nested).length > 0;
                const slug = base ? `${base}/${key}` : key;
                const meta = await getMeta(name, slug, isGroup);

                let urlSlug: string = slug;
                if (meta.fileIsIndex) {
                    urlSlug = '';
                }

                const href = [
                    import.meta.env.BASE_URL,
                    urlForCollection[name],
                    urlSlug,
                ]
                    .filter((a) => !!a)
                    .join('/');

                return [
                    meta.sidebar_position,
                    {
                        title: getTitle(meta, slug),
                        isPage: meta.isPage,
                        href,
                        items: isGroup
                            ? await getItems(slug, nested)
                            : undefined,
                        slug,
                    } satisfies SidebarItem,
                ] as const;
            })
        );

        return items
            .sort(
                ([a], [b]) =>
                    (a ?? Number.POSITIVE_INFINITY) -
                    (b ?? Number.POSITIVE_INFINITY)
            )
            .map(([, item]) => item);
    }

    function flatten(items: SidebarItem[]): SidebarItem[] {
        return items.flatMap(({ items, ...item }) => {
            return [item, ...(items ? flatten(items) : [])];
        });
    }

    const items = await getItems('', urls);
    const flat = flatten(items);

    return {
        items,
        flat,
    };
}

export async function generateBreadcrumb(
    name: CollectionKey,
    slug: string
): Promise<{ items: { title: string; href?: string }[] }> {
    const parts = slug.split('/').filter((a) => a !== '');
    const slugs = parts.map((_, i) => parts.slice(0, i + 1).join('/'));
    const items = await Promise.all(
        slugs.map(async (slug) => {
            const meta = await getMeta(name, slug);
            const title = getTitle(meta, slug);
            const href = `${import.meta.env.BASE_URL}/${
                urlForCollection[name]
            }${meta.fileIsIndex ? '' : `/${slug}`}`;
            return meta.isPage ? { title, href } : { title };
        })
    );

    return { items };
}

export function titleFromSlug(slug: string): string {
    const tmp = (slug.split('/').at(-1) as string).split('-').join(' ');
    return tmp[0].toUpperCase() + tmp.slice(1);
}

// STUB!
// NOTE: Beware, for future maintenance, syncing is needed
// (or find a better solution, once APIs are more mature / exposed)
const astroSchemaContext: SchemaContext = {
    image: () => {
        return z.object({
            src: z.string(),
            width: z.number(),
            height: z.number(),
            format: z.union([
                z.literal('png'),
                z.literal('jpg'),
                z.literal('jpeg'),
                z.literal('tiff'),
                z.literal('webp'),
                z.literal('gif'),
                z.literal('svg'),
                z.literal('avif'),
            ]),
        });
    },
};

export async function getMeta<CK extends CollectionKey>(
    name: CK,
    slug: string,
    isGroup = false
): Promise<
    CollectionEntry<CK>['data'] & { isPage: boolean; fileIsIndex: boolean }
> {
    const item = await getEntry(name, slug);
    const fileIsIndex =
        item && item.slug === 'index' && item.id.startsWith('index');
    if (!isGroup) {
        if (item)
            return {
                ...item.data,
                isPage: true,
                fileIsIndex,
            };
    }

    try {
        const file = path.join(
            process.cwd(),
            'src/content',
            name,
            slug,
            '_category_.json'
        );

        const raw = fs.readFileSync(file).toString();
        const schema =
            typeof collections[name].schema === 'function'
                ? collections[name].schema(astroSchemaContext)
                : collections[name].schema;

        return {
            ...(schema?.parse(JSON.parse(raw)) ?? JSON.parse(raw)),
            isPage: !!item,
            fileIsIndex,
        };
    } catch {
        return {
            isPage: !!item,
            fileIsIndex,
        };
    }
}

export function getTitle(
    meta: CollectionEntry<CollectionKey>['data'],
    slug: string
): string {
    return meta.sidebar_label ?? meta.title ?? titleFromSlug(slug);
}
