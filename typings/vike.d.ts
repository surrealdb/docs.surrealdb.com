declare global {
    namespace Vike {
        interface PageContext {
            llms: import("@util/llms").LLMChatURLs;
            sdkVersions: import("@lib/versions").SdkVersionMap;
        }
    }
}
