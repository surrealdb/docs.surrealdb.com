import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

import { redirectDestinationForDev, resolveRedirect } from "../redirects";

const SKIP_PREFIXES = ["/@", "/assets/", "/__vite", "/favicon"];

/**
 * Applies the same redirect rules as vercel.ts during `vike dev` and `vike preview`.
 * Vercel reads redirects at deploy time; Vite does not.
 */
export function viteDevRedirects(): Plugin {
    return {
        name: "vite-dev-redirects",
        configureServer(server) {
            server.middlewares.use(createRedirectMiddleware());
        },
        configurePreviewServer(server) {
            server.middlewares.use(createRedirectMiddleware());
        },
    };
}

function createRedirectMiddleware() {
    return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const raw = req.url ?? "/";
        const q = raw.indexOf("?");
        const pathname = (q === -1 ? raw : raw.slice(0, q)).replace(/\/$/, "") || "/";

        if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
            next();
            return;
        }

        const match = resolveRedirect(pathname);
        if (!match) {
            next();
            return;
        }

        const location = redirectDestinationForDev(match.destination);
        const search = q === -1 ? "" : raw.slice(q);
        res.writeHead(match.statusCode, { Location: `${location}${search}` });
        res.end();
    };
}
