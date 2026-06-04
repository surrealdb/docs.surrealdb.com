import type { PageContext } from "vike/types";
import { resolveDataFromCollection } from "~/utils/data";

export default async function data(context: PageContext) {
    return resolveDataFromCollection(context, "spectron/agent-memory", "spectron/agent-memory");
}
