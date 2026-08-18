import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/organisations").map((entry) =>
        entry.slug === "" ? "/manage/organisations" : `/manage/organisations/${entry.slug}`,
    );
}
