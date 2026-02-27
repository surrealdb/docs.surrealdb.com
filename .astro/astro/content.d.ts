declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"doc-cloud": {
"architecture.mdx": {
	id: "architecture.mdx";
  slug: "architecture";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"billing-and-support/billing.mdx": {
	id: "billing-and-support/billing.mdx";
  slug: "billing-and-support/billing";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"billing-and-support/index.mdx": {
	id: "billing-and-support/index.mdx";
  slug: "billing-and-support";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"billing-and-support/support.mdx": {
	id: "billing-and-support/support.mdx";
  slug: "billing-and-support/support";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"connect/cli.mdx": {
	id: "connect/cli.mdx";
  slug: "connect/cli";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"connect/http.mdx": {
	id: "connect/http.mdx";
  slug: "connect/http";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"connect/index.mdx": {
	id: "connect/index.mdx";
  slug: "connect";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"connect/sdk.mdx": {
	id: "connect/sdk.mdx";
  slug: "connect/sdk";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"connect/surrealist.mdx": {
	id: "connect/surrealist.mdx";
  slug: "connect/surrealist";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"faqs/index.mdx": {
	id: "faqs/index.mdx";
  slug: "faqs";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"getting-started/create-an-account.mdx": {
	id: "getting-started/create-an-account.mdx";
  slug: "getting-started/create-an-account";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"getting-started/create-an-instance.mdx": {
	id: "getting-started/create-an-instance.mdx";
  slug: "getting-started/create-an-instance";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"getting-started/create-an-organisation.mdx": {
	id: "getting-started/create-an-organisation.mdx";
  slug: "getting-started/create-an-organisation";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"getting-started/index.mdx": {
	id: "getting-started/index.mdx";
  slug: "getting-started";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"operate-and-manage/data-export-and-backup.mdx": {
	id: "operate-and-manage/data-export-and-backup.mdx";
  slug: "operate-and-manage/data-export-and-backup";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"operate-and-manage/index.mdx": {
	id: "operate-and-manage/index.mdx";
  slug: "operate-and-manage";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"operate-and-manage/migrating-data.mdx": {
	id: "operate-and-manage/migrating-data.mdx";
  slug: "operate-and-manage/migrating-data";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"operate-and-manage/monitoring/index.mdx": {
	id: "operate-and-manage/monitoring/index.mdx";
  slug: "operate-and-manage/monitoring";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"operate-and-manage/monitoring/logs.mdx": {
	id: "operate-and-manage/monitoring/logs.mdx";
  slug: "operate-and-manage/monitoring/logs";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"operate-and-manage/monitoring/metrics.mdx": {
	id: "operate-and-manage/monitoring/metrics.mdx";
  slug: "operate-and-manage/monitoring/metrics";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"operate-and-manage/network-access.mdx": {
	id: "operate-and-manage/network-access.mdx";
  slug: "operate-and-manage/network-access";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"referrals/index.mdx": {
	id: "referrals/index.mdx";
  slug: "referrals";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"tooling/index.mdx": {
	id: "tooling/index.mdx";
  slug: "tooling";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"tooling/search-and-shortcuts.mdx": {
	id: "tooling/search-and-shortcuts.mdx";
  slug: "tooling/search-and-shortcuts";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
"tooling/surrealql-editors.mdx": {
	id: "tooling/surrealql-editors.mdx";
  slug: "tooling/surrealql-editors";
  body: string;
  collection: "doc-cloud";
  data: InferEntrySchema<"doc-cloud">
} & { render(): Render[".mdx"] };
};
"doc-integrations": {
"Embeddings/fastembed.mdx": {
	id: "Embeddings/fastembed.mdx";
  slug: "embeddings/fastembed";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Embeddings/index.mdx": {
	id: "Embeddings/index.mdx";
  slug: "embeddings";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Embeddings/mistral.mdx": {
	id: "Embeddings/mistral.mdx";
  slug: "embeddings/mistral";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Embeddings/openai.mdx": {
	id: "Embeddings/openai.mdx";
  slug: "embeddings/openai";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Embeddings/python.mdx": {
	id: "Embeddings/python.mdx";
  slug: "embeddings/python";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Embeddings/rust.mdx": {
	id: "Embeddings/rust.mdx";
  slug: "embeddings/rust";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/agno.mdx": {
	id: "Frameworks/agno.mdx";
  slug: "frameworks/agno";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/camel.mdx": {
	id: "Frameworks/camel.mdx";
  slug: "frameworks/camel";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/crewai.mdx": {
	id: "Frameworks/crewai.mdx";
  slug: "frameworks/crewai";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/dagster.mdx": {
	id: "Frameworks/dagster.mdx";
  slug: "frameworks/dagster";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/deepeval.mdx": {
	id: "Frameworks/deepeval.mdx";
  slug: "frameworks/deepeval";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/dynamiq.mdx": {
	id: "Frameworks/dynamiq.mdx";
  slug: "frameworks/dynamiq";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/feast.mdx": {
	id: "Frameworks/feast.mdx";
  slug: "frameworks/feast";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/googleagent.mdx": {
	id: "Frameworks/googleagent.mdx";
  slug: "frameworks/googleagent";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/index.mdx": {
	id: "Frameworks/index.mdx";
  slug: "frameworks";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/langchain.mdx": {
	id: "Frameworks/langchain.mdx";
  slug: "frameworks/langchain";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/llama-index.mdx": {
	id: "Frameworks/llama-index.mdx";
  slug: "frameworks/llama-index";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/pydantic-ai.mdx": {
	id: "Frameworks/pydantic-ai.mdx";
  slug: "frameworks/pydantic-ai";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"Frameworks/smolagents.mdx": {
	id: "Frameworks/smolagents.mdx";
  slug: "frameworks/smolagents";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"agent-rules/index.mdx": {
	id: "agent-rules/index.mdx";
  slug: "agent-rules";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"data-management/airbyte.mdx": {
	id: "data-management/airbyte.mdx";
  slug: "data-management/airbyte";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"data-management/fivetran.mdx": {
	id: "data-management/fivetran.mdx";
  slug: "data-management/fivetran";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"data-management/index.mdx": {
	id: "data-management/index.mdx";
  slug: "data-management";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"data-management/n8n.mdx": {
	id: "data-management/n8n.mdx";
  slug: "data-management/n8n";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-integrations";
  data: InferEntrySchema<"doc-integrations">
} & { render(): Render[".mdx"] };
};
"doc-sdk-dotnet": {
"core/authentication.mdx": {
	id: "core/authentication.mdx";
  slug: "core/authentication";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/connection-strings.mdx": {
	id: "core/connection-strings.mdx";
  slug: "core/connection-strings";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/create-a-new-connection.mdx": {
	id: "core/create-a-new-connection.mdx";
  slug: "core/create-a-new-connection";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/data-manipulation.mdx": {
	id: "core/data-manipulation.mdx";
  slug: "core/data-manipulation";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/dependency-injection.mdx": {
	id: "core/dependency-injection.mdx";
  slug: "core/dependency-injection";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/index.mdx": {
	id: "core/index.mdx";
  slug: "core";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/parameters.mdx": {
	id: "core/parameters.mdx";
  slug: "core/parameters";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/streaming.mdx": {
	id: "core/streaming.mdx";
  slug: "core/streaming";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"core/writing-surrealql.mdx": {
	id: "core/writing-surrealql.mdx";
  slug: "core/writing-surrealql";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"data-types.mdx": {
	id: "data-types.mdx";
  slug: "data-types";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"embedding.mdx": {
	id: "embedding.mdx";
  slug: "embedding";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"installation.mdx": {
	id: "installation.mdx";
  slug: "installation";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/authenticate.mdx": {
	id: "methods/authenticate.mdx";
  slug: "methods/authenticate";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/connect.mdx": {
	id: "methods/connect.mdx";
  slug: "methods/connect";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/create.mdx": {
	id: "methods/create.mdx";
  slug: "methods/create";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/delete.mdx": {
	id: "methods/delete.mdx";
  slug: "methods/delete";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/export.mdx": {
	id: "methods/export.mdx";
  slug: "methods/export";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/health.mdx": {
	id: "methods/health.mdx";
  slug: "methods/health";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/import.mdx": {
	id: "methods/import.mdx";
  slug: "methods/import";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/index.mdx": {
	id: "methods/index.mdx";
  slug: "methods";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/info.mdx": {
	id: "methods/info.mdx";
  slug: "methods/info";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/insert-relation.mdx": {
	id: "methods/insert-relation.mdx";
  slug: "methods/insert-relation";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/insert.mdx": {
	id: "methods/insert.mdx";
  slug: "methods/insert";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/invalidate.mdx": {
	id: "methods/invalidate.mdx";
  slug: "methods/invalidate";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/kill.mdx": {
	id: "methods/kill.mdx";
  slug: "methods/kill";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/listen_live.mdx": {
	id: "methods/listen_live.mdx";
  slug: "methods/listen_live";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/live-query.mdx": {
	id: "methods/live-query.mdx";
  slug: "methods/live-query";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/live-raw-query.mdx": {
	id: "methods/live-raw-query.mdx";
  slug: "methods/live-raw-query";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/live-table.mdx": {
	id: "methods/live-table.mdx";
  slug: "methods/live-table";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/merge.mdx": {
	id: "methods/merge.mdx";
  slug: "methods/merge";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/patch.mdx": {
	id: "methods/patch.mdx";
  slug: "methods/patch";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/query.mdx": {
	id: "methods/query.mdx";
  slug: "methods/query";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/raw-query.mdx": {
	id: "methods/raw-query.mdx";
  slug: "methods/raw-query";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/relate.mdx": {
	id: "methods/relate.mdx";
  slug: "methods/relate";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/run.mdx": {
	id: "methods/run.mdx";
  slug: "methods/run";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/select.mdx": {
	id: "methods/select.mdx";
  slug: "methods/select";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/set.mdx": {
	id: "methods/set.mdx";
  slug: "methods/set";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/signin.mdx": {
	id: "methods/signin.mdx";
  slug: "methods/signin";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/signup.mdx": {
	id: "methods/signup.mdx";
  slug: "methods/signup";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/unset.mdx": {
	id: "methods/unset.mdx";
  slug: "methods/unset";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/update.mdx": {
	id: "methods/update.mdx";
  slug: "methods/update";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/upsert.mdx": {
	id: "methods/upsert.mdx";
  slug: "methods/upsert";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/use.mdx": {
	id: "methods/use.mdx";
  slug: "methods/use";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"methods/version.mdx": {
	id: "methods/version.mdx";
  slug: "methods/version";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
"start.mdx": {
	id: "start.mdx";
  slug: "start";
  body: string;
  collection: "doc-sdk-dotnet";
  data: InferEntrySchema<"doc-sdk-dotnet">
} & { render(): Render[".mdx"] };
};
"doc-sdk-golang": {
"connection-engines.mdx": {
	id: "connection-engines.mdx";
  slug: "connection-engines";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"core/handling-authentication.mdx": {
	id: "core/handling-authentication.mdx";
  slug: "core/handling-authentication";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"core/index.mdx": {
	id: "core/index.mdx";
  slug: "core";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"data-types.mdx": {
	id: "data-types.mdx";
  slug: "data-types";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"installation.mdx": {
	id: "installation.mdx";
  slug: "installation";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/authenticate.mdx": {
	id: "methods/authenticate.mdx";
  slug: "methods/authenticate";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/create.mdx": {
	id: "methods/create.mdx";
  slug: "methods/create";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/delete.mdx": {
	id: "methods/delete.mdx";
  slug: "methods/delete";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/index.mdx": {
	id: "methods/index.mdx";
  slug: "methods";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/info.mdx": {
	id: "methods/info.mdx";
  slug: "methods/info";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/insert-relation.mdx": {
	id: "methods/insert-relation.mdx";
  slug: "methods/insert-relation";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/insert.mdx": {
	id: "methods/insert.mdx";
  slug: "methods/insert";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/invalidate.mdx": {
	id: "methods/invalidate.mdx";
  slug: "methods/invalidate";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/kill.mdx": {
	id: "methods/kill.mdx";
  slug: "methods/kill";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/let.mdx": {
	id: "methods/let.mdx";
  slug: "methods/let";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/live-notification.mdx": {
	id: "methods/live-notification.mdx";
  slug: "methods/live-notification";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/live.mdx": {
	id: "methods/live.mdx";
  slug: "methods/live";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/merge.mdx": {
	id: "methods/merge.mdx";
  slug: "methods/merge";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/new.mdx": {
	id: "methods/new.mdx";
  slug: "methods/new";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/patch.mdx": {
	id: "methods/patch.mdx";
  slug: "methods/patch";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/query.mdx": {
	id: "methods/query.mdx";
  slug: "methods/query";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/raw-query.mdx": {
	id: "methods/raw-query.mdx";
  slug: "methods/raw-query";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/relate.mdx": {
	id: "methods/relate.mdx";
  slug: "methods/relate";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/select.mdx": {
	id: "methods/select.mdx";
  slug: "methods/select";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/signin.mdx": {
	id: "methods/signin.mdx";
  slug: "methods/signin";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/signup.mdx": {
	id: "methods/signup.mdx";
  slug: "methods/signup";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/unset.mdx": {
	id: "methods/unset.mdx";
  slug: "methods/unset";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/update.mdx": {
	id: "methods/update.mdx";
  slug: "methods/update";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/upsert.mdx": {
	id: "methods/upsert.mdx";
  slug: "methods/upsert";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/use.mdx": {
	id: "methods/use.mdx";
  slug: "methods/use";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"methods/version.mdx": {
	id: "methods/version.mdx";
  slug: "methods/version";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
"start.mdx": {
	id: "start.mdx";
  slug: "start";
  body: string;
  collection: "doc-sdk-golang";
  data: InferEntrySchema<"doc-sdk-golang">
} & { render(): Render[".mdx"] };
};
"doc-sdk-java": {
"api-documentation.mdx": {
	id: "api-documentation.mdx";
  slug: "api-documentation";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
"core/create-a-new-connection.mdx": {
	id: "core/create-a-new-connection.mdx";
  slug: "core/create-a-new-connection";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
"core/handling-authentication.mdx": {
	id: "core/handling-authentication.mdx";
  slug: "core/handling-authentication";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
"core/index.mdx": {
	id: "core/index.mdx";
  slug: "core";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
"data-types.mdx": {
	id: "data-types.mdx";
  slug: "data-types";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
"installation.mdx": {
	id: "installation.mdx";
  slug: "installation";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
"start.mdx": {
	id: "start.mdx";
  slug: "start";
  body: string;
  collection: "doc-sdk-java";
  data: InferEntrySchema<"doc-sdk-java">
} & { render(): Render[".mdx"] };
};
"doc-sdk-javascript": {
"api/core/surreal-api.mdx": {
	id: "api/core/surreal-api.mdx";
  slug: "api/core/surreal-api";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/core/surreal-queryable.mdx": {
	id: "api/core/surreal-queryable.mdx";
  slug: "api/core/surreal-queryable";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/core/surreal-session.mdx": {
	id: "api/core/surreal-session.mdx";
  slug: "api/core/surreal-session";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/core/surreal-transaction.mdx": {
	id: "api/core/surreal-transaction.mdx";
  slug: "api/core/surreal-transaction";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/core/surreal.mdx": {
	id: "api/core/surreal.mdx";
  slug: "api/core/surreal";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/errors/index.mdx": {
	id: "api/errors/index.mdx";
  slug: "api/errors";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/api-promise.mdx": {
	id: "api/queries/api-promise.mdx";
  slug: "api/queries/api-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/create-promise.mdx": {
	id: "api/queries/create-promise.mdx";
  slug: "api/queries/create-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/delete-promise.mdx": {
	id: "api/queries/delete-promise.mdx";
  slug: "api/queries/delete-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/insert-promise.mdx": {
	id: "api/queries/insert-promise.mdx";
  slug: "api/queries/insert-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/live-promise.mdx": {
	id: "api/queries/live-promise.mdx";
  slug: "api/queries/live-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/query.mdx": {
	id: "api/queries/query.mdx";
  slug: "api/queries/query";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/relate-promise.mdx": {
	id: "api/queries/relate-promise.mdx";
  slug: "api/queries/relate-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/run-promise.mdx": {
	id: "api/queries/run-promise.mdx";
  slug: "api/queries/run-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/select-promise.mdx": {
	id: "api/queries/select-promise.mdx";
  slug: "api/queries/select-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/update-promise.mdx": {
	id: "api/queries/update-promise.mdx";
  slug: "api/queries/update-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/queries/upsert-promise.mdx": {
	id: "api/queries/upsert-promise.mdx";
  slug: "api/queries/upsert-promise";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/types/index.mdx": {
	id: "api/types/index.mdx";
  slug: "api/types";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/utilities/bound-query.mdx": {
	id: "api/utilities/bound-query.mdx";
  slug: "api/utilities/bound-query";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/utilities/equals.mdx": {
	id: "api/utilities/equals.mdx";
  slug: "api/utilities/equals";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/utilities/escape.mdx": {
	id: "api/utilities/escape.mdx";
  slug: "api/utilities/escape";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/utilities/expr.mdx": {
	id: "api/utilities/expr.mdx";
  slug: "api/utilities/expr";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/utilities/surql.mdx": {
	id: "api/utilities/surql.mdx";
  slug: "api/utilities/surql";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/datetime.mdx": {
	id: "api/values/datetime.mdx";
  slug: "api/values/datetime";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/decimal.mdx": {
	id: "api/values/decimal.mdx";
  slug: "api/values/decimal";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/duration.mdx": {
	id: "api/values/duration.mdx";
  slug: "api/values/duration";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/file-ref.mdx": {
	id: "api/values/file-ref.mdx";
  slug: "api/values/file-ref";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/geometry.mdx": {
	id: "api/values/geometry.mdx";
  slug: "api/values/geometry";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/index.mdx": {
	id: "api/values/index.mdx";
  slug: "api/values";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/range.mdx": {
	id: "api/values/range.mdx";
  slug: "api/values/range";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/record-id.mdx": {
	id: "api/values/record-id.mdx";
  slug: "api/values/record-id";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/table.mdx": {
	id: "api/values/table.mdx";
  slug: "api/values/table";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"api/values/uuid.mdx": {
	id: "api/values/uuid.mdx";
  slug: "api/values/uuid";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/authentication.mdx": {
	id: "concepts/authentication.mdx";
  slug: "concepts/authentication";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/bound-queries.mdx": {
	id: "concepts/bound-queries.mdx";
  slug: "concepts/bound-queries";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/connecting-to-surrealdb.mdx": {
	id: "concepts/connecting-to-surrealdb.mdx";
  slug: "concepts/connecting-to-surrealdb";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/diagnostics.mdx": {
	id: "concepts/diagnostics.mdx";
  slug: "concepts/diagnostics";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/error-handling.mdx": {
	id: "concepts/error-handling.mdx";
  slug: "concepts/error-handling";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/executing-queries.mdx": {
	id: "concepts/executing-queries.mdx";
  slug: "concepts/executing-queries";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/invoking-apis.mdx": {
	id: "concepts/invoking-apis.mdx";
  slug: "concepts/invoking-apis";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/live-queries.mdx": {
	id: "concepts/live-queries.mdx";
  slug: "concepts/live-queries";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/multiple-sessions.mdx": {
	id: "concepts/multiple-sessions.mdx";
  slug: "concepts/multiple-sessions";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/nodejs.mdx": {
	id: "concepts/nodejs.mdx";
  slug: "concepts/nodejs";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/transactions.mdx": {
	id: "concepts/transactions.mdx";
  slug: "concepts/transactions";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/utilities.mdx": {
	id: "concepts/utilities.mdx";
  slug: "concepts/utilities";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/value-types.mdx": {
	id: "concepts/value-types.mdx";
  slug: "concepts/value-types";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"concepts/web-assembly.mdx": {
	id: "concepts/web-assembly.mdx";
  slug: "concepts/web-assembly";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"engines/node.mdx": {
	id: "engines/node.mdx";
  slug: "engines/node";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"engines/wasm.mdx": {
	id: "engines/wasm.mdx";
  slug: "engines/wasm";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"frameworks/react.mdx": {
	id: "frameworks/react.mdx";
  slug: "frameworks/react";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"frameworks/solidjs.mdx": {
	id: "frameworks/solidjs.mdx";
  slug: "frameworks/solidjs";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"frameworks/vuejs.mdx": {
	id: "frameworks/vuejs.mdx";
  slug: "frameworks/vuejs";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"installation.mdx": {
	id: "installation.mdx";
  slug: "installation";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
"start.mdx": {
	id: "start.mdx";
  slug: "start";
  body: string;
  collection: "doc-sdk-javascript";
  data: InferEntrySchema<"doc-sdk-javascript">
} & { render(): Render[".mdx"] };
};
"doc-sdk-javascript-1x": {
"core/create-a-new-connection.mdx": {
	id: "core/create-a-new-connection.mdx";
  slug: "core/create-a-new-connection";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"core/data-maniplulation.mdx": {
	id: "core/data-maniplulation.mdx";
  slug: "core/data-maniplulation";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"core/handling-authentication.mdx": {
	id: "core/handling-authentication.mdx";
  slug: "core/handling-authentication";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"core/index.mdx": {
	id: "core/index.mdx";
  slug: "core";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"core/parameters.mdx": {
	id: "core/parameters.mdx";
  slug: "core/parameters";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"core/streaming.mdx": {
	id: "core/streaming.mdx";
  slug: "core/streaming";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"core/utilities.mdx": {
	id: "core/utilities.mdx";
  slug: "core/utilities";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"core/writing-surrealql.mdx": {
	id: "core/writing-surrealql.mdx";
  slug: "core/writing-surrealql";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"data-types.mdx": {
	id: "data-types.mdx";
  slug: "data-types";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"embedding.mdx": {
	id: "embedding.mdx";
  slug: "embedding";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"engines/index.mdx": {
	id: "engines/index.mdx";
  slug: "engines";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"engines/node.mdx": {
	id: "engines/node.mdx";
  slug: "engines/node";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"engines/wasm.mdx": {
	id: "engines/wasm.mdx";
  slug: "engines/wasm";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"frameworks/index.mdx": {
	id: "frameworks/index.mdx";
  slug: "frameworks";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"frameworks/react.mdx": {
	id: "frameworks/react.mdx";
  slug: "frameworks/react";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"frameworks/solidjs.mdx": {
	id: "frameworks/solidjs.mdx";
  slug: "frameworks/solidjs";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"installation.mdx": {
	id: "installation.mdx";
  slug: "installation";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/authenticate.mdx": {
	id: "methods/authenticate.mdx";
  slug: "methods/authenticate";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/close.mdx": {
	id: "methods/close.mdx";
  slug: "methods/close";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/connect.mdx": {
	id: "methods/connect.mdx";
  slug: "methods/connect";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/create.mdx": {
	id: "methods/create.mdx";
  slug: "methods/create";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/delete.mdx": {
	id: "methods/delete.mdx";
  slug: "methods/delete";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/export.mdx": {
	id: "methods/export.mdx";
  slug: "methods/export";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/import.mdx": {
	id: "methods/import.mdx";
  slug: "methods/import";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/index.mdx": {
	id: "methods/index.mdx";
  slug: "methods";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/info.mdx": {
	id: "methods/info.mdx";
  slug: "methods/info";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/insert.mdx": {
	id: "methods/insert.mdx";
  slug: "methods/insert";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/insertrelation.mdx": {
	id: "methods/insertrelation.mdx";
  slug: "methods/insertrelation";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/invalidate.mdx": {
	id: "methods/invalidate.mdx";
  slug: "methods/invalidate";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/kill.mdx": {
	id: "methods/kill.mdx";
  slug: "methods/kill";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/let.mdx": {
	id: "methods/let.mdx";
  slug: "methods/let";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/live.mdx": {
	id: "methods/live.mdx";
  slug: "methods/live";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/merge.mdx": {
	id: "methods/merge.mdx";
  slug: "methods/merge";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/patch.mdx": {
	id: "methods/patch.mdx";
  slug: "methods/patch";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/query.mdx": {
	id: "methods/query.mdx";
  slug: "methods/query";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/select.mdx": {
	id: "methods/select.mdx";
  slug: "methods/select";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/signin.mdx": {
	id: "methods/signin.mdx";
  slug: "methods/signin";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/signup.mdx": {
	id: "methods/signup.mdx";
  slug: "methods/signup";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/subscribelive.mdx": {
	id: "methods/subscribelive.mdx";
  slug: "methods/subscribelive";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/unset.mdx": {
	id: "methods/unset.mdx";
  slug: "methods/unset";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/update.mdx": {
	id: "methods/update.mdx";
  slug: "methods/update";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/upsert.mdx": {
	id: "methods/upsert.mdx";
  slug: "methods/upsert";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"methods/use.mdx": {
	id: "methods/use.mdx";
  slug: "methods/use";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"properties.mdx": {
	id: "properties.mdx";
  slug: "properties";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
"start.mdx": {
	id: "start.mdx";
  slug: "start";
  body: string;
  collection: "doc-sdk-javascript-1x";
  data: InferEntrySchema<"doc-sdk-javascript-1x">
} & { render(): Render[".mdx"] };
};
"doc-sdk-php": {
"core/authentication.mdx": {
	id: "core/authentication.mdx";
  slug: "core/authentication";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"core/data-querying.mdx": {
	id: "core/data-querying.mdx";
  slug: "core/data-querying";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"core/index.mdx": {
	id: "core/index.mdx";
  slug: "core";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"core/initialization.mdx": {
	id: "core/initialization.mdx";
  slug: "core/initialization";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"data-types.mdx": {
	id: "data-types.mdx";
  slug: "data-types";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/authenticate.mdx": {
	id: "methods/authenticate.mdx";
  slug: "methods/authenticate";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/close.mdx": {
	id: "methods/close.mdx";
  slug: "methods/close";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/connect.mdx": {
	id: "methods/connect.mdx";
  slug: "methods/connect";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/create.mdx": {
	id: "methods/create.mdx";
  slug: "methods/create";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/delete.mdx": {
	id: "methods/delete.mdx";
  slug: "methods/delete";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/export.mdx": {
	id: "methods/export.mdx";
  slug: "methods/export";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/health.mdx": {
	id: "methods/health.mdx";
  slug: "methods/health";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/import.mdx": {
	id: "methods/import.mdx";
  slug: "methods/import";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/index.mdx": {
	id: "methods/index.mdx";
  slug: "methods";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/info.mdx": {
	id: "methods/info.mdx";
  slug: "methods/info";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/insert.mdx": {
	id: "methods/insert.mdx";
  slug: "methods/insert";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/insertRelation.mdx": {
	id: "methods/insertRelation.mdx";
  slug: "methods/insertrelation";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/invalidate.mdx": {
	id: "methods/invalidate.mdx";
  slug: "methods/invalidate";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/let.mdx": {
	id: "methods/let.mdx";
  slug: "methods/let";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/merge.mdx": {
	id: "methods/merge.mdx";
  slug: "methods/merge";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/patch.mdx": {
	id: "methods/patch.mdx";
  slug: "methods/patch";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/query.mdx": {
	id: "methods/query.mdx";
  slug: "methods/query";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/queryRaw.mdx": {
	id: "methods/queryRaw.mdx";
  slug: "methods/queryraw";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/run.mdx": {
	id: "methods/run.mdx";
  slug: "methods/run";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/select.mdx": {
	id: "methods/select.mdx";
  slug: "methods/select";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/signin.mdx": {
	id: "methods/signin.mdx";
  slug: "methods/signin";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/signup.mdx": {
	id: "methods/signup.mdx";
  slug: "methods/signup";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/status.mdx": {
	id: "methods/status.mdx";
  slug: "methods/status";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/unset.mdx": {
	id: "methods/unset.mdx";
  slug: "methods/unset";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/update.mdx": {
	id: "methods/update.mdx";
  slug: "methods/update";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/upsert.mdx": {
	id: "methods/upsert.mdx";
  slug: "methods/upsert";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/use.mdx": {
	id: "methods/use.mdx";
  slug: "methods/use";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"methods/version.mdx": {
	id: "methods/version.mdx";
  slug: "methods/version";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
"setup.mdx": {
	id: "setup.mdx";
  slug: "setup";
  body: string;
  collection: "doc-sdk-php";
  data: InferEntrySchema<"doc-sdk-php">
} & { render(): Render[".mdx"] };
};
"doc-sdk-python": {
"agents.mdx": {
	id: "agents.mdx";
  slug: "agents";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"concepts/create-a-new-connection.mdx": {
	id: "concepts/create-a-new-connection.mdx";
  slug: "concepts/create-a-new-connection";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"concepts/data-maniplulation.mdx": {
	id: "concepts/data-maniplulation.mdx";
  slug: "concepts/data-maniplulation";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"concepts/handling-authentication.mdx": {
	id: "concepts/handling-authentication.mdx";
  slug: "concepts/handling-authentication";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"concepts/index.mdx": {
	id: "concepts/index.mdx";
  slug: "concepts";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"concepts/parameters.mdx": {
	id: "concepts/parameters.mdx";
  slug: "concepts/parameters";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"concepts/streaming.mdx": {
	id: "concepts/streaming.mdx";
  slug: "concepts/streaming";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"concepts/writing-surrealql.mdx": {
	id: "concepts/writing-surrealql.mdx";
  slug: "concepts/writing-surrealql";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"data-types.mdx": {
	id: "data-types.mdx";
  slug: "data-types";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"embedding.mdx": {
	id: "embedding.mdx";
  slug: "embedding";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"installation.mdx": {
	id: "installation.mdx";
  slug: "installation";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/authenticate.mdx": {
	id: "methods/authenticate.mdx";
  slug: "methods/authenticate";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/close.mdx": {
	id: "methods/close.mdx";
  slug: "methods/close";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/connect.mdx": {
	id: "methods/connect.mdx";
  slug: "methods/connect";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/create.mdx": {
	id: "methods/create.mdx";
  slug: "methods/create";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/delete.mdx": {
	id: "methods/delete.mdx";
  slug: "methods/delete";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/index.mdx": {
	id: "methods/index.mdx";
  slug: "methods";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/info.mdx": {
	id: "methods/info.mdx";
  slug: "methods/info";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/insert-relation.mdx": {
	id: "methods/insert-relation.mdx";
  slug: "methods/insert-relation";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/insert.mdx": {
	id: "methods/insert.mdx";
  slug: "methods/insert";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/invalidate.mdx": {
	id: "methods/invalidate.mdx";
  slug: "methods/invalidate";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/kill.mdx": {
	id: "methods/kill.mdx";
  slug: "methods/kill";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/let.mdx": {
	id: "methods/let.mdx";
  slug: "methods/let";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/live.mdx": {
	id: "methods/live.mdx";
  slug: "methods/live";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/merge.mdx": {
	id: "methods/merge.mdx";
  slug: "methods/merge";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/patch.mdx": {
	id: "methods/patch.mdx";
  slug: "methods/patch";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/query.mdx": {
	id: "methods/query.mdx";
  slug: "methods/query";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/select.mdx": {
	id: "methods/select.mdx";
  slug: "methods/select";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/signin.mdx": {
	id: "methods/signin.mdx";
  slug: "methods/signin";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/signup.mdx": {
	id: "methods/signup.mdx";
  slug: "methods/signup";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/subscribelive.mdx": {
	id: "methods/subscribelive.mdx";
  slug: "methods/subscribelive";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/unset.mdx": {
	id: "methods/unset.mdx";
  slug: "methods/unset";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/update.mdx": {
	id: "methods/update.mdx";
  slug: "methods/update";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/upsert.mdx": {
	id: "methods/upsert.mdx";
  slug: "methods/upsert";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"methods/use.mdx": {
	id: "methods/use.mdx";
  slug: "methods/use";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
"start.mdx": {
	id: "start.mdx";
  slug: "start";
  body: string;
  collection: "doc-sdk-python";
  data: InferEntrySchema<"doc-sdk-python">
} & { render(): Render[".mdx"] };
};
"doc-sdk-rust": {
"concepts/authenticating-users.mdx": {
	id: "concepts/authenticating-users.mdx";
  slug: "concepts/authenticating-users";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/concurrency.mdx": {
	id: "concepts/concurrency.mdx";
  slug: "concepts/concurrency";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/fetch.mdx": {
	id: "concepts/fetch.mdx";
  slug: "concepts/fetch";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/flexible-typing.mdx": {
	id: "concepts/flexible-typing.mdx";
  slug: "concepts/flexible-typing";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/index.mdx": {
	id: "concepts/index.mdx";
  slug: "concepts";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/live.mdx": {
	id: "concepts/live.mdx";
  slug: "concepts/live";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/multi-tenancy.mdx": {
	id: "concepts/multi-tenancy.mdx";
  slug: "concepts/multi-tenancy";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/rust-after-3.0.mdx": {
	id: "concepts/rust-after-3.0.mdx";
  slug: "concepts/rust-after-30";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/transaction.mdx": {
	id: "concepts/transaction.mdx";
  slug: "concepts/transaction";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"concepts/vector-embeddings.mdx": {
	id: "concepts/vector-embeddings.mdx";
  slug: "concepts/vector-embeddings";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"embedding.mdx": {
	id: "embedding.mdx";
  slug: "embedding";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"frameworks/actix.mdx": {
	id: "frameworks/actix.mdx";
  slug: "frameworks/actix";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"frameworks/axum.mdx": {
	id: "frameworks/axum.mdx";
  slug: "frameworks/axum";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"frameworks/egui.mdx": {
	id: "frameworks/egui.mdx";
  slug: "frameworks/egui";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"frameworks/index.mdx": {
	id: "frameworks/index.mdx";
  slug: "frameworks";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"frameworks/rocket.mdx": {
	id: "frameworks/rocket.mdx";
  slug: "frameworks/rocket";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/authenticate.mdx": {
	id: "methods/authenticate.mdx";
  slug: "methods/authenticate";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/connect.mdx": {
	id: "methods/connect.mdx";
  slug: "methods/connect";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/create.mdx": {
	id: "methods/create.mdx";
  slug: "methods/create";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/delete.mdx": {
	id: "methods/delete.mdx";
  slug: "methods/delete";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/export.mdx": {
	id: "methods/export.mdx";
  slug: "methods/export";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/get.mdx": {
	id: "methods/get.mdx";
  slug: "methods/get";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/import.mdx": {
	id: "methods/import.mdx";
  slug: "methods/import";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/index.mdx": {
	id: "methods/index.mdx";
  slug: "methods";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/init.mdx": {
	id: "methods/init.mdx";
  slug: "methods/init";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/insert.mdx": {
	id: "methods/insert.mdx";
  slug: "methods/insert";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/invalidate.mdx": {
	id: "methods/invalidate.mdx";
  slug: "methods/invalidate";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/new.mdx": {
	id: "methods/new.mdx";
  slug: "methods/new";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/query.mdx": {
	id: "methods/query.mdx";
  slug: "methods/query";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/run.mdx": {
	id: "methods/run.mdx";
  slug: "methods/run";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/select-live.mdx": {
	id: "methods/select-live.mdx";
  slug: "methods/select-live";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/select.mdx": {
	id: "methods/select.mdx";
  slug: "methods/select";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/set.mdx": {
	id: "methods/set.mdx";
  slug: "methods/set";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/signin.mdx": {
	id: "methods/signin.mdx";
  slug: "methods/signin";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/signup.mdx": {
	id: "methods/signup.mdx";
  slug: "methods/signup";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/unset.mdx": {
	id: "methods/unset.mdx";
  slug: "methods/unset";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/update.mdx": {
	id: "methods/update.mdx";
  slug: "methods/update";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/upsert.mdx": {
	id: "methods/upsert.mdx";
  slug: "methods/upsert";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/use.mdx": {
	id: "methods/use.mdx";
  slug: "methods/use";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/version.mdx": {
	id: "methods/version.mdx";
  slug: "methods/version";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"methods/wait-for.mdx": {
	id: "methods/wait-for.mdx";
  slug: "methods/wait-for";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
"setup.mdx": {
	id: "setup.mdx";
  slug: "setup";
  body: string;
  collection: "doc-sdk-rust";
  data: InferEntrySchema<"doc-sdk-rust">
} & { render(): Render[".mdx"] };
};
"doc-surrealdb": {
"cli/env.mdx": {
	id: "cli/env.mdx";
  slug: "cli/env";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/export.mdx": {
	id: "cli/export.mdx";
  slug: "cli/export";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/fix.mdx": {
	id: "cli/fix.mdx";
  slug: "cli/fix";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/help.mdx": {
	id: "cli/help.mdx";
  slug: "cli/help";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/import.mdx": {
	id: "cli/import.mdx";
  slug: "cli/import";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/index.mdx": {
	id: "cli/index.mdx";
  slug: "cli";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/isready.mdx": {
	id: "cli/isready.mdx";
  slug: "cli/isready";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/ml.mdx": {
	id: "cli/ml.mdx";
  slug: "cli/ml";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/module.mdx": {
	id: "cli/module.mdx";
  slug: "cli/module";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/sql.mdx": {
	id: "cli/sql.mdx";
  slug: "cli/sql";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/start.mdx": {
	id: "cli/start.mdx";
  slug: "cli/start";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/upgrade.mdx": {
	id: "cli/upgrade.mdx";
  slug: "cli/upgrade";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/validate.mdx": {
	id: "cli/validate.mdx";
  slug: "cli/validate";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"cli/version.mdx": {
	id: "cli/version.mdx";
  slug: "cli/version";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"deployment/amazon.mdx": {
	id: "deployment/amazon.mdx";
  slug: "deployment/amazon";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"deployment/azure.mdx": {
	id: "deployment/azure.mdx";
  slug: "deployment/azure";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"deployment/google.mdx": {
	id: "deployment/google.mdx";
  slug: "deployment/google";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"deployment/index.mdx": {
	id: "deployment/index.mdx";
  slug: "deployment";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"deployment/kubernetes.mdx": {
	id: "deployment/kubernetes.mdx";
  slug: "deployment/kubernetes";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"deployment/surreal cloud.mdx": {
	id: "deployment/surreal cloud.mdx";
  slug: "deployment/surreal-cloud";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"embedding/dotnet.mdx": {
	id: "embedding/dotnet.mdx";
  slug: "embedding/dotnet";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"embedding/index.mdx": {
	id: "embedding/index.mdx";
  slug: "embedding";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"embedding/javascript.mdx": {
	id: "embedding/javascript.mdx";
  slug: "embedding/javascript";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"embedding/python.mdx": {
	id: "embedding/python.mdx";
  slug: "embedding/python";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"embedding/rust.mdx": {
	id: "embedding/rust.mdx";
  slug: "embedding/rust";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"extensions/examples.mdx": {
	id: "extensions/examples.mdx";
  slug: "extensions/examples";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"extensions/index.mdx": {
	id: "extensions/index.mdx";
  slug: "extensions";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"extensions/tutorial.mdx": {
	id: "extensions/tutorial.mdx";
  slug: "extensions/tutorial";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"faqs/index.mdx": {
	id: "faqs/index.mdx";
  slug: "faqs";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"faqs/known-issues.mdx": {
	id: "faqs/known-issues.mdx";
  slug: "faqs/known-issues";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/index.mdx": {
	id: "installation/index.mdx";
  slug: "installation";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/linux.mdx": {
	id: "installation/linux.mdx";
  slug: "installation/linux";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/macos.mdx": {
	id: "installation/macos.mdx";
  slug: "installation/macos";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/nightly.mdx": {
	id: "installation/nightly.mdx";
  slug: "installation/nightly";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/running/docker.mdx": {
	id: "installation/running/docker.mdx";
  slug: "installation/running/docker";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/running/file.mdx": {
	id: "installation/running/file.mdx";
  slug: "installation/running/file";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/running/index.mdx": {
	id: "installation/running/index.mdx";
  slug: "installation/running";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/running/memory.mdx": {
	id: "installation/running/memory.mdx";
  slug: "installation/running/memory";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/running/tikv.mdx": {
	id: "installation/running/tikv.mdx";
  slug: "installation/running/tikv";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/upgrading/index.mdx": {
	id: "installation/upgrading/index.mdx";
  slug: "installation/upgrading";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/upgrading/migrating-data-to-2.x.mdx": {
	id: "installation/upgrading/migrating-data-to-2.x.mdx";
  slug: "installation/upgrading/migrating-data-to-2x";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/upgrading/migrating-data-to-3.x.mdx": {
	id: "installation/upgrading/migrating-data-to-3.x.mdx";
  slug: "installation/upgrading/migrating-data-to-3x";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"installation/windows.mdx": {
	id: "installation/windows.mdx";
  slug: "installation/windows";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"integration/cbor.mdx": {
	id: "integration/cbor.mdx";
  slug: "integration/cbor";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"integration/http.mdx": {
	id: "integration/http.mdx";
  slug: "integration/http";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"integration/index.mdx": {
	id: "integration/index.mdx";
  slug: "integration";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"integration/rpc.mdx": {
	id: "integration/rpc.mdx";
  slug: "integration/rpc";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"integration/sdks.mdx": {
	id: "integration/sdks.mdx";
  slug: "integration/sdks";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"introduction/architecture.mdx": {
	id: "introduction/architecture.mdx";
  slug: "introduction/architecture";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"introduction/concepts.mdx": {
	id: "introduction/concepts.mdx";
  slug: "introduction/concepts";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"introduction/index.mdx": {
	id: "introduction/index.mdx";
  slug: "introduction";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"introduction/start.mdx": {
	id: "introduction/start.mdx";
  slug: "introduction/start";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/csv.mdx": {
	id: "migrating/csv.mdx";
  slug: "migrating/csv";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/index.mdx": {
	id: "migrating/index.mdx";
  slug: "migrating";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/jsonl.mdx": {
	id: "migrating/jsonl.mdx";
  slug: "migrating/jsonl";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/kafka.mdx": {
	id: "migrating/kafka.mdx";
  slug: "migrating/kafka";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/mongodb.mdx": {
	id: "migrating/mongodb.mdx";
  slug: "migrating/mongodb";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/mysql.mdx": {
	id: "migrating/mysql.mdx";
  slug: "migrating/mysql";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/neo4j.mdx": {
	id: "migrating/neo4j.mdx";
  slug: "migrating/neo4j";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"migrating/postgresql.mdx": {
	id: "migrating/postgresql.mdx";
  slug: "migrating/postgresql";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"models/document.mdx": {
	id: "models/document.mdx";
  slug: "models/document";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"models/full-text-search.mdx": {
	id: "models/full-text-search.mdx";
  slug: "models/full-text-search";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"models/geospatial.mdx": {
	id: "models/geospatial.mdx";
  slug: "models/geospatial";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"models/graph.mdx": {
	id: "models/graph.mdx";
  slug: "models/graph";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"models/index.mdx": {
	id: "models/index.mdx";
  slug: "models";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"models/time-series.mdx": {
	id: "models/time-series.mdx";
  slug: "models/time-series";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"models/vector.mdx": {
	id: "models/vector.mdx";
  slug: "models/vector";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/graphql/bruno.mdx": {
	id: "querying/graphql/bruno.mdx";
  slug: "querying/graphql/bruno";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/graphql/http.mdx": {
	id: "querying/graphql/http.mdx";
  slug: "querying/graphql/http";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/graphql/index.mdx": {
	id: "querying/graphql/index.mdx";
  slug: "querying/graphql";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/graphql/surrealist.mdx": {
	id: "querying/graphql/surrealist.mdx";
  slug: "querying/graphql/surrealist";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/index.mdx": {
	id: "querying/index.mdx";
  slug: "querying";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/sdks/index.mdx": {
	id: "querying/sdks/index.mdx";
  slug: "querying/sdks";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/surrealql/cli.mdx": {
	id: "querying/surrealql/cli.mdx";
  slug: "querying/surrealql/cli";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/surrealql/http.mdx": {
	id: "querying/surrealql/http.mdx";
  slug: "querying/surrealql/http";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/surrealql/index.mdx": {
	id: "querying/surrealql/index.mdx";
  slug: "querying/surrealql";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"querying/surrealql/surrealist.mdx": {
	id: "querying/surrealql/surrealist.mdx";
  slug: "querying/surrealql/surrealist";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"reference-guide/index.mdx": {
	id: "reference-guide/index.mdx";
  slug: "reference-guide";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"reference-guide/observability.mdx": {
	id: "reference-guide/observability.mdx";
  slug: "reference-guide/observability";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"reference-guide/performance-best-practices.mdx": {
	id: "reference-guide/performance-best-practices.mdx";
  slug: "reference-guide/performance-best-practices";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"reference-guide/real-time-best-practices.mdx": {
	id: "reference-guide/real-time-best-practices.mdx";
  slug: "reference-guide/real-time-best-practices";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"reference-guide/sample-industry-schemas.mdx": {
	id: "reference-guide/sample-industry-schemas.mdx";
  slug: "reference-guide/sample-industry-schemas";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"reference-guide/schema-creation-best-practices.mdx": {
	id: "reference-guide/schema-creation-best-practices.mdx";
  slug: "reference-guide/schema-creation-best-practices";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"security/authentication.mdx": {
	id: "security/authentication.mdx";
  slug: "security/authentication";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"security/capabilities.mdx": {
	id: "security/capabilities.mdx";
  slug: "security/capabilities";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"security/index.mdx": {
	id: "security/index.mdx";
  slug: "security";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"security/security-best-practices.mdx": {
	id: "security/security-best-practices.mdx";
  slug: "security/security-best-practices";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"security/summary.mdx": {
	id: "security/summary.mdx";
  slug: "security/summary";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
"security/troubleshooting.mdx": {
	id: "security/troubleshooting.mdx";
  slug: "security/troubleshooting";
  body: string;
  collection: "doc-surrealdb";
  data: InferEntrySchema<"doc-surrealdb">
} & { render(): Render[".mdx"] };
};
"doc-surrealist": {
"advanced-topics/connection-templates.mdx": {
	id: "advanced-topics/connection-templates.mdx";
  slug: "advanced-topics/connection-templates";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"advanced-topics/embedding-surrealist.mdx": {
	id: "advanced-topics/embedding-surrealist.mdx";
  slug: "advanced-topics/embedding-surrealist";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"advanced-topics/index.mdx": {
	id: "advanced-topics/index.mdx";
  slug: "advanced-topics";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"advanced-topics/intents.mdx": {
	id: "advanced-topics/intents.mdx";
  slug: "advanced-topics/intents";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"advanced-topics/search-and-shortcuts.mdx": {
	id: "advanced-topics/search-and-shortcuts.mdx";
  slug: "advanced-topics/search-and-shortcuts";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"advanced-topics/settings-and-customisation.mdx": {
	id: "advanced-topics/settings-and-customisation.mdx";
  slug: "advanced-topics/settings-and-customisation";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"advanced-topics/surrealql-editors.mdx": {
	id: "advanced-topics/surrealql-editors.mdx";
  slug: "advanced-topics/surrealql-editors";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/designing-the-database-schema.mdx": {
	id: "concepts/designing-the-database-schema.mdx";
  slug: "concepts/designing-the-database-schema";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/explore-database-records.mdx": {
	id: "concepts/explore-database-records.mdx";
  slug: "concepts/explore-database-records";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/index.mdx": {
	id: "concepts/index.mdx";
  slug: "concepts";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/local-database-serving.mdx": {
	id: "concepts/local-database-serving.mdx";
  slug: "concepts/local-database-serving";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/manage-database-access.mdx": {
	id: "concepts/manage-database-access.mdx";
  slug: "concepts/manage-database-access";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/sending-queries-with-graphql.mdx": {
	id: "concepts/sending-queries-with-graphql.mdx";
  slug: "concepts/sending-queries-with-graphql";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/sending-queries.mdx": {
	id: "concepts/sending-queries.mdx";
  slug: "concepts/sending-queries";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/specialized-api-docs.mdx": {
	id: "concepts/specialized-api-docs.mdx";
  slug: "concepts/specialized-api-docs";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/surreal-cloud.mdx": {
	id: "concepts/surreal-cloud.mdx";
  slug: "concepts/surreal-cloud";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"concepts/writing-stored-procedures.mdx": {
	id: "concepts/writing-stored-procedures.mdx";
  slug: "concepts/writing-stored-procedures";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"faqs/index.mdx": {
	id: "faqs/index.mdx";
  slug: "faqs";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"faqs/info.mdx": {
	id: "faqs/info.mdx";
  slug: "faqs/info";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"faqs/known-issues.mdx": {
	id: "faqs/known-issues.mdx";
  slug: "faqs/known-issues";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"getting-started.mdx": {
	id: "getting-started.mdx";
  slug: "getting-started";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"installation.mdx": {
	id: "installation.mdx";
  slug: "installation";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
"troubleshooting.mdx": {
	id: "troubleshooting.mdx";
  slug: "troubleshooting";
  body: string;
  collection: "doc-surrealist";
  data: InferEntrySchema<"doc-surrealist">
} & { render(): Render[".mdx"] };
};
"doc-surrealkv": {
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-surrealkv";
  data: InferEntrySchema<"doc-surrealkv">
} & { render(): Render[".mdx"] };
"performance.mdx": {
	id: "performance.mdx";
  slug: "performance";
  body: string;
  collection: "doc-surrealkv";
  data: InferEntrySchema<"doc-surrealkv">
} & { render(): Render[".mdx"] };
};
"doc-surrealml": {
"computation.mdx": {
	id: "computation.mdx";
  slug: "computation";
  body: string;
  collection: "doc-surrealml";
  data: InferEntrySchema<"doc-surrealml">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-surrealml";
  data: InferEntrySchema<"doc-surrealml">
} & { render(): Render[".mdx"] };
"storage.mdx": {
	id: "storage.mdx";
  slug: "storage";
  body: string;
  collection: "doc-surrealml";
  data: InferEntrySchema<"doc-surrealml">
} & { render(): Render[".mdx"] };
};
"doc-surrealql": {
"clauses/explain.mdx": {
	id: "clauses/explain.mdx";
  slug: "clauses/explain";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/fetch.mdx": {
	id: "clauses/fetch.mdx";
  slug: "clauses/fetch";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/from.mdx": {
	id: "clauses/from.mdx";
  slug: "clauses/from";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/group-by.mdx": {
	id: "clauses/group-by.mdx";
  slug: "clauses/group-by";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/index.mdx": {
	id: "clauses/index.mdx";
  slug: "clauses";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/limit.mdx": {
	id: "clauses/limit.mdx";
  slug: "clauses/limit";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/omit.mdx": {
	id: "clauses/omit.mdx";
  slug: "clauses/omit";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/order-by.mdx": {
	id: "clauses/order-by.mdx";
  slug: "clauses/order-by";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/split.mdx": {
	id: "clauses/split.mdx";
  slug: "clauses/split";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/where.mdx": {
	id: "clauses/where.mdx";
  slug: "clauses/where";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"clauses/with.mdx": {
	id: "clauses/with.mdx";
  slug: "clauses/with";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"comments.mdx": {
	id: "comments.mdx";
  slug: "comments";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/arrays.mdx": {
	id: "datamodel/arrays.mdx";
  slug: "datamodel/arrays";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/booleans.mdx": {
	id: "datamodel/booleans.mdx";
  slug: "datamodel/booleans";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/bytes.mdx": {
	id: "datamodel/bytes.mdx";
  slug: "datamodel/bytes";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/casting.mdx": {
	id: "datamodel/casting.mdx";
  slug: "datamodel/casting";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/closures.mdx": {
	id: "datamodel/closures.mdx";
  slug: "datamodel/closures";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/datetimes.mdx": {
	id: "datamodel/datetimes.mdx";
  slug: "datamodel/datetimes";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/files.mdx": {
	id: "datamodel/files.mdx";
  slug: "datamodel/files";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/formatters.mdx": {
	id: "datamodel/formatters.mdx";
  slug: "datamodel/formatters";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/futures.mdx": {
	id: "datamodel/futures.mdx";
  slug: "datamodel/futures";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/geometries.mdx": {
	id: "datamodel/geometries.mdx";
  slug: "datamodel/geometries";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/idioms.mdx": {
	id: "datamodel/idioms.mdx";
  slug: "datamodel/idioms";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/ids.mdx": {
	id: "datamodel/ids.mdx";
  slug: "datamodel/ids";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/index.mdx": {
	id: "datamodel/index.mdx";
  slug: "datamodel";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/literals.mdx": {
	id: "datamodel/literals.mdx";
  slug: "datamodel/literals";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/none-and-null.mdx": {
	id: "datamodel/none-and-null.mdx";
  slug: "datamodel/none-and-null";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/numbers.mdx": {
	id: "datamodel/numbers.mdx";
  slug: "datamodel/numbers";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/objects.mdx": {
	id: "datamodel/objects.mdx";
  slug: "datamodel/objects";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/ranges.mdx": {
	id: "datamodel/ranges.mdx";
  slug: "datamodel/ranges";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/records.mdx": {
	id: "datamodel/records.mdx";
  slug: "datamodel/records";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/references.mdx": {
	id: "datamodel/references.mdx";
  slug: "datamodel/references";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/regex.mdx": {
	id: "datamodel/regex.mdx";
  slug: "datamodel/regex";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/sets.mdx": {
	id: "datamodel/sets.mdx";
  slug: "datamodel/sets";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/strings.mdx": {
	id: "datamodel/strings.mdx";
  slug: "datamodel/strings";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/uuid.mdx": {
	id: "datamodel/uuid.mdx";
  slug: "datamodel/uuid";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"datamodel/values.mdx": {
	id: "datamodel/values.mdx";
  slug: "datamodel/values";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"demo.mdx": {
	id: "demo.mdx";
  slug: "demo";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/api.mdx": {
	id: "functions/database/api.mdx";
  slug: "functions/database/api";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/array.mdx": {
	id: "functions/database/array.mdx";
  slug: "functions/database/array";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/bytes.mdx": {
	id: "functions/database/bytes.mdx";
  slug: "functions/database/bytes";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/count.mdx": {
	id: "functions/database/count.mdx";
  slug: "functions/database/count";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/crypto.mdx": {
	id: "functions/database/crypto.mdx";
  slug: "functions/database/crypto";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/duration.mdx": {
	id: "functions/database/duration.mdx";
  slug: "functions/database/duration";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/encoding.mdx": {
	id: "functions/database/encoding.mdx";
  slug: "functions/database/encoding";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/file.mdx": {
	id: "functions/database/file.mdx";
  slug: "functions/database/file";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/geo.mdx": {
	id: "functions/database/geo.mdx";
  slug: "functions/database/geo";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/http.mdx": {
	id: "functions/database/http.mdx";
  slug: "functions/database/http";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/index.mdx": {
	id: "functions/database/index.mdx";
  slug: "functions/database";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/math.mdx": {
	id: "functions/database/math.mdx";
  slug: "functions/database/math";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/meta.mdx": {
	id: "functions/database/meta.mdx";
  slug: "functions/database/meta";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/not.mdx": {
	id: "functions/database/not.mdx";
  slug: "functions/database/not";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/object.mdx": {
	id: "functions/database/object.mdx";
  slug: "functions/database/object";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/parse.mdx": {
	id: "functions/database/parse.mdx";
  slug: "functions/database/parse";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/rand.mdx": {
	id: "functions/database/rand.mdx";
  slug: "functions/database/rand";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/record.mdx": {
	id: "functions/database/record.mdx";
  slug: "functions/database/record";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/search.mdx": {
	id: "functions/database/search.mdx";
  slug: "functions/database/search";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/sequence.mdx": {
	id: "functions/database/sequence.mdx";
  slug: "functions/database/sequence";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/session.mdx": {
	id: "functions/database/session.mdx";
  slug: "functions/database/session";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/set.mdx": {
	id: "functions/database/set.mdx";
  slug: "functions/database/set";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/sleep.mdx": {
	id: "functions/database/sleep.mdx";
  slug: "functions/database/sleep";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/string.mdx": {
	id: "functions/database/string.mdx";
  slug: "functions/database/string";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/time.mdx": {
	id: "functions/database/time.mdx";
  slug: "functions/database/time";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/type.mdx": {
	id: "functions/database/type.mdx";
  slug: "functions/database/type";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/value.mdx": {
	id: "functions/database/value.mdx";
  slug: "functions/database/value";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/database/vector.mdx": {
	id: "functions/database/vector.mdx";
  slug: "functions/database/vector";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/index.mdx": {
	id: "functions/index.mdx";
  slug: "functions";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/ml/functions.mdx": {
	id: "functions/ml/functions.mdx";
  slug: "functions/ml/functions";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/ml/index.mdx": {
	id: "functions/ml/index.mdx";
  slug: "functions/ml";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/script/arguments.mdx": {
	id: "functions/script/arguments.mdx";
  slug: "functions/script/arguments";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/script/built-in-functions.mdx": {
	id: "functions/script/built-in-functions.mdx";
  slug: "functions/script/built-in-functions";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/script/context.mdx": {
	id: "functions/script/context.mdx";
  slug: "functions/script/context";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/script/index.mdx": {
	id: "functions/script/index.mdx";
  slug: "functions/script";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/script/surrealql-functions.mdx": {
	id: "functions/script/surrealql-functions.mdx";
  slug: "functions/script/surrealql-functions";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"functions/script/type-conversion.mdx": {
	id: "functions/script/type-conversion.mdx";
  slug: "functions/script/type-conversion";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"operators.mdx": {
	id: "operators.mdx";
  slug: "operators";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"parameters.mdx": {
	id: "parameters.mdx";
  slug: "parameters";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/access.mdx": {
	id: "statements/access.mdx";
  slug: "statements/access";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/database.mdx": {
	id: "statements/alter/database.mdx";
  slug: "statements/alter/database";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/field.mdx": {
	id: "statements/alter/field.mdx";
  slug: "statements/alter/field";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/index.mdx": {
	id: "statements/alter/index.mdx";
  slug: "statements/alter";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/indexes.mdx": {
	id: "statements/alter/indexes.mdx";
  slug: "statements/alter/indexes";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/namespace.mdx": {
	id: "statements/alter/namespace.mdx";
  slug: "statements/alter/namespace";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/sequence.mdx": {
	id: "statements/alter/sequence.mdx";
  slug: "statements/alter/sequence";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/system.mdx": {
	id: "statements/alter/system.mdx";
  slug: "statements/alter/system";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/alter/table.mdx": {
	id: "statements/alter/table.mdx";
  slug: "statements/alter/table";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/begin.mdx": {
	id: "statements/begin.mdx";
  slug: "statements/begin";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/break.mdx": {
	id: "statements/break.mdx";
  slug: "statements/break";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/cancel.mdx": {
	id: "statements/cancel.mdx";
  slug: "statements/cancel";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/commit.mdx": {
	id: "statements/commit.mdx";
  slug: "statements/commit";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/continue.mdx": {
	id: "statements/continue.mdx";
  slug: "statements/continue";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/create.mdx": {
	id: "statements/create.mdx";
  slug: "statements/create";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/access/bearer.mdx": {
	id: "statements/define/access/bearer.mdx";
  slug: "statements/define/access/bearer";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/access/index.mdx": {
	id: "statements/define/access/index.mdx";
  slug: "statements/define/access";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/access/jwt.mdx": {
	id: "statements/define/access/jwt.mdx";
  slug: "statements/define/access/jwt";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/access/record.mdx": {
	id: "statements/define/access/record.mdx";
  slug: "statements/define/access/record";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/analyzer.mdx": {
	id: "statements/define/analyzer.mdx";
  slug: "statements/define/analyzer";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/api.mdx": {
	id: "statements/define/api.mdx";
  slug: "statements/define/api";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/bucket.mdx": {
	id: "statements/define/bucket.mdx";
  slug: "statements/define/bucket";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/config.mdx": {
	id: "statements/define/config.mdx";
  slug: "statements/define/config";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/database.mdx": {
	id: "statements/define/database.mdx";
  slug: "statements/define/database";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/event.mdx": {
	id: "statements/define/event.mdx";
  slug: "statements/define/event";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/field.mdx": {
	id: "statements/define/field.mdx";
  slug: "statements/define/field";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/function.mdx": {
	id: "statements/define/function.mdx";
  slug: "statements/define/function";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/index.mdx": {
	id: "statements/define/index.mdx";
  slug: "statements/define";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/indexes.mdx": {
	id: "statements/define/indexes.mdx";
  slug: "statements/define/indexes";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/module.mdx": {
	id: "statements/define/module.mdx";
  slug: "statements/define/module";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/namespace.mdx": {
	id: "statements/define/namespace.mdx";
  slug: "statements/define/namespace";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/param.mdx": {
	id: "statements/define/param.mdx";
  slug: "statements/define/param";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/scope.mdx": {
	id: "statements/define/scope.mdx";
  slug: "statements/define/scope";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/sequence.mdx": {
	id: "statements/define/sequence.mdx";
  slug: "statements/define/sequence";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/table.mdx": {
	id: "statements/define/table.mdx";
  slug: "statements/define/table";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/token.mdx": {
	id: "statements/define/token.mdx";
  slug: "statements/define/token";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/define/user.mdx": {
	id: "statements/define/user.mdx";
  slug: "statements/define/user";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/delete.mdx": {
	id: "statements/delete.mdx";
  slug: "statements/delete";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/explain.mdx": {
	id: "statements/explain.mdx";
  slug: "statements/explain";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/for.mdx": {
	id: "statements/for.mdx";
  slug: "statements/for";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/ifelse.mdx": {
	id: "statements/ifelse.mdx";
  slug: "statements/ifelse";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/index.mdx": {
	id: "statements/index.mdx";
  slug: "statements";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/info.mdx": {
	id: "statements/info.mdx";
  slug: "statements/info";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/insert.mdx": {
	id: "statements/insert.mdx";
  slug: "statements/insert";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/kill.mdx": {
	id: "statements/kill.mdx";
  slug: "statements/kill";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/let.mdx": {
	id: "statements/let.mdx";
  slug: "statements/let";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/live.mdx": {
	id: "statements/live.mdx";
  slug: "statements/live";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/rebuild.mdx": {
	id: "statements/rebuild.mdx";
  slug: "statements/rebuild";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/relate.mdx": {
	id: "statements/relate.mdx";
  slug: "statements/relate";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/remove.mdx": {
	id: "statements/remove.mdx";
  slug: "statements/remove";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/return.mdx": {
	id: "statements/return.mdx";
  slug: "statements/return";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/select.mdx": {
	id: "statements/select.mdx";
  slug: "statements/select";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/show.mdx": {
	id: "statements/show.mdx";
  slug: "statements/show";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/sleep.mdx": {
	id: "statements/sleep.mdx";
  slug: "statements/sleep";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/throw.mdx": {
	id: "statements/throw.mdx";
  slug: "statements/throw";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/update.mdx": {
	id: "statements/update.mdx";
  slug: "statements/update";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/upsert.mdx": {
	id: "statements/upsert.mdx";
  slug: "statements/upsert";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"statements/use.mdx": {
	id: "statements/use.mdx";
  slug: "statements/use";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
"transactions.mdx": {
	id: "transactions.mdx";
  slug: "transactions";
  body: string;
  collection: "doc-surrealql";
  data: InferEntrySchema<"doc-surrealql">
} & { render(): Render[".mdx"] };
};
"doc-tutorials": {
"build-a-realtime-presence-web-application-using-surrealdb-live-queries.mdx": {
	id: "build-a-realtime-presence-web-application-using-surrealdb-live-queries.mdx";
  slug: "build-a-realtime-presence-web-application-using-surrealdb-live-queries";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
"connect-to-surrealdb-via-ngrok-tunnel.mdx": {
	id: "connect-to-surrealdb-via-ngrok-tunnel.mdx";
  slug: "connect-to-surrealdb-via-ngrok-tunnel";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
"define-a-schema.mdx": {
	id: "define-a-schema.mdx";
  slug: "define-a-schema";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
"index.mdx": {
	id: "index.mdx";
  slug: "index";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
"integrate-auth0-as-authentication-provider.mdx": {
	id: "integrate-auth0-as-authentication-provider.mdx";
  slug: "integrate-auth0-as-authentication-provider";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
"integrate-aws-cognito-as-authentication-provider.mdx": {
	id: "integrate-aws-cognito-as-authentication-provider.mdx";
  slug: "integrate-aws-cognito-as-authentication-provider";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
"using-github-actions.mdx": {
	id: "using-github-actions.mdx";
  slug: "using-github-actions";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
"working-with-surrealdb-over-http-via-postman.mdx": {
	id: "working-with-surrealdb-over-http-via-postman.mdx";
  slug: "working-with-surrealdb-over-http-via-postman";
  body: string;
  collection: "doc-tutorials";
  data: InferEntrySchema<"doc-tutorials">
} & { render(): Render[".mdx"] };
};
"labs-items": {
"10-schema-tips-for-surrealdb.md": {
	id: "10-schema-tips-for-surrealdb.md";
  slug: "10-schema-tips-for-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"10-tips-and-tricks-for-surrealist.md": {
	id: "10-tips-and-tricks-for-surrealist.md";
  slug: "10-tips-and-tricks-for-surrealist";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"aeons-surreal-renaissance-official-book-for-in-depth-learning-through-storytelling.md": {
	id: "aeons-surreal-renaissance-official-book-for-in-depth-learning-through-storytelling.md";
  slug: "aeons-surreal-renaissance-official-book-for-in-depth-learning-through-storytelling";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"allographer.md": {
	id: "allographer.md";
  slug: "allographer";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"aspire-community-package.md": {
	id: "aspire-community-package.md";
  slug: "aspire-community-package";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"aspnet-healthchecks-package.md": {
	id: "aspnet-healthchecks-package.md";
  slug: "aspnet-healthchecks-package";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"awaited-surrealdb.md": {
	id: "awaited-surrealdb.md";
  slug: "awaited-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"beyond-surreal-a-closer-look-at-newsql-relational-data-beyond-fireship.md": {
	id: "beyond-surreal-a-closer-look-at-newsql-relational-data-beyond-fireship.md";
  slug: "beyond-surreal-a-closer-look-at-newsql-relational-data-beyond-fireship";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"blink-instant-editing.md": {
	id: "blink-instant-editing.md";
  slug: "blink-instant-editing";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"build-a-rag-chatbot-with-surrealdb-python-streamlit.md": {
	id: "build-a-rag-chatbot-with-surrealdb-python-streamlit.md";
  slug: "build-a-rag-chatbot-with-surrealdb-python-streamlit";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"build-a-realtime-presence-web-application-using-surrealdb-live-queries.md": {
	id: "build-a-realtime-presence-web-application-using-surrealdb-live-queries.md";
  slug: "build-a-realtime-presence-web-application-using-surrealdb-live-queries";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"build-an-ai-rag-agent.md": {
	id: "build-an-ai-rag-agent.md";
  slug: "build-an-ai-rag-agent";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"building-an-app-with-graph-relations-live-queries-authentication.md": {
	id: "building-an-app-with-graph-relations-live-queries-authentication.md";
  slug: "building-an-app-with-graph-relations-live-queries-authentication";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"cli-phone-book-in-python-using-surrealdb-as-database.md": {
	id: "cli-phone-book-in-python-using-surrealdb-as-database.md";
  slug: "cli-phone-book-in-python-using-surrealdb-as-database";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"connect-to-surrealdb-via-ngrok-tunnel.md": {
	id: "connect-to-surrealdb-via-ngrok-tunnel.md";
  slug: "connect-to-surrealdb-via-ngrok-tunnel";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"crud-using-surrealdb-in-rust-surrealdb.md": {
	id: "crud-using-surrealdb-in-rust-surrealdb.md";
  slug: "crud-using-surrealdb-in-rust-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"define-a-schema-in-surrealdb.md": {
	id: "define-a-schema-in-surrealdb.md";
  slug: "define-a-schema-in-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"designing-your-schema-in-surrealist.md": {
	id: "designing-your-schema-in-surrealist.md";
  slug: "designing-your-schema-in-surrealist";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"different-ways-to-perform-a-vector-search-in-surrealdb.md": {
	id: "different-ways-to-perform-a-vector-search-in-surrealdb.md";
  slug: "different-ways-to-perform-a-vector-search-in-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"document-style-relationships-in-surrealdb.md": {
	id: "document-style-relationships-in-surrealdb.md";
  slug: "document-style-relationships-in-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"dokku-surrealdb.md": {
	id: "dokku-surrealdb.md";
  slug: "dokku-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"embed-surrealist-in-your-projects.md": {
	id: "embed-surrealist-in-your-projects.md";
  slug: "embed-surrealist-in-your-projects";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"getting-started-with-surreal-cloud.md": {
	id: "getting-started-with-surreal-cloud.md";
  slug: "getting-started-with-surreal-cloud";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"getting-started-with-surrealdb-future-of-cloud-databases-maybe.md": {
	id: "getting-started-with-surrealdb-future-of-cloud-databases-maybe.md";
  slug: "getting-started-with-surrealdb-future-of-cloud-databases-maybe";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"getting-started-with-surrealdb-using-our-javascript-sdk.md": {
	id: "getting-started-with-surrealdb-using-our-javascript-sdk.md";
  slug: "getting-started-with-surrealdb-using-our-javascript-sdk";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"getting-started-with-surrealdb-using-our-rust-sdk.md": {
	id: "getting-started-with-surrealdb-using-our-rust-sdk.md";
  slug: "getting-started-with-surrealdb-using-our-rust-sdk";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"getting-started-with-surrealdb-using-python-and-docker.md": {
	id: "getting-started-with-surrealdb-using-python-and-docker.md";
  slug: "getting-started-with-surrealdb-using-python-and-docker";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"getting-started-with-surrealdb.md": {
	id: "getting-started-with-surrealdb.md";
  slug: "getting-started-with-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"getting-started-with-surrealist.md": {
	id: "getting-started-with-surrealist.md";
  slug: "getting-started-with-surrealist";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"gke-using-terraform.md": {
	id: "gke-using-terraform.md";
  slug: "gke-using-terraform";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"graph-full-text-search-vector-search-in-surrealist.md": {
	id: "graph-full-text-search-vector-search-in-surrealist.md";
  slug: "graph-full-text-search-vector-search-in-surrealist";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"graph-style-relationships-in-surrealdb.md": {
	id: "graph-style-relationships-in-surrealdb.md";
  slug: "graph-style-relationships-in-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"hosting-surreal-db-in-rust-in-less-than-3-minutes.md": {
	id: "hosting-surreal-db-in-rust-in-less-than-3-minutes.md";
  slug: "hosting-surreal-db-in-rust-in-less-than-3-minutes";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"how-a-luxury-fashion-retailer-scaled-personalised-recommendations-using-surre.md": {
	id: "how-a-luxury-fashion-retailer-scaled-personalised-recommendations-using-surre.md";
  slug: "how-a-luxury-fashion-retailer-scaled-personalised-recommendations-using-surre";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"how-i-built-a-saas-powered-by-surrealdb.md": {
	id: "how-i-built-a-saas-powered-by-surrealdb.md";
  slug: "how-i-built-a-saas-powered-by-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"how-to-build-a-full-stack-rust-dashboard-app-with-leptos-actix-web-surreall.md": {
	id: "how-to-build-a-full-stack-rust-dashboard-app-with-leptos-actix-web-surreall.md";
  slug: "how-to-build-a-full-stack-rust-dashboard-app-with-leptos-actix-web-surreall";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"how-to-build-a-rust-backend-with-actix-web-and-surrealdb-full-tutorial.md": {
	id: "how-to-build-a-rust-backend-with-actix-web-and-surrealdb-full-tutorial.md";
  slug: "how-to-build-a-rust-backend-with-actix-web-and-surrealdb-full-tutorial";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"how-to-do-a-full-text-search-query-in-surrealql.md": {
	id: "how-to-do-a-full-text-search-query-in-surrealql.md";
  slug: "how-to-do-a-full-text-search-query-in-surrealql";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"how-to-simplify-your-tech-stack-with-surrealdb.md": {
	id: "how-to-simplify-your-tech-stack-with-surrealdb.md";
  slug: "how-to-simplify-your-tech-stack-with-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"how-to-use-surrealdb-with-the-fresh-framework-and-deno.md": {
	id: "how-to-use-surrealdb-with-the-fresh-framework-and-deno.md";
  slug: "how-to-use-surrealdb-with-the-fresh-framework-and-deno";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"improve-database-management-with-surrealdb.md": {
	id: "improve-database-management-with-surrealdb.md";
  slug: "improve-database-management-with-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"integrate-auth0-as-an-authentication-provider.md": {
	id: "integrate-auth0-as-an-authentication-provider.md";
  slug: "integrate-auth0-as-an-authentication-provider";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"integrate-aws-cognito-as-an-authentication-provider.md": {
	id: "integrate-aws-cognito-as-an-authentication-provider.md";
  slug: "integrate-aws-cognito-as-an-authentication-provider";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"iot-telemetry-example.md": {
	id: "iot-telemetry-example.md";
  slug: "iot-telemetry-example";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"kards-social-foss-social-media-app.md": {
	id: "kards-social-foss-social-media-app.md";
  slug: "kards-social-foss-social-media-app";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"kysely-surrealdb.md": {
	id: "kysely-surrealdb.md";
  slug: "kysely-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"langchain-integration.md": {
	id: "langchain-integration.md";
  slug: "langchain-integration";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"livestream-series-documenting-learning-surrealdb.md": {
	id: "livestream-series-documenting-learning-surrealdb.md";
  slug: "livestream-series-documenting-learning-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"make-a-genai-chatbot-using-graphrag-with-surrealdb-langchain.md": {
	id: "make-a-genai-chatbot-using-graphrag-with-surrealdb-langchain.md";
  slug: "make-a-genai-chatbot-using-graphrag-with-surrealdb-langchain";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"medical-graphrag-chatbot-rust-langchain.md": {
	id: "medical-graphrag-chatbot-rust-langchain.md";
  slug: "medical-graphrag-chatbot-rust-langchain";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"minimal-langchain-chatbot-example-with-vector-and-graph.md": {
	id: "minimal-langchain-chatbot-example-with-vector-and-graph.md";
  slug: "minimal-langchain-chatbot-example-with-vector-and-graph";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"network-capabilities-in-surreal-cloud.md": {
	id: "network-capabilities-in-surreal-cloud.md";
  slug: "network-capabilities-in-surreal-cloud";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"nextjs-surrealdb-demo-basic-blog-that-serves-as-a-demo-template-for-your-nextjs-surrealdb-project.md": {
	id: "nextjs-surrealdb-demo-basic-blog-that-serves-as-a-demo-template-for-your-nextjs-surrealdb-project.md";
  slug: "nextjs-surrealdb-demo-basic-blog-that-serves-as-a-demo-template-for-your-nextjs-surrealdb-project";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"playrbase-event-player-management-system.md": {
	id: "playrbase-event-player-management-system.md";
  slug: "playrbase-event-player-management-system";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"pterodactyl-egg.md": {
	id: "pterodactyl-egg.md";
  slug: "pterodactyl-egg";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"pydantic-ai.md": {
	id: "pydantic-ai.md";
  slug: "pydantic-ai";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"pysurrealdb.md": {
	id: "pysurrealdb.md";
  slug: "pysurrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"ra-surrealdb.md": {
	id: "ra-surrealdb.md";
  slug: "ra-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"relational-style-relationships-in-surrealdb.md": {
	id: "relational-style-relationships-in-surrealdb.md";
  slug: "relational-style-relationships-in-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"run-surrealdb-in-your-browser-using-our-wasm-engine.md": {
	id: "run-surrealdb-in-your-browser-using-our-wasm-engine.md";
  slug: "run-surrealdb-in-your-browser-using-our-wasm-engine";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"run-surrealdb-inside-nodejs-using-our-nodejs-engine.md": {
	id: "run-surrealdb-inside-nodejs-using-our-nodejs-engine.md";
  slug: "run-surrealdb-inside-nodejs-using-our-nodejs-engine";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"rust-powered-database-surrealdb-its-pretty-ambitious-code-to-the-moon.md": {
	id: "rust-powered-database-surrealdb-its-pretty-ambitious-code-to-the-moon.md";
  slug: "rust-powered-database-surrealdb-its-pretty-ambitious-code-to-the-moon";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"schemaless-vs-schemafull-databases.md": {
	id: "schemaless-vs-schemafull-databases.md";
  slug: "schemaless-vs-schemafull-databases";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"semantic-search-rust-using-mistralai.md": {
	id: "semantic-search-rust-using-mistralai.md";
  slug: "semantic-search-rust-using-mistralai";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"semantic-search-rust-using-openai.md": {
	id: "semantic-search-rust-using-openai.md";
  slug: "semantic-search-rust-using-openai";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"setting-up-an-invite-system.md": {
	id: "setting-up-an-invite-system.md";
  slug: "setting-up-an-invite-system";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"simple-api-with-gingonic-and-surrealdb-go.md": {
	id: "simple-api-with-gingonic-and-surrealdb-go.md";
  slug: "simple-api-with-gingonic-and-surrealdb-go";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"sirqle.md": {
	id: "sirqle.md";
  slug: "sirqle";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"smig.md": {
	id: "smig.md";
  slug: "smig";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"starter-kit-for-surrealdb-tauri-next-js.md": {
	id: "starter-kit-for-surrealdb-tauri-next-js.md";
  slug: "starter-kit-for-surrealdb-tauri-next-js";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surreal-4o-fine-tuned-model-datasets-for-surrealql-queries-project-to-create-structured-datasets-for-openai.md": {
	id: "surreal-4o-fine-tuned-model-datasets-for-surrealql-queries-project-to-create-structured-datasets-for-openai.md";
  slug: "surreal-4o-fine-tuned-model-datasets-for-surrealql-queries-project-to-create-structured-datasets-for-openai";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surreal-codegen.md": {
	id: "surreal-codegen.md";
  slug: "surreal-codegen";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surreal-id.md": {
	id: "surreal-id.md";
  slug: "surreal-id";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surreal-transfer.md": {
	id: "surreal-transfer.md";
  slug: "surreal-transfer";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surreal-ts.md": {
	id: "surreal-ts.md";
  slug: "surreal-ts";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-1.md": {
	id: "surrealdb-1.md";
  slug: "surrealdb-1";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-admin.md": {
	id: "surrealdb-admin.md";
  slug: "surrealdb-admin";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-ai-assistant.md": {
	id: "surrealdb-ai-assistant.md";
  slug: "surrealdb-ai-assistant";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-ai-docs-retrieval-project-to-showcase-how-to-build-a-gpt-based-question-answering-system-on-top-of-surrealdb-docs.md": {
	id: "surrealdb-ai-docs-retrieval-project-to-showcase-how-to-build-a-gpt-based-question-answering-system-on-top-of-surrealdb-docs.md";
  slug: "surrealdb-ai-docs-retrieval-project-to-showcase-how-to-build-a-gpt-based-question-answering-system-on-top-of-surrealdb-docs";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-as-a-vector-store-for-langchain-a-jupyter-notebook-demonstrating-how-to-use-surrealdb-as-a-vector-store.md": {
	id: "surrealdb-as-a-vector-store-for-langchain-a-jupyter-notebook-demonstrating-how-to-use-surrealdb-as-a-vector-store.md";
  slug: "surrealdb-as-a-vector-store-for-langchain-a-jupyter-notebook-demonstrating-how-to-use-surrealdb-as-a-vector-store";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-c.md": {
	id: "surrealdb-c.md";
  slug: "surrealdb-c";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-client-generator.md": {
	id: "surrealdb-client-generator.md";
  slug: "surrealdb-client-generator";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-cloudflare.md": {
	id: "surrealdb-cloudflare.md";
  slug: "surrealdb-cloudflare";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-cr.md": {
	id: "surrealdb-cr.md";
  slug: "surrealdb-cr";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-erlang.md": {
	id: "surrealdb-erlang.md";
  slug: "surrealdb-erlang";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-explorer.md": {
	id: "surrealdb-explorer.md";
  slug: "surrealdb-explorer";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-extras.md": {
	id: "surrealdb-extras.md";
  slug: "surrealdb-extras";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-fastapi-nextjs-starter.md": {
	id: "surrealdb-fastapi-nextjs-starter.md";
  slug: "surrealdb-fastapi-nextjs-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-flask-starter.md": {
	id: "surrealdb-flask-starter.md";
  slug: "surrealdb-flask-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-flutter.md": {
	id: "surrealdb-flutter.md";
  slug: "surrealdb-flutter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-fundamentals-course-official-course-to-efficiently-learn-surrealdb-in-3-hours.md": {
	id: "surrealdb-fundamentals-course-official-course-to-efficiently-learn-surrealdb-in-3-hours.md";
  slug: "surrealdb-fundamentals-course-official-course-to-efficiently-learn-surrealdb-in-3-hours";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-github-action.md": {
	id: "surrealdb-github-action.md";
  slug: "surrealdb-github-action";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-go-driver-starter.md": {
	id: "surrealdb-go-driver-starter.md";
  slug: "surrealdb-go-driver-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-go.md": {
	id: "surrealdb-go.md";
  slug: "surrealdb-go";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-grafana-datasource.md": {
	id: "surrealdb-grafana-datasource.md";
  slug: "surrealdb-grafana-datasource";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-in-100-seconds.md": {
	id: "surrealdb-in-100-seconds.md";
  slug: "surrealdb-in-100-seconds";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-java.md": {
	id: "surrealdb-java.md";
  slug: "surrealdb-java";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-js.md": {
	id: "surrealdb-js.md";
  slug: "surrealdb-js";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-koa-starter-rest-api.md": {
	id: "surrealdb-koa-starter-rest-api.md";
  slug: "surrealdb-koa-starter-rest-api";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-mcp-server.md": {
	id: "surrealdb-mcp-server.md";
  slug: "surrealdb-mcp-server";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-migrations-action.md": {
	id: "surrealdb-migrations-action.md";
  slug: "surrealdb-migrations-action";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-migrations.md": {
	id: "surrealdb-migrations.md";
  slug: "surrealdb-migrations";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-net.md": {
	id: "surrealdb-net.md";
  slug: "surrealdb-net";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-node.md": {
	id: "surrealdb-node.md";
  slug: "surrealdb-node";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-nuxt-3-starter.md": {
	id: "surrealdb-nuxt-3-starter.md";
  slug: "surrealdb-nuxt-3-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-odatav4-connector.md": {
	id: "surrealdb-odatav4-connector.md";
  slug: "surrealdb-odatav4-connector";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-php.md": {
	id: "surrealdb-php.md";
  slug: "surrealdb-php";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-presence-demo-demo-project-on-how-to-create-a-realtime-presence-web-application-using-surrealdb-live-queries.md": {
	id: "surrealdb-presence-demo-demo-project-on-how-to-create-a-realtime-presence-web-application-using-surrealdb-live-queries.md";
  slug: "surrealdb-presence-demo-demo-project-on-how-to-create-a-realtime-presence-web-application-using-surrealdb-live-queries";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-py.md": {
	id: "surrealdb-py.md";
  slug: "surrealdb-py";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-react-nodejs-starter.md": {
	id: "surrealdb-react-nodejs-starter.md";
  slug: "surrealdb-react-nodejs-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-rocket.md": {
	id: "surrealdb-rocket.md";
  slug: "surrealdb-rocket";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-rust-embedded-database-quick-tutorial.md": {
	id: "surrealdb-rust-embedded-database-quick-tutorial.md";
  slug: "surrealdb-rust-embedded-database-quick-tutorial";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-sandbox-an-offline-browser-based-playground-for-experimenting-with-surrealdb.md": {
	id: "surrealdb-sandbox-an-offline-browser-based-playground-for-experimenting-with-surrealdb.md";
  slug: "surrealdb-sandbox-an-offline-browser-based-playground-for-experimenting-with-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-solidstart-starter.md": {
	id: "surrealdb-solidstart-starter.md";
  slug: "surrealdb-solidstart-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-spring-client.md": {
	id: "surrealdb-spring-client.md";
  slug: "surrealdb-spring-client";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-springboot.md": {
	id: "surrealdb-springboot.md";
  slug: "surrealdb-springboot";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-streamlit-starter.md": {
	id: "surrealdb-streamlit-starter.md";
  slug: "surrealdb-streamlit-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-surrealdb.md": {
	id: "surrealdb-surrealdb.md";
  slug: "surrealdb-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-sveltekit-auth-example.md": {
	id: "surrealdb-sveltekit-auth-example.md";
  slug: "surrealdb-sveltekit-auth-example";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-sveltekit-starter.md": {
	id: "surrealdb-sveltekit-starter.md";
  slug: "surrealdb-sveltekit-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-sveltekit.md": {
	id: "surrealdb-sveltekit.md";
  slug: "surrealdb-sveltekit";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-the-kitchen-sink-document-store-that-might-dethrone-firebase.md": {
	id: "surrealdb-the-kitchen-sink-document-store-that-might-dethrone-firebase.md";
  slug: "surrealdb-the-kitchen-sink-document-store-that-might-dethrone-firebase";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-valibot.md": {
	id: "surrealdb-valibot.md";
  slug: "surrealdb-valibot";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-vector-store-for-langchain.md": {
	id: "surrealdb-vector-store-for-langchain.md";
  slug: "surrealdb-vector-store-for-langchain";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-vue-blog-starter.md": {
	id: "surrealdb-vue-blog-starter.md";
  slug: "surrealdb-vue-blog-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-vue-starter.md": {
	id: "surrealdb-vue-starter.md";
  slug: "surrealdb-vue-starter";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-wasm.md": {
	id: "surrealdb-wasm.md";
  slug: "surrealdb-wasm";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-x-openai-example-of-rag-using-surrealdb-and-openai.md": {
	id: "surrealdb-x-openai-example-of-rag-using-surrealdb-and-openai.md";
  slug: "surrealdb-x-openai-example-of-rag-using-surrealdb-and-openai";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb-zod.md": {
	id: "surrealdb-zod.md";
  slug: "surrealdb-zod";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb.md": {
	id: "surrealdb.md";
  slug: "surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb_dsl.md": {
	id: "surrealdb_dsl.md";
  slug: "surrealdb_dsl";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb_extra.md": {
	id: "surrealdb_extra.md";
  slug: "surrealdb_extra";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb_migration_engine.md": {
	id: "surrealdb_migration_engine.md";
  slug: "surrealdb_migration_engine";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealdb_query_builder.md": {
	id: "surrealdb_query_builder.md";
  slug: "surrealdb_query_builder";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealised.md": {
	id: "surrealised.md";
  slug: "surrealised";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealist-1.md": {
	id: "surrealist-1.md";
  slug: "surrealist-1";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealist-for-power-users.md": {
	id: "surrealist-for-power-users.md";
  slug: "surrealist-for-power-users";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealist.md": {
	id: "surrealist.md";
  slug: "surrealist";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealml-vs-pytorch-vs-onnx-benchmarking-the-performance-of-surrealml-against-pytorch-and-onnx-vladimir-rotariu.md": {
	id: "surrealml-vs-pytorch-vs-onnx-benchmarking-the-performance-of-surrealml-against-pytorch-and-onnx-vladimir-rotariu.md";
  slug: "surrealml-vs-pytorch-vs-onnx-benchmarking-the-performance-of-surrealml-against-pytorch-and-onnx-vladimir-rotariu";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"surrealreact.md": {
	id: "surrealreact.md";
  slug: "surrealreact";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"sveltekit-surreal-database-authentication.md": {
	id: "sveltekit-surreal-database-authentication.md";
  slug: "sveltekit-surreal-database-authentication";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"tour-of-surrealdb-course-to-learn-basics-in-30-minutes.md": {
	id: "tour-of-surrealdb-course-to-learn-basics-in-30-minutes.md";
  slug: "tour-of-surrealdb-course-to-learn-basics-in-30-minutes";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"type-surrealdb.md": {
	id: "type-surrealdb.md";
  slug: "type-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"understanding-user-groups-in-surrealdb.md": {
	id: "understanding-user-groups-in-surrealdb.md";
  slug: "understanding-user-groups-in-surrealdb";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"unlocking-surrealdb-building-a-real-world-multi-tenant-rbac-system-made-easy-4-part-series.md": {
	id: "unlocking-surrealdb-building-a-real-world-multi-tenant-rbac-system-made-easy-4-part-series.md";
  slug: "unlocking-surrealdb-building-a-real-world-multi-tenant-rbac-system-made-easy-4-part-series";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"unlocking-the-future-of-ai-secure-intelligent-retrieval-with-openai.md": {
	id: "unlocking-the-future-of-ai-secure-intelligent-retrieval-with-openai.md";
  slug: "unlocking-the-future-of-ai-secure-intelligent-retrieval-with-openai";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"unreal-orm.md": {
	id: "unreal-orm.md";
  slug: "unreal-orm";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"use-surrealdb-in-github-actions.md": {
	id: "use-surrealdb-in-github-actions.md";
  slug: "use-surrealdb-in-github-actions";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"use-surrealdb-with-langchain.md": {
	id: "use-surrealdb-with-langchain.md";
  slug: "use-surrealdb-with-langchain";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"using-surrealdb-to-prove-football-statistics.md": {
	id: "using-surrealdb-to-prove-football-statistics.md";
  slug: "using-surrealdb-to-prove-football-statistics";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
"working-with-surrealdb-over-http-via-postman.md": {
	id: "working-with-surrealdb-over-http-via-postman.md";
  slug: "working-with-surrealdb-over-http-via-postman";
  body: string;
  collection: "labs-items";
  data: InferEntrySchema<"labs-items">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
