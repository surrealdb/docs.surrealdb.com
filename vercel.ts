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
};
