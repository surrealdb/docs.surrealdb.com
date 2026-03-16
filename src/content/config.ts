import { enum as _enum, boolean, literal, number, object, strictObject, string } from "zod";

export function contentSlug({ filePath }: { filePath: string }): string {
    const match = filePath.match(/\/content\/[^/]+\/(.+)\.\w+$/);
    if (!match) return "index";
    let slug = match[1];
    if (slug.endsWith("/index")) slug = slug.slice(0, -6);
    return slug;
}

export const abstractDoc = strictObject({
    title: string().optional(),
    description: string().optional(),
    sidebar_position: number().optional(),
    sidebar_label: string().optional(),
    no_page_headings: boolean().optional(),
    no_sidebar: boolean().optional(),
});

export const labCategories = [
    "Code repositories",
    "Videos",
    "Blogposts",
    "Documentation",
    "Learning Resources",
] as const;

export const labTopics = [
    "AI",
    "Cloud",
    "Data Management",
    "Examples",
    "Libraries",
    "Security",
    "Templates",
    "Tooling",
] as const;

export const labLanguages = [
    "Python",
    "Rust",
    "TypeScript",
    "Go",
    "Java",
    "PHP",
    "SurrealQL",
] as const;

export const labCollection = strictObject({
    title: string(),
    url: string().optional(),
    category: _enum(labCategories),
    author: literal("surrealdb").or(
        object({
            name: string(),
            role: string(),
            avatar: string(),
        }),
    ),
    topics: _enum(labTopics).array().max(2).default([]),
    languages: _enum(labLanguages).array().optional(),
});

///////////////////////////////////////////////////////////
//                                                       //
//           !!!!!  READ VERY CAREFULLY  !!!!!           //
// When adding a new doc, you MUST update redirect logic //
// In: project://aws/viewer-request/index.js#4           //
//                                                       //
///////////////////////////////////////////////////////////

export const docs = [
    "surrealdb",
    "cloud",
    "surrealist",
    "surrealml",
    "surrealkv",
    "surrealql",
    "integrations",
    "tutorials",
] as const;

export const sdks = ["dotnet", "golang", "java", "javascript", "php", "python", "rust"] as const;

export const urlForCollection = {
    ...docs.reduce<Record<DocKey, Doc>>(
        (prev, curr) => {
            prev[`doc-${curr}`] = curr;
            return prev;
        },
        {} as Record<DocKey, Doc>,
    ),
    ...sdks.reduce<Record<SdkKey, string>>(
        (prev, curr) => {
            prev[`doc-sdk-${curr}`] = `sdk/${curr}`;
            return prev;
        },
        {} as Record<SdkKey, string>,
    ),
    "doc-sdk-java-1x": "1.x/sdk/java",
    "doc-sdk-javascript-1x": "1.x/sdk/javascript",
    "doc-sdk-python-1x": "1.x/sdk/python",
    "labs-items": "labs",
};

export type Doc = (typeof docs)[number];
export type DocKey = `doc-${Doc}`;
export type Docs = Record<DocKey, typeof abstractDoc>;

export type Sdk = (typeof sdks)[number];
export type SdkKey = `doc-sdk-${Sdk}`;
export type Sdks = Record<SdkKey, typeof abstractDoc>;

export type LabCategory = (typeof labCategories)[number];
export type LabTopic = (typeof labTopics)[number];
export type LabLanguage = (typeof labLanguages)[number];
