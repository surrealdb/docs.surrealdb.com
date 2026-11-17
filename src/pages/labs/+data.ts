import { getLabItems } from "~/utils/collections";

export default function data() {
    return { items: getLabItems() };
}

export type LabsPageData = ReturnType<typeof data>;
