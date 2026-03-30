import type { PageContext } from "vike/types";
import { resolveDataFromCollection } from "~/utils/data";

export default async function data(context: PageContext) {
    return resolveDataFromCollection(context, "manage/cloud");
}

export type PageData = Awaited<ReturnType<typeof data>>;
