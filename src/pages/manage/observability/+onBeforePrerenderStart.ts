import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/observability").map((entry) =>
        entry.slug === "" ? "/manage/observability" : `/manage/observability/${entry.slug}`,
    );
}
