import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    return urlPathname === "/explore/cli" || urlPathname.startsWith("/explore/cli/");
}
