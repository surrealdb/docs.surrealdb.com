import type { PageContext } from "vike/types";

export default function route({ urlPathname }: PageContext) {
    return (
        urlPathname === "/operate/organisations" ||
        urlPathname.startsWith("/operate/organisations/")
    );
}
