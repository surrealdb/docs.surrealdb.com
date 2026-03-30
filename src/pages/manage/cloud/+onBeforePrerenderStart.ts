import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/cloud").map((entry) =>
        entry.slug === "" ? "/manage/cloud" : `/manage/cloud/${entry.slug}`,
    );
}
