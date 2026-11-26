import {
    brandAgno,
    brandCamelAI,
    brandClaude,
    brandCloudflare,
    brandCrewAI,
    brandDart,
    brandDocker,
    brandElixir,
    brandEveDark,
    brandEveLight,
    brandGo,
    brandGoogle,
    brandGoogleAgent,
    brandHaskell,
    brandHermesDark,
    brandHermesLight,
    brandJava,
    brandJavaScript,
    brandKeycloak,
    brandKotlin,
    brandLangchain,
    brandLlamaIndex,
    brandMastraDark,
    brandMastraLight,
    brandMicrosoftAzure,
    brandN8N,
    brandOIDC,
    brandOktaDark,
    brandOktaLight,
    brandOpenAiDark,
    brandOpenAiLight,
    brandOpenClaw,
    brandPingFederate,
    brandPydantic,
    brandPython,
    brandSAML,
    brandStrands,
    brandSwift,
    brandTanStackDark,
    brandTanStackLight,
    brandTypescript,
    brandVercelDark,
    brandVercelLight,
    brandWindows,
    pictoAISolid,
    pictoAtomSolid,
    pictoBookSolid,
    pictoClisdbSolid,
    pictoCurlyBracesSolid,
    pictoEmbeddedDevicesSolid,
    pictoGlobeSolid,
    pictoGraphSolid,
    pictoHTTPSolid,
    pictoIntegrationsSolid,
    pictoOnDiskSolid,
    pictoPadlockClosedSolid,
    pictoPathSolid,
    pictoQLSolid,
    pictoSDBCloudSolid,
    pictoSignalSolid,
    pictoSpectronSolid,
    pictoSpeedSolid,
    pictoSurrealDBSolid,
    pictoSurrealismSolid,
    pictoSurrealistSolid,
    pictoTutorialsSolid,
    pictoUpdateSolid,
    pictoVectorSearchSolid,
} from "@surrealdb/ui";
import { getImageUrl as getBundledImageUrl } from "~/lib/images";

const UI_PREFIX = "@ui/";

const UI_ASSETS: Record<string, string> = {
    brandDocker,

    pictoAI: pictoAISolid,
    pictoAISolid,
    pictoAtom: pictoAtomSolid,
    pictoAtomSolid,
    pictoBook: pictoBookSolid,
    pictoBookSolid,
    pictoClisdb: pictoClisdbSolid,
    pictoClisdbSolid,
    pictoCurlyBraces: pictoCurlyBracesSolid,
    pictoCurlyBracesSolid,
    pictoEmbeddedDevices: pictoEmbeddedDevicesSolid,
    pictoEmbeddedDevicesSolid,
    pictoGlobe: pictoGlobeSolid,
    pictoGlobeSolid,
    pictoGraph: pictoGraphSolid,
    pictoGraphSolid,
    pictoHTTP: pictoHTTPSolid,
    pictoHTTPSolid,
    pictoIntegrations: pictoIntegrationsSolid,
    pictoIntegrationsSolid,
    pictoOnDisk: pictoOnDiskSolid,
    pictoOnDiskSolid,
    pictoPadlockClosed: pictoPadlockClosedSolid,
    pictoPadlockClosedSolid,
    pictoPath: pictoPathSolid,
    pictoPathSolid,
    pictoQL: pictoQLSolid,
    pictoQLSolid,
    pictoSDBCloud: pictoSDBCloudSolid,
    pictoSDBCloudSolid,
    pictoSignal: pictoSignalSolid,
    pictoSignalSolid,
    pictoSpectron: pictoSpectronSolid,
    pictoSpectronSolid,
    pictoSpeed: pictoSpeedSolid,
    pictoSpeedSolid,
    pictoSurrealDB: pictoSurrealDBSolid,
    pictoSurrealDBSolid,
    pictoSurrealism: pictoSurrealismSolid,
    pictoSurrealismSolid,
    pictoSurrealist: pictoSurrealistSolid,
    pictoSurrealistSolid,
    pictoTutorials: pictoTutorialsSolid,
    pictoTutorialsSolid,
    pictoUpdate: pictoUpdateSolid,
    pictoUpdateSolid,
    pictoVectorSearch: pictoVectorSearchSolid,
    pictoVectorSearchSolid,
    brandAgno,
    brandCamelAI,
    brandClaude,
    brandCrewAI,
    brandEveDark,
    brandEveLight,
    brandGoogleAgent,
    brandHermesDark,
    brandHermesLight,
    brandLangchain,
    brandLlamaIndex,
    brandMastraDark,
    brandMastraLight,
    brandOpenAiDark,
    brandOpenAiLight,
    brandOpenClaw,
    brandPydantic,
    brandStrands,
    brandVercelDark,
    brandVercelLight,
    brandTanStackDark,
    brandTanStackLight,
    brandCloudflare,
    brandN8N,
    brandDart,
    brandElixir,
    brandHaskell,
    brandGo,
    brandKotlin,
    brandPython,
    brandSwift,
    brandJavaScript,
    brandTypescript,
    brandJava,
    brandGoogle: brandGoogle,
    brandMicrosoftAzure: brandMicrosoftAzure,
    brandOktaDark: brandOktaDark,
    brandOktaLight: brandOktaLight,
    brandWindows: brandWindows,
    brandKeycloak: brandKeycloak,
    brandPingFederate: brandPingFederate,
    brandOIDC: brandOIDC,
    brandSAML: brandSAML,
};

/**
 * Get the URL for an image, handling brandsafe CDN URLs and bundled images.
 *
 * @param imageId - The image identifier (can be a URL, brandsafe ID, @assets path, etc.)
 * @param options - Optional configuration
 * @param options.width - The desired width for brandsafe CDN images (default: 1200)
 * @param options.quality - The quality for brandsafe CDN images (default: 80)
 * @param options.collection - The collection directory to search in (e.g., "ambassadors", "headshots")
 * @returns The resolved image URL or undefined
 */
export function getImageUrl(
    imageId: string | undefined,
    options?: {
        width?: number;
        quality?: number;
        collection?: string;
    },
): string | undefined {
    if (!imageId) return undefined;

    const width = options?.width ?? 1200;
    const quality = options?.quality ?? 80;
    const collection = options?.collection;

    // If it's already a full URL, return it
    if (imageId.startsWith("http")) return imageId;

    // Handle @ui/ prefixed asset references (e.g. "@ui/pictoAI")
    if (imageId.startsWith(UI_PREFIX)) {
        const key = imageId.slice(UI_PREFIX.length);
        return UI_ASSETS[key];
    }

    // Try to get bundled image URL first
    const bundledUrl = getBundledImageUrl(imageId);
    if (bundledUrl) return bundledUrl;

    // If collection is specified and imageId looks like a filename (no path),
    // try looking it up in the collection directory
    if (collection && imageId.includes(".") && !imageId.includes("/")) {
        const collectionPath = getBundledImageUrl(`/assets/img/${collection}/${imageId}`);
        if (collectionPath) return collectionPath;
    }

    // Handle @assets paths
    if (imageId.startsWith("@assets")) {
        return imageId.replace("@assets", "/assets");
    }

    // Handle brandsafe CDN IDs (20 character alphanumeric strings)
    if (imageId.length === 20 && /^[a-zA-Z0-9]+$/.test(imageId)) {
        return `https://cdn.brandsafe.io/w(${width})q(${quality})/${imageId}.auto`;
    }

    return imageId;
}
