declare global {
    namespace Vike {
        interface PageContext {
            llms: import("@util/llms").LLMChatURLs;
        }
    }
}
