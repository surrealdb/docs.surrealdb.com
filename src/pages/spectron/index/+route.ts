import type { PageContext } from "vike/types";

/**
 * First path segment after `/spectron` for pages in the `spectron/index`
 * content collection. Other Spectron areas (memory, cookbooks, …) have
 * their own `+route.ts` under `pages/spectron/<section>/`.
 */
const INDEX_FIRST_SEGMENTS = new Set(["welcome", "quickstarts", "mental-model"]);

export default function route({ urlPathname }: PageContext) {
    const path = urlPathname.replace(/\/$/, "") || "/";
    if (path === "/spectron") {
        return true;
    }

    const match = /^\/spectron\/([^/]+)/.exec(path);
    if (!match) {
        return false;
    }

    return INDEX_FIRST_SEGMENTS.has(match[1]);
}
