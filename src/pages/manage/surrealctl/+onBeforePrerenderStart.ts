import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/surrealctl").map((entry) =>
        entry.slug === "" ? "/manage/surrealctl" : `/manage/surrealctl/${entry.slug}`,
    );
}
