import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    const base = "/reference/dotnet";
    return urlPathname === base || urlPathname.startsWith(`${base}/`);
}
