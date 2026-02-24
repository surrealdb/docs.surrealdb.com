import { enum as _enum, boolean, literal, number, object, strictObject, string } from "zod";

const abstractDoc = strictObject({
	title: string().optional(),
	description: string().optional(),
	sidebar_position: number().optional(),
	sidebar_label: string().optional(),
	no_page_headings: boolean().optional(),
	no_sidebar: boolean().optional(),
});

const labCollection = strictObject({
	title: string(),
	url: string().optional(),
	category: _enum([]),
	author: literal("surrealdb").or(
		object({
			name: string(),
			role: string(),
			avatar: string(),
		}),
	),
	topics: _enum([]).array().max(2),
	languages: _enum([]).array().optional(),
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

export const schema = {
	...docs.reduce<Docs>((prev, curr) => {
		prev[`doc-${curr}`] = abstractDoc;
		return prev;
	}, {} as Docs),
	...sdks.reduce<Sdks>((prev, curr) => {
		prev[`doc-sdk-${curr}`] = abstractDoc;
		return prev;
	}, {} as Sdks),
	// "labs-items": labCollection,
};

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
	"labs-items": "labs",
};

export type Doc = (typeof docs)[number];
export type DocKey = `doc-${Doc}`;
export type Docs = Record<DocKey, typeof abstractDoc>;

export type Sdk = (typeof sdks)[number];
export type SdkKey = `doc-sdk-${Sdk}`;
export type Sdks = Record<SdkKey, typeof abstractDoc>;

// export type LabItem = Entry<"labs-items">["data"];
