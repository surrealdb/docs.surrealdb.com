import type { PageContext } from "vike/types";

/**
 * This route file needed for routing during development.
 */
export default function route({ urlPathname }: PageContext) {
    return urlPathname.startsWith("/surrealdb");
}
