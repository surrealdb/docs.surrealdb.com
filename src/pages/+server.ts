import vike from "@vikejs/hono";
import { Hono } from "hono";
import type { Server } from "vike/types";

const BASE = "/docs";

const app = new Hono();
vike(app);

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
