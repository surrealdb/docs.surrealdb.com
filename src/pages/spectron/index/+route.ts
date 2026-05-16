import type { PageContext } from "vike/types";

/** First path segment after `/spectron/` owned by another Spectron page tree. */
const SPECTRON_SIBLING_SECTIONS = new Set([
    "cookbooks",
    "integrations",
    "knowledge",
    "memory",
    "reference",
    "self-hosting",
]);

export default function route({ urlPathname }: PageContext) {
    const path = urlPathname.replace(/\/$/, "") || "/";
    if (path === "/spectron") return true;
    if (!path.startsWith("/spectron/")) return false;
    const rest = path.slice("/spectron/".length);
    const top = rest.split("/")[0] ?? "";
    return !SPECTRON_SIBLING_SECTIONS.has(top);
}
