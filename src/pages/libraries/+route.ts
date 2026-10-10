import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    const base = "/libraries";
    return urlPathname === base || urlPathname.startsWith(`${base}/`);
}
