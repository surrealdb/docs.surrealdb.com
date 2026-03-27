declare global {
    namespace Vike {
        interface PageContext {
            sdkVersions: import("~/lib/versions").SdkVersionMap;
        }
    }
}
