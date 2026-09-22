import type { VercelConfig } from "@vercel/config/v1";

import { docsRedirects } from "./redirects";
import { cleanUrls, headers, trailingSlash } from "./routes";

/**
 * The Vercel deployment's configuration.
 *
 * Everything of substance lives in `routes.ts` and `redirects.ts`, neither of
 * which names a platform. This file is the Vercel-shaped view of them, plus the
 * one rule that is a property of this deployment rather than of the site: the
 * apex project proxies `/docs/*` here with the prefix stripped, so a request
 * that still carries `/docs` is one that reached this project directly and is
 * sent back to the canonical URL.
 *
 * The Cloudflare Worker reads `routes.ts` directly and never loads this file,
 * so retiring Vercel is a matter of deleting it.
 */
export const config: VercelConfig = {
    cleanUrls,
    trailingSlash,
    redirects: docsRedirects,
    rewrites: [
        {
            source: "/docs",
            destination: "/",
            statusCode: 302,
        },
        {
            source: "/docs/(.*)",
            destination: "/$1",
            statusCode: 302,
        },
    ],
    headers,
};
