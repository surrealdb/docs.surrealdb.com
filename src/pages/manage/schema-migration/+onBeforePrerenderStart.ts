import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/schema-migration").map((entry) =>
        entry.slug === "" ? "/manage/schema-migration" : `/manage/schema-migration/${entry.slug}`,
    );
}
