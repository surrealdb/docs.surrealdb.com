// Import all images at build time from assets directory
const imageModules = import.meta.glob<{ default: string }>(
    "../assets/img/**/*.{png,jpg,jpeg,webp}",
    {
        eager: true,
    },
);

// Create a unified mapping from various path formats to the imported image URL
const imageMap: Record<string, string> = {};

for (const [path, module] of Object.entries(imageModules)) {
    const url = module.default;

    // Extract parts from path: "../assets/img/pages/events/webinar/2026-02-04.png"
    const relativePath = path.replace(/^\.\.\/assets\//, "");
    const filename = path.split("/").pop() || "";
    const slug = filename.replace(/\.(png|jpg|jpeg|webp)$/i, "");

    // Map by full @assets path: "@assets/img/pages/events/webinar/2026-02-04.png"
    const assetsPath = `@assets/${relativePath}`;
    imageMap[assetsPath] = url;

    // Map by /assets path: "/assets/img/pages/events/webinar/2026-02-04.png"
    const publicPath = `/assets/${relativePath}`;
    imageMap[publicPath] = url;

    // Map by relative path: "img/pages/events/webinar/2026-02-04.png"
    imageMap[relativePath] = url;

    // Map by original path: "../assets/img/pages/events/webinar/2026-02-04.png"
    imageMap[path] = url;

    // For files in specific directories, also map by filename and slug
    if (relativePath.startsWith("ambassadors/") || relativePath.startsWith("headshots/")) {
        // Map by filename: "abhishek-das.png"
        if (filename) {
            imageMap[filename] = url;
        }

        // Map by slug (without extension): "abhishek-das"
        if (slug) {
            imageMap[slug] = url;
        }
    }
}

/**
 * Get the URL for an image by various path formats.
 * Supports:
 * - @assets paths: "@assets/img/pages/events/webinar/2026-02-04.png"
 * - /assets paths: "/assets/img/pages/events/webinar/2026-02-04.png"
 * - Relative paths: "img/pages/events/webinar/2026-02-04.png"
 * - Filenames (for ambassadors/headshots): "abhishek-das.png"
 * - Slugs (for ambassadors/headshots): "abhishek-das"
 * - Full paths: "../assets/img/pages/events/webinar/2026-02-04.png"
 *
 * Returns undefined if the image is not found.
 */
export function getImageUrl(imagePath: string | undefined): string | undefined {
    if (!imagePath) return undefined;

    // If it's already a full URL, return it
    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    // Check if it's already in our map
    if (imageMap[imagePath]) {
        return imageMap[imagePath];
    }

    // Try converting @assets to /assets and check
    if (imagePath.startsWith("@assets")) {
        const publicPath = imagePath.replace("@assets", "/assets");
        if (imageMap[publicPath]) {
            return imageMap[publicPath];
        }
    }

    // Try converting /assets to @assets and check
    if (imagePath.startsWith("/assets")) {
        const assetsPath = imagePath.replace("/assets", "@assets");
        if (imageMap[assetsPath]) {
            return imageMap[assetsPath];
        }
    }

    return undefined;
}
