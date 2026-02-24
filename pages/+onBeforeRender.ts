import { encodeLLMChatUrl } from "@util/llms";
import type { PageContextServer } from "vike/types";

export async function onBeforeRender({ urlPathname }: PageContextServer) {
    return {
        pageContext: {
            llms: encodeLLMChatUrl(urlPathname),
        },
    };
}
