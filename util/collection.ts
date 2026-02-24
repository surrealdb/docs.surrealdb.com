import type { CollectionName } from "@lib/content";

/**
 * Reference to the collection to the SDK's - https://surrealdb.com/docs/sdk/javascript
 * Reference to the collection to the docs - https://surrealdb.com/docs/<collection>/<slug>
 * Slug can be having multiple parts separated by a slash. like: /docs/sdk/javascript/api/core/surreal
 * @param urlPathname - The URL pathname to get the collection reference from.
 */
export function getEntryReferenceFromURL(urlPathname: string): CollectionName {
    const parts = urlPathname.split("/");
    const collection = parts[1];

    if (collection === "sdk") {
        return `doc-sdk-${parts[2]}` as CollectionName;
    }

    return `doc-${collection}` as CollectionName;
}

export function getCollectionPartsFromURL(urlPathname: string, sliceIndex: number = 3): string[] {
    const parts: string[] = urlPathname.split("/").slice(sliceIndex);

    if (parts.length === 0) {
        return [...parts, "index"];
    }

    return parts;
}
