import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/instances").map((entry) =>
        entry.slug === "" ? "/manage/instances" : `/manage/instances/${entry.slug}`,
    );
}
