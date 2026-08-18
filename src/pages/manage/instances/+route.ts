import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    return urlPathname === "/manage/instances" || urlPathname.startsWith("/manage/instances/");
}
