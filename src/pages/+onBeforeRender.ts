import type { PageContextServer } from "vike/types";
import { fetchAllSdkVersions } from "~/lib/versions";
import { encodeLLMChatUrl } from "~/utils/llms";

export async function onBeforeRender({ urlPathname }: PageContextServer) {
    const [sdkVersions] = await Promise.all([fetchAllSdkVersions()]);

    return {
        pageContext: {
            llms: encodeLLMChatUrl(urlPathname),
            sdkVersions,
        },
    };
}
