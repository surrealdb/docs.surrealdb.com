import type { CollectionMap } from "vike-content-collection";
import { getCollection } from "vike-content-collection";

/**
 * Enumerate all URLs for a content collection section.
 *
 * Mirrors the logic in each section's +onBeforePrerenderStart.ts so the
 * sitemap generator discovers the same set of URLs that would be prerendered
 * in SSG mode.
 *
 * @param collectionId - The vike-content-collection collection name
 * @param urlPrefix    - The URL prefix for the section, with leading slash
 *                       (e.g. "/build/ai-agents"). Pass "/" for the root index.
 */
export function collectionSitemapUrls(
	collectionId: keyof CollectionMap,
	urlPrefix: string,
): string[] {
	const base = urlPrefix === "/" ? "" : urlPrefix;
	return getCollection(collectionId).map((entry) =>
		entry.slug === "" ? urlPrefix : `${base}/${entry.slug}`,
	).filter((url) => !url.endsWith("__category"));
}
