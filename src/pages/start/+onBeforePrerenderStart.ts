import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("start").map((entry) =>
        entry.slug === "" ? "/start" : `/start/${entry.slug}`,
    );
}
