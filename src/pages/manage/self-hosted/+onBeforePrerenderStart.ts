import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("manage/self-hosted").map((entry) =>
        entry.slug === "" ? "/manage/self-hosted" : `/manage/self-hosted/${entry.slug}`,
    );
}
