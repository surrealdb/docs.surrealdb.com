import { render } from "vike/abort";
import type { PageContext } from "vike/types";
import { getCollectionEntry } from "vike-content-collection";
import { useConfig } from "vike-react/useConfig";
import { getCollectionPartsFromURL } from "~/utils/collection";
import { resolveMarkdown } from "~/utils/markdown";
import { getSidebarItemsFromCollection } from "~/utils/sidebar";

export default async function data(context: PageContext) {
	// biome-ignore lint/correctness/useHookAtTopLevel: <ignore>
	const config = useConfig();
	const id = "doc-surrealkv" as const;

	const parts = getCollectionPartsFromURL(context.urlPathname, 2);
	const entry = getCollectionEntry(id, parts.join("/"));

	if (!entry) {
		throw render(404, "Not Found");
	}

	if (entry.metadata.title) {
		config({ title: entry.metadata.title });
	}

	if (entry.metadata.description) {
		config({ description: entry.metadata.description });
	}

	const { ast, headings } = resolveMarkdown(entry.content);
	const sidebar = getSidebarItemsFromCollection(id);
	const contentPath = entry.filePath.replace(/.*\/content\//, "");

	return {
		ast,
		headings,
		sidebar,
		contentPath,
	};
}

export type SurrealKVPageData = Awaited<ReturnType<typeof data>>;
