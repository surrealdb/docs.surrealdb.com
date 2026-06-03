import { redirect } from "vike/abort";
import type { PageContext } from "vike/types";
import { getParentPathname } from "~/utils/data";

/**
 * 404: walk up to the parent path. `throw redirect()` is an HTTP 302 with a
 * `Location` header (https://vike.dev/redirect), not a client-only navigation.
 * Missing doc entries in `resolveDataFromCollection` redirect there first, so
 * this mostly covers 404s from non-collection routes.
 */
export default function data(pageContext: PageContext) {
    const isNotFound = pageContext.is404 === true || pageContext.abortStatusCode === 404;

    if (!isNotFound) {
        return null;
    }

    const parent = getParentPathname(pageContext.urlOriginal);

    if (parent) {
        throw redirect(parent, 302);
    }

    return null;
}
