import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    const base = "/reference/golang";
    return urlPathname === base || urlPathname.startsWith(`${base}/`);
}
