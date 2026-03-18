declare global {
    namespace Vike {
        interface PageContext {
            llms: import("~/utils/llms").LLMChatURLs;
            sdkVersions: import("~/lib/versions").SdkVersionMap;
        }
    }
}
