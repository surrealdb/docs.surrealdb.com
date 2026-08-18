import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

import { redirectDestinationForDev, resolveRedirect } from "../redirects";

const SKIP_PREFIXES = ["/@", "/assets/", "/__vite", "/favicon"];

/** Removes Vite's `/docs` base so a pathname matches the deployed redirect sources. */
function stripDocsBase(pathname: string): string {
    if (pathname === "/docs") {
        return "/";
    }
    return pathname.startsWith("/docs/") ? pathname.slice("/docs".length) : pathname;
}

/**
 * Applies the same redirect rules as vercel.ts during `vike dev` and `vike preview`.
 * Vercel reads redirects at deploy time; Vite does not.
 */
export function viteDevRedirects(mode: string): Plugin {
    if (mode === "production") {
        return { name: "vite-dev-redirects" };
    }

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

        // In production the www rewrite strips `/docs` before this project sees the
        // request, so redirect sources are authored without it. Vite serves under
        // `base: "/docs"`, so the same rule only matches once the base is removed.
        // The unstripped path is still tried afterwards, because older helpers also
        // register `/docs/…` variants that are inert in production but match here.
        const match = resolveRedirect(stripDocsBase(pathname)) ?? resolveRedirect(pathname);
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
