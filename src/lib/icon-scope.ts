import {
    brandAppleDark,
    brandAppleLight,
    brandDotNet,
    brandGo,
    brandGoogle,
    brandJava,
    brandJavaScript,
    brandKotlin,
    brandKubernetes,
    brandLinux,
    brandMicrosoftAzure,
    brandNodeJs,
    brandPHP,
    brandPython,
    brandReact,
    brandRust,
    brandSolidJS,
    brandSwift,
    brandTypescript,
    brandWebAssembly,
    brandWindows,
} from "@surrealdb/ui";
import rustDark from "~/assets/img/icon/brand/rust-dark.svg";
import { getImageUrl } from "~/utils/image-urls";

const ICON_BASE = "~/assets/img/icon";

type IconEntry = [variableName: string, theme: "light" | "dark", filename: string];

// FIXME This is in dire need of a refactor and all images should be revised
const ICON_ENTRIES: IconEntry[] = [
    ["LightActixLogo", "light", "actix"],
    ["DarkActixLogo", "dark", "actix"],

    ["LightAmazon", "light", "amazon"],
    ["DarkAmazon", "dark", "amazon"],

    ["LightAngular", "light", "angular"],
    ["DarkAngular", "dark", "angular"],

    ["AppleLightLogo", "light", "apple"],
    ["AppleDarkLogo", "dark", "apple"],

    ["LightAxumLogo", "light", "axum"],
    ["DarkAxumLogo", "dark", "axum"],

    ["LightAzure", "light", "azure"],
    ["DarkAzure", "dark", "azure"],

    ["LightCloud", "light", "cloud"],
    ["DarkCloud", "dark", "cloud"],

    ["LightDotnet", "light", "dotnet"],
    ["DarkDotnet", "dark", "dotnet"],

    ["LightGolang", "light", "golang"],
    ["DarkGolang", "dark", "golang"],

    ["LightGoogle", "light", "google"],
    ["DarkGoogle", "dark", "google"],

    ["LightGQL", "light", "gql"],
    ["DarkGQL", "dark", "gql"],

    ["LightIntegrations", "light", "integrations"],
    ["DarkIntegrations", "dark", "integrations"],

    ["LightJava", "light", "java"],
    ["DarkJava", "dark", "java"],

    ["LightJavaScript", "light", "javascript"],
    ["DarkJavaScript", "dark", "javascript"],

    ["LightJavascript", "light", "javascript"],
    ["DarkJavascript", "dark", "javascript"],

    ["LightKotlin", "light", "kotlin"],
    ["DarkKotlin", "dark", "kotlin"],

    ["LightKubernetes", "light", "kubernetes"],
    ["DarkKubernetes", "dark", "kubernetes"],

    ["LightKV", "light", "kv"],
    ["DarkKV", "dark", "kv"],

    ["LightLaravel", "light", "laravel"],
    ["DarkLaravel", "dark", "laravel"],

    ["LinuxLightLogo", "light", "linux"],
    ["LinuxDarkLogo", "dark", "linux"],

    ["LightML", "light", "ml"],
    ["DarkML", "dark", "ml"],

    ["LightMojo", "light", "mojo"],
    ["DarkMojo", "dark", "mojo"],

    ["LightNext", "light", "nextjs"],
    ["DarkNext", "dark", "nextjs"],

    ["LightNodejs", "light", "nodejs"],
    ["DarkNodejs", "dark", "nodejs"],

    ["LightPhp", "light", "php"],
    ["DarkPhp", "dark", "php"],

    ["LightPython", "light", "python"],
    ["DarkPython", "dark", "python"],

    ["LightQL", "light", "ql"],
    ["DarkQL", "dark", "ql"],

    ["LightReact", "light", "reactjs"],
    ["DarkReact", "dark", "reactjs"],

    ["LightRerunLogo", "light", "rerun"],
    ["DarkRerunLogo", "dark", "rerun"],

    ["LightRocketLogo", "light", "rocket"],
    ["DarkRocketLogo", "dark", "rocket"],

    ["LightRust", "light", "rust"],
    ["DarkRust", "dark", "rust"],

    ["LightSolid", "light", "solidjs"],
    ["DarkSolid", "dark", "solidjs"],

    ["LightSurrealDB", "light", "surrealdb"],
    ["DarkSurrealDB", "dark", "surrealdb"],

    ["LightSurrealist", "light", "surrealist"],
    ["DarkSurrealist", "dark", "surrealist"],

    ["LightSvelte", "light", "svelte"],
    ["DarkSvelte", "dark", "svelte"],

    ["LightSwift", "light", "swift"],
    ["DarkSwift", "dark", "swift"],

    ["LightSymfony", "light", "symfony"],
    ["DarkSymfony", "dark", "symfony"],

    ["LightTutorials", "light", "tutorials"],
    ["DarkTutorials", "dark", "tutorials"],

    ["LightTypescript", "light", "typescript"],
    ["DarkTypescript", "dark", "typescript"],

    ["LightVue", "light", "vuejs"],
    ["DarkVue", "dark", "vuejs"],

    ["LightWasm", "light", "webassembly"],
    ["DarkWasm", "dark", "webassembly"],

    ["WindowsLightLogo", "light", "windows"],
    ["WindowsDarkLogo", "dark", "windows"],
];

/**
 * Logos the UI kit publishes, keyed by the local icon filename they replace.
 * The kit's marks carry no tile behind them, which the local PNGs do. A pair is
 * written in theme terms: the kit names a mark after its own artwork, so
 * `brandAppleDark` is the black apple and belongs on the light page.
 */
const KIT_BRANDS: Record<string, string | { light: string; dark: string }> = {
    apple: { light: brandAppleDark, dark: brandAppleLight },
    azure: brandMicrosoftAzure,
    dotnet: brandDotNet,
    golang: brandGo,
    google: brandGoogle,
    java: brandJava,
    javascript: brandJavaScript,
    kotlin: brandKotlin,
    kubernetes: brandKubernetes,
    linux: brandLinux,
    nodejs: brandNodeJs,
    php: brandPHP,
    python: brandPython,
    reactjs: brandReact,
    // The kit's Rust mark is light grey, so light mode takes a dark copy of it.
    rust: { light: rustDark, dark: brandRust },
    solidjs: brandSolidJS,
    swift: brandSwift,
    typescript: brandTypescript,
    webassembly: brandWebAssembly,
    windows: brandWindows,
};

let cachedScope: Record<string, string> | undefined;

export function getIconScope(): Record<string, string> {
    if (cachedScope) return cachedScope;

    const scope: Record<string, string> = {};

    for (const [name, theme, filename] of ICON_ENTRIES) {
        const brand = KIT_BRANDS[filename];

        if (brand) {
            scope[name] = typeof brand === "string" ? brand : brand[theme];
            continue;
        }

        const path = `${ICON_BASE}/${theme}/${filename}.png`;
        scope[name] = getImageUrl(path) ?? path;
    }

    cachedScope = scope;
    return scope;
}
