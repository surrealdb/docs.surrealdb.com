import { getImageUrl } from "~/utils/image-urls";

const ICON_BASE = "~/assets/img/icon";

type IconEntry = [variableName: string, theme: "light" | "dark", filename: string];

const ICON_ENTRIES: IconEntry[] = [
	["LightRust", "light", "rust"],
	["DarkRust", "dark", "rust"],
	["LightJavaScript", "light", "javascript"],
	["DarkJavaScript", "dark", "javascript"],
	["LightJavascript", "light", "javascript"],
	["DarkJavascript", "dark", "javascript"],
	["LightTypescript", "light", "typescript"],
	["DarkTypescript", "dark", "typescript"],
	["LightNodejs", "light", "nodejs"],
	["DarkNodejs", "dark", "nodejs"],
	["LightWasm", "light", "webassembly"],
	["DarkWasm", "dark", "webassembly"],
	["LightJava", "light", "java"],
	["DarkJava", "dark", "java"],
	["LightGolang", "light", "golang"],
	["DarkGolang", "dark", "golang"],
	["LightPython", "light", "python"],
	["DarkPython", "dark", "python"],
	["LightDotnet", "light", "dotnet"],
	["DarkDotnet", "dark", "dotnet"],
	["LightPhp", "light", "php"],
	["DarkPhp", "dark", "php"],
	["LightReact", "light", "reactjs"],
	["DarkReact", "dark", "reactjs"],
	["LightSolid", "light", "solidjs"],
	["DarkSolid", "dark", "solidjs"],
	["LightVue", "light", "vuejs"],
	["DarkVue", "dark", "vuejs"],
	["LightNext", "light", "nextjs"],
	["DarkNext", "dark", "nextjs"],
	["LightAngular", "light", "angular"],
	["DarkAngular", "dark", "angular"],
	["LightSvelte", "light", "svelte"],
	["DarkSvelte", "dark", "svelte"],
	["LightCloud", "light", "cloud"],
	["DarkCloud", "dark", "cloud"],
	["LightKubernetes", "light", "kubernetes"],
	["DarkKubernetes", "dark", "kubernetes"],
	["LightGoogle", "light", "google"],
	["DarkGoogle", "dark", "google"],
	["LightAmazon", "light", "amazon"],
	["DarkAmazon", "dark", "amazon"],
	["LightAzure", "light", "azure"],
	["DarkAzure", "dark", "azure"],
	["LightLaravel", "light", "laravel"],
	["DarkLaravel", "dark", "laravel"],
	["LightSymfony", "light", "symfony"],
	["DarkSymfony", "dark", "symfony"],
	["LightActixLogo", "light", "actix"],
	["DarkActixLogo", "dark", "actix"],
	["LightAxumLogo", "light", "axum"],
	["DarkAxumLogo", "dark", "axum"],
	["LightRerunLogo", "light", "rerun"],
	["DarkRerunLogo", "dark", "rerun"],
	["LightRocketLogo", "light", "rocket"],
	["DarkRocketLogo", "dark", "rocket"],
	["AppleLightLogo", "light", "apple"],
	["AppleDarkLogo", "dark", "apple"],
	["WindowsLightLogo", "light", "windows"],
	["WindowsDarkLogo", "dark", "windows"],
	["LinuxLightLogo", "light", "linux"],
	["LinuxDarkLogo", "dark", "linux"],
	["LightQL", "light", "ql"],
	["DarkQL", "dark", "ql"],
	["LightCloud", "light", "cloud"],
	["DarkCloud", "dark", "cloud"],
	["LightGQL", "light", "gql"],
	["DarkGQL", "dark", "gql"],
	["LightIntegrations", "light", "integrations"],
	["DarkIntegrations", "dark", "integrations"],
	["LightKV", "light", "kv"],
	["DarkKV", "dark", "kv"],
	["LightML", "light", "ml"],
	["DarkML", "dark", "ml"],
	["LightSurrealDB", "light", "surrealdb"],
	["DarkSurrealDB", "dark", "surrealdb"],
	["LightSurrealist", "light", "surrealist"],
	["DarkSurrealist", "dark", "surrealist"],
	["LightTutorials", "light", "tutorials"],
	["DarkTutorials", "dark", "tutorials"],
];

let cachedScope: Record<string, string> | undefined;

export function getIconScope(): Record<string, string> {
	if (cachedScope) return cachedScope;

	const scope: Record<string, string> = {};

	for (const [name, theme, filename] of ICON_ENTRIES) {
		const path = `${ICON_BASE}/${theme}/${filename}.png`;
		scope[name] = getImageUrl(path) ?? path;
	}

	cachedScope = scope;
	return scope;
}
