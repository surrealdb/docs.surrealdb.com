import { getCollection } from "vike-content-collection";

export default function onBeforeRenderStart() {
    return getCollection("reference/dotnet").map((entry) =>
        entry.slug === "" ? "/reference/dotnet" : `/reference/dotnet/${entry.slug}`,
    );
}
