import vike, { type App } from "@vikejs/hono";
import { Hono } from "hono";
import type { Server } from "vike/types";
import { composeRawMarkdown, resolveCollectionEntry } from "~/utils/collections";

const BASE = "/docs";

const app = new Hono();

// Serve a page's raw markdown when its URL is suffixed with `.md`
// (e.g. `/docs/reference/query-language/statements/select.md`). Registered
// before Vike so it wins over Vike's catch-all route.
app.get("*", async (c, next) => {
    const { pathname } = new URL(c.req.url);

    if (!pathname.endsWith(".md")) {
        return next();
    }

    const path = pathname.slice(0, -".md".length).replace(new RegExp(`^${BASE}`), "");
    const entry = resolveCollectionEntry(path);

    if (!entry) {
        return c.text("Not Found", 404);
    }

    return c.body(composeRawMarkdown(entry), 200, {
        "Content-Type": "text/markdown; charset=utf-8",
    });
});

vike(app as unknown as App);

const honoFetch = app.fetch.bind(app);

// The docs Vercel function deploys at `/`, but Vike is configured with
// `base: "/docs"`. In production the surrealdb.com CDN strips the prefix
// before forwarding, and on Vercel preview/direct access the prefix is
// absent altogether. Re-attach `/docs` here so Vike's `checkBaseUrl`
// accepts the request.
const fetch: Server["fetch"] = (request) => {
    const url = new URL(request.url);
    if (!url.pathname.startsWith(BASE)) {
        url.pathname = url.pathname === "/" ? BASE : `${BASE}${url.pathname}`;
        request = new Request(url.toString(), request);
    }
    return honoFetch(request);
};

export default { fetch } satisfies Server;
