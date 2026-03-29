import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
    cleanUrls: true,
    trailingSlash: false,
    rewrites: [
        // Redirect /docs to the root
        {
            source: "/docs",
            destination: "/",
        },
        {
            source: "/docs/(.*)",
            destination: "/$1",
        },
    ],
    headers: [
        // Cache Vite build assets for 1 year
        {
            source: "/assets/(.*)",
            headers: [
                {
                    key: "Cache-Control",
                    value: "public, max-age=31536000, immutable",
                },
            ],
        },
    ],
};
