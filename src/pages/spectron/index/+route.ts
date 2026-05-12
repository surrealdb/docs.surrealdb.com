import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    const path = urlPathname.replace(/\/$/, "") || "/";
    return path === "/spectron";
}
