import { fetchAllSdkVersions } from "@lib/versions";
import { encodeLLMChatUrl } from "@util/llms";
import type { PageContextServer } from "vike/types";

export async function onBeforeRender({ urlPathname }: PageContextServer) {
    const [sdkVersions] = await Promise.all([fetchAllSdkVersions()]);

    return {
        pageContext: {
            llms: encodeLLMChatUrl(urlPathname),
            sdkVersions,
        },
    };
}
