import { type Sdk, sdks } from "@content/config";
import type { PageContext } from "vike/types";

/**
 * This route file needed for routing during development.
 */
export default function route({ urlPathname }: PageContext) {
    const parts = urlPathname.split("/");
    const [sdk] = parts.slice(2);

    if (!sdks.includes(sdk as Sdk)) {
        return false;
    }

    return {
        routeParams: {
            sdk: sdk as Sdk,
        },
    };
}
