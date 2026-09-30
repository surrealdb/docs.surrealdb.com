import type { VercelRequest, VercelResponse } from "@vercel/node";

import { handleSearchRequest } from "../src/lib/api/search";
import { sendWebResponse, toWebRequest } from "./_adapter";

/**
 * Vercel's view of the search endpoint.
 *
 * The implementation is in `src/lib/api/search.ts` and is a plain
 * `Request -> Response` function, so the Cloudflare Worker serves the same code
 * from `src/pages/+server.ts` without a second copy or a proxy back here. This
 * file is the Vercel adapter and nothing else; it goes when Vercel does.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    return sendWebResponse(res, await handleSearchRequest(toWebRequest(req)));
}
