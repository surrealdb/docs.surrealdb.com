import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/enterprise").map((entry) =>
        entry.slug === "" ? "/manage/enterprise" : `/manage/enterprise/${entry.slug}`,
    );
}
