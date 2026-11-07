import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Translates between Vercel's Node function signature and the web `Request` /
 * `Response` pair the handlers in `src/lib/api/` are written against.
 *
 * Those handlers are platform-neutral so that the Cloudflare Worker can serve
 * them directly; this file is the only thing that knows about Vercel, and it is
 * deleted along with the rest of `api/` when Vercel is retired.
 *
 * A leading `_` keeps it out of Vercel's function routing - only `api/*.ts`
 * without the prefix become endpoints.
 */

/** The host is irrelevant to the handlers; only the path and query are read. */
const ORIGIN = "https://surrealdb.com";

export function toWebRequest(req: VercelRequest): Request {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
            for (const item of value) headers.append(key, item);
        } else if (value !== undefined) {
            headers.set(key, value);
        }
    }

    // Vercel has already parsed a JSON body by the time the handler runs, so
    // the stream is spent and it is re-serialised here rather than piped. The
    // endpoints take small JSON documents, which is the only reason that is
    // reasonable; a large or streaming body would need the raw request.
    const hasBody = req.method !== "GET" && req.method !== "HEAD" && req.body !== undefined;
    const body =
        hasBody && typeof req.body !== "string"
            ? JSON.stringify(req.body)
            : (req.body ?? undefined);

    return new Request(new URL(req.url ?? "/", ORIGIN), {
        method: req.method ?? "GET",
        headers,
        body: hasBody ? body : undefined,
    });
}

export async function sendWebResponse(res: VercelResponse, response: Response): Promise<void> {
    for (const [key, value] of response.headers) {
        res.setHeader(key, value);
    }
    res.status(response.status);
    const text = await response.text();
    res.end(text.length > 0 ? text : undefined);
}
