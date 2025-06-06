import { defineCollection, type CollectionEntry } from 'astro:content';
import { z } from 'astro/zod';

const abstractDoc = defineCollection({
    type: 'content',
    schema: () =>
        z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            sidebar_position: z.number().optional(),
            sidebar_label: z.string().optional(),
            no_page_headings: z.boolean().optional(),
            no_sidebar: z.boolean().optional(),
        }),
});

const labCollection = defineCollection({
    type: 'content',
    schema: () =>
        z.object({
            title: z.string(),
            url: z.string().optional(),
            category: z.enum([
				"CI/CD",
				"Demos",
				"Deployment Tools",
				"Development Tools",
				"Docker Images",
				"Integrations",
				"Libraries",
				"SDKs",
				"Templates",
				"Tutorials",
				"Videos",
			]),
            author: z.literal('surrealdb').or(
                z.object({
                    name: z.string(),
                    role: z.string(),
                    avatar: z.string(),
                })
            ),
            topics: z.enum([
				"AI",
				"Data Management",
				"Embedding",
				"Security",
				"Examples",
				"Optimisation",
				"Beginner",
			]).array().max(2),
        }),
});

///////////////////////////////////////////////////////////
//                                                       //
//           !!!!!  READ VERY CAREFULLY  !!!!!           //
// When adding a new doc, you MUST update redirect logic //
// In: project://aws/viewer-request/index.js#4           //
//                                                       //
///////////////////////////////////////////////////////////

export const docs = [
    'surrealdb',
    'cloud',
    'surrealist',
    'surrealml',
    'surrealkv',
    'surrealql',
    'integrations',
    'tutorials',
] as const;

export const sdks = [
    'dotnet',
    'golang',
    'java',
    'javascript',
    'php',
    'python',
    'rust',
] as const;

export const collections = {
    ...docs.reduce<Docs>((prev, curr) => {
        prev[`doc-${curr}`] = abstractDoc;
        return prev;
    }, {} as Docs),
    ...sdks.reduce<Sdks>((prev, curr) => {
        prev[`doc-sdk-${curr}`] = abstractDoc;
        return prev;
    }, {} as Sdks),
    'labs-items': labCollection,
};

export const urlForCollection = {
    ...docs.reduce<Record<DocKey, Doc>>(
        (prev, curr) => {
            prev[`doc-${curr}`] = curr;
            return prev;
        },
        {} as Record<DocKey, Doc>
    ),
    ...sdks.reduce<Record<SdkKey, string>>(
        (prev, curr) => {
            prev[`doc-sdk-${curr}`] = `sdk/${curr}`;
            return prev;
        },
        {} as Record<SdkKey, string>
    ),
};

export type Doc = (typeof docs)[number];
export type DocKey = `doc-${Doc}`;
export type Docs = Record<DocKey, typeof abstractDoc>;

export type Sdk = (typeof sdks)[number];
export type SdkKey = `doc-sdk-${Sdk}`;
export type Sdks = Record<SdkKey, typeof abstractDoc>;

export type LabItem = CollectionEntry<'labs-items'>['data'];
