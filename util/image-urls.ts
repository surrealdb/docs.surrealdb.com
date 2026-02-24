import { getImageUrl as getBundledImageUrl } from "@lib/images";
import { type AnyNode, type Root, visit } from "@surrealdb/ui";

/**
 * Get the URL for an image, handling brandsafe CDN URLs and bundled images.
 *
 * @param imageId - The image identifier (can be a URL, brandsafe ID, @assets path, etc.)
 * @param options - Optional configuration
 * @param options.width - The desired width for brandsafe CDN images (default: 1200)
 * @param options.quality - The quality for brandsafe CDN images (default: 80)
 * @param options.collection - The collection directory to search in (e.g., "ambassadors", "headshots")
 * @returns The resolved image URL or undefined
 */
export function getImageUrl(
    imageId: string | undefined,
    options?: {
        width?: number;
        quality?: number;
        collection?: string;
    },
): string | undefined {
    if (!imageId) return undefined;

    const width = options?.width ?? 1200;
    const quality = options?.quality ?? 80;
    const collection = options?.collection;

    // If it's already a full URL, return it
    if (imageId.startsWith("http")) return imageId;

    // Try to get bundled image URL first
    const bundledUrl = getBundledImageUrl(imageId);
    if (bundledUrl) return bundledUrl;

    // If collection is specified and imageId looks like a filename (no path),
    // try looking it up in the collection directory
    if (collection && imageId.includes(".") && !imageId.includes("/")) {
        const collectionPath = getBundledImageUrl(`/assets/img/${collection}/${imageId}`);
        if (collectionPath) return collectionPath;
    }

    // Handle @assets paths
    if (imageId.startsWith("@assets")) {
        return imageId.replace("@assets", "/assets");
    }

    // Handle brandsafe CDN IDs (20 character alphanumeric strings)
    if (imageId.length === 20 && /^[a-zA-Z0-9]+$/.test(imageId)) {
        return `https://cdn.brandsafe.io/w(${width})q(${quality})/${imageId}.auto`;
    }

    return imageId;
}

export function resolveAstImages(ast: Root | AnyNode) {
    visit(ast, "image", (node) => {
        node.src = getImageUrl(node.src) ?? node.src;
        if (node.darkSrc) {
            node.darkSrc = getImageUrl(node.darkSrc) ?? node.darkSrc;
        }
    });
}
