import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    return urlPathname.startsWith("/learn/data-models");
}
