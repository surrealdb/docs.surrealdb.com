import type { Redirect } from "@vercel/config/v1";

/**
 * Legacy path prefixes from src-old (see src-old/content/config.ts urlForCollection)
 * → new information-architecture paths under src/content + src/pages.
 */
function legacyPrefixRedirects(from: string, to: string): Redirect[] {
    return [
        { source: `/docs/${from}`, destination: `/${to}`, statusCode: 302 },
        { source: `/docs/${from}/:path*`, destination: `/${to}/:path*`, statusCode: 302 },
        { source: `/${from}`, destination: `/${to}`, statusCode: 302 },
        { source: `/${from}/:path*`, destination: `/${to}/:path*`, statusCode: 302 },
    ];
}

/** Old /sdk and /:version/sdk/* → index collection language docs. */
function sdkRedirects(): Redirect[] {
    const versions = ["1.x", "2.x", "3.x"] as const;
    const out: Redirect[] = [
        { source: "/docs/sdk/:sdk", destination: "/docs/languages/:sdk", statusCode: 302 },
        {
            source: "/docs/sdk/:sdk/:path*",
            destination: "/docs/languages/:sdk/:path*",
            statusCode: 302,
        },
        { source: "/sdk/:sdk", destination: "/docs/languages/:sdk", statusCode: 302 },
        { source: "/sdk/:sdk/:path*", destination: "/docs/languages/:sdk/:path*", statusCode: 302 },
    ];
    for (const v of versions) {
        out.push(
            { source: `/docs/${v}/sdk/:sdk`, destination: "/languages/:sdk", statusCode: 302 },
            {
                source: `/docs/${v}/sdk/:sdk/:path*`,
                destination: "/languages/:sdk/:path*",
                statusCode: 302,
            },
            { source: `/${v}/sdk/:sdk`, destination: "/languages/:sdk", statusCode: 302 },
            {
                source: `/${v}/sdk/:sdk/:path*`,
                destination: "/languages/:sdk/:path*",
                statusCode: 302,
            },
        );
    }
    return out;
}

/** Flat tutorial URLs → thematic subfolders under explore/tutorials/tutorials/. */
function exploreTutorialsThematicRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["tutorials/auth0-integration", "tutorials/authentication/auth0-integration"],
        ["tutorials/aws-cognito-integration", "tutorials/authentication/aws-cognito-integration"],
        ["tutorials/build-an-ai-agent", "tutorials/ai-and-agents/build-an-ai-agent"],
        ["tutorials/gen-ai-chatbot", "tutorials/ai-and-agents/gen-ai-chatbot"],
        [
            "tutorials/how-to-build-a-knowledge-graph-for-ai",
            "tutorials/ai-and-agents/how-to-build-a-knowledge-graph-for-ai",
        ],
        ["tutorials/minimal-langchain", "tutorials/ai-and-agents/minimal-langchain"],
        [
            "tutorials/build-a-real-time-presence-app",
            "tutorials/realtime-applications/build-a-real-time-presence-app",
        ],
        ["tutorials/connect-via-ngrok", "tutorials/integration-and-tooling/connect-via-ngrok"],
        ["tutorials/http-via-postman", "tutorials/integration-and-tooling/http-via-postman"],
        ["tutorials/github-actions", "tutorials/integration-and-tooling/github-actions"],
        ["tutorials/define-a-schema", "tutorials/schema-and-search/define-a-schema"],
        [
            "tutorials/semantic-search-in-rust",
            "tutorials/schema-and-search/semantic-search-in-rust",
        ],
    ];
    const out: Redirect[] = [];
    for (const [from, to] of moves) {
        out.push(
            {
                source: `/docs/explore/tutorials/${from}`,
                destination: `/docs/explore/tutorials/${to}`,
                statusCode: 301,
            },
            {
                source: `/explore/tutorials/${from}`,
                destination: `/explore/tutorials/${to}`,
                statusCode: 301,
            },
        );
    }
    return out;
}

/** Index “Running” section (formerly /self-hosted). */
function runningFromSelfHostedRedirects(): Redirect[] {
    return [
        { source: "/docs/self-hosted", destination: "/docs/running", statusCode: 301 },
        {
            source: "/docs/self-hosted/:path*",
            destination: "/docs/running/:path*",
            statusCode: 301,
        },
        { source: "/self-hosted", destination: "/running", statusCode: 301 },
        { source: "/self-hosted/:path*", destination: "/running/:path*", statusCode: 301 },
    ];
}

/** Deployment docs observability → Manage section (same slugs under /manage/observability). */
function deploymentObservabilityToManageRedirects(): Redirect[] {
    return [
        {
            source: "/docs/build/deployment/observability",
            destination: "/docs/manage/observability",
            statusCode: 301,
        },
        {
            source: "/docs/build/deployment/observability/:path*",
            destination: "/docs/manage/observability/:path*",
            statusCode: 301,
        },
        {
            source: "/build/deployment/observability",
            destination: "/docs/manage/observability",
            statusCode: 301,
        },
        {
            source: "/build/deployment/observability/:path*",
            destination: "/docs/manage/observability/:path*",
            statusCode: 301,
        },
    ];
}

function legacyMigratingRedirects(): Redirect[] {
    const db = ["mongodb", "postgresql", "neo4j"];
    const out: Redirect[] = [];

    for (const d of db) {
        out.push({
            source: `/docs/surrealdb/migrating/${d}`,
            destination: `/docs/build/migrating/from-other-databases/from-${d}`,
        });
    }

    return out;
}

/** Database functions overview merged into the section index. */
function databaseFunctionsOverviewRedirects(): Redirect[] {
    const from = "/reference/query-language/functions/database-functions/overview";
    const to = "/reference/query-language/functions/database-functions";
    return [
        { source: `/docs${from}`, destination: `/docs${to}`, statusCode: 301 },
        { source: from, destination: to, statusCode: 301 },
    ];
}
/** PHP SDK split into versioned folders: legacy v1 paths → /languages/php/v1/*. */
function phpVersionedRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["languages/php/setup", "languages/php/v1/installation"],
        ["languages/php/data-types", "languages/php/v1/concepts/data-types"],
        ["languages/php/core/initialization", "languages/php/v1/concepts/connecting"],
        ["languages/php/core/authentication", "languages/php/v1/concepts/authentication"],
        ["languages/php/core/data-querying", "languages/php/v1/concepts/executing-queries"],
        ["languages/php/core", "languages/php/v1"],
        ["languages/php/methods/insertRelation", "languages/php/v1/methods/insert-relation"],
        ["languages/php/methods/queryRaw", "languages/php/v1/methods/query-raw"],
    ];
    const out: Redirect[] = [];

    for (const [from, to] of moves) {
        out.push(
            { source: `/docs/${from}`, destination: `/docs/${to}`, statusCode: 301 },
            { source: `/${from}`, destination: `/docs/${to}`, statusCode: 301 },
        );
    }

    out.push(
        {
            source: "/docs/languages/php/methods",
            destination: "/docs/languages/php/v1/methods",
            statusCode: 301,
        },
        {
            source: "/docs/languages/php/methods/:path*",
            destination: "/docs/languages/php/v1/methods/:path*",
            statusCode: 301,
        },
        {
            source: "/languages/php/methods",
            destination: "/docs/languages/php/v1/methods",
            statusCode: 301,
        },
        {
            source: "/languages/php/methods/:path*",
            destination: "/docs/languages/php/v1/methods/:path*",
            statusCode: 301,
        },
    );

    return out;
}

/**
 * SDK reference split: the per-language SDK documentation moved out of the
 * `Start > Languages` section (`/languages/<sdk>/*`) into dedicated reference
 * docs (`/reference/<sdk>/*`). The single getting-started page for each SDK
 * stays in Start at `/languages/<sdk>` (see `sdkGettingStartedRedirects`), so
 * the bare `/languages/<sdk>` roots are deliberately absent below.
 *
 * Each tuple is `[from, to, kind]`. `exact` maps a single page; `prefix` maps a
 * folder and everything beneath it.
 */
function sdkReferenceRedirects(): Redirect[] {
    const moves: [string, string, "exact" | "prefix"][] = [
        ["languages/rust/methods", "reference/rust/methods", "prefix"],
        ["languages/rust/concepts", "reference/rust/concepts", "prefix"],
        ["languages/rust/embedding", "reference/rust/embedding", "exact"],
        ["languages/rust/frameworks", "reference/rust/frameworks", "prefix"],
        ["languages/rust/overview", "reference/rust", "exact"],
        ["languages/javascript/engines", "reference/javascript/engines", "prefix"],
        ["languages/javascript/concepts", "reference/javascript/concepts", "prefix"],
        ["languages/javascript/api", "reference/javascript/api", "prefix"],
        ["languages/javascript/frameworks", "reference/javascript/frameworks", "prefix"],
        ["languages/javascript/installation", "reference/javascript/installation", "exact"],
        ["languages/javascript/overview", "reference/javascript", "exact"],
        ["languages/golang/concepts", "reference/golang/concepts", "prefix"],
        ["languages/golang/embedding", "reference/golang/embedding", "exact"],
        ["languages/golang/api", "reference/golang/api", "prefix"],
        ["languages/golang/installation", "reference/golang/installation", "exact"],
        ["languages/dotnet/methods", "reference/dotnet/methods", "prefix"],
        ["languages/dotnet/core", "reference/dotnet/core", "prefix"],
        ["languages/dotnet/data-types", "reference/dotnet/data-types", "exact"],
        ["languages/dotnet/embedding", "reference/dotnet/embedding", "exact"],
        ["languages/dotnet/installation", "reference/dotnet/installation", "exact"],
        ["languages/java/concepts", "reference/java/concepts", "prefix"],
        ["languages/java/api", "reference/java/api", "prefix"],
        ["languages/java/installation", "reference/java/installation", "exact"],
        ["languages/kotlin/concepts", "reference/kotlin/concepts", "prefix"],
        ["languages/kotlin/api", "reference/kotlin/api", "prefix"],
        ["languages/kotlin/installation", "reference/kotlin/installation", "exact"],
        ["languages/php/v1", "reference/php/v1", "exact"],
        ["languages/php/v1/methods", "reference/php/v1/methods", "prefix"],
        ["languages/php/v1/concepts", "reference/php/v1/concepts", "prefix"],
        ["languages/php/v1/installation", "reference/php/v1/installation", "exact"],
        ["languages/php/libraries", "reference/php/libraries", "prefix"],
        ["languages/php/v2", "reference/php/v2", "exact"],
        ["languages/php/v2/migration", "reference/php/v2/migration", "exact"],
        ["languages/php/v2/concepts", "reference/php/v2/concepts", "prefix"],
        ["languages/php/v2/api", "reference/php/v2/api", "prefix"],
        ["languages/php/v2/installation", "reference/php/v2/installation", "exact"],
        ["languages/php/frameworks", "reference/php/frameworks", "prefix"],
        ["languages/mojo/methods", "reference/mojo/methods", "prefix"],
        ["languages/mojo/concepts", "reference/mojo/concepts", "prefix"],
        ["languages/mojo/installation", "reference/mojo/installation", "exact"],
        ["languages/python/concepts", "reference/python/concepts", "prefix"],
        ["languages/python/api", "reference/python/api", "prefix"],
        ["languages/python/installation", "reference/python/installation", "exact"],
        ["languages/swift/methods", "reference/swift/methods", "prefix"],
        ["languages/swift/data-types", "reference/swift/data-types", "exact"],
        ["languages/swift/concepts", "reference/swift/concepts", "prefix"],
        ["languages/swift/installation", "reference/swift/installation", "exact"],
    ];

    const out: Redirect[] = [];

    for (const [from, to, kind] of moves) {
        out.push(
            { source: `/docs/${from}`, destination: `/docs/${to}`, statusCode: 301 },
            { source: `/${from}`, destination: `/docs/${to}`, statusCode: 301 },
        );

        if (kind === "prefix") {
            out.push(
                {
                    source: `/docs/${from}/:path*`,
                    destination: `/docs/${to}/:path*`,
                    statusCode: 301,
                },
                { source: `/${from}/:path*`, destination: `/docs/${to}/:path*`, statusCode: 301 },
            );
        }
    }

    return out;
}

/**
 * Each SDK's getting-started page is now a single page at `/languages/<sdk>`
 * (previously a folder with a `start` child). PHP keeps only its v1 stable
 * getting-started page in Start; the v2 alpha guide moved into the PHP
 * reference docs under the "Versions" section. The old "SDK languages"
 * overview page was removed; its URL now points at an SDK getting-started
 * page (the sidebar lists every SDK, and community clients live on the new
 * "Community SDKs" page).
 */
function sdkGettingStartedRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["languages/overview", "languages/javascript"],
        ["languages/dotnet/start", "languages/dotnet"],
        ["languages/golang/start", "languages/golang"],
        ["languages/java/start", "languages/java"],
        ["languages/javascript/start", "languages/javascript"],
        ["languages/kotlin/start", "languages/kotlin"],
        ["languages/mojo/start", "languages/mojo"],
        ["languages/python/start", "languages/python"],
        ["languages/rust/start", "languages/rust"],
        ["languages/swift/start", "languages/swift"],
        ["languages/php/v1/start", "languages/php"],
        ["languages/php/v2/start", "reference/php/versions/v2-alpha"],
    ];

    const out: Redirect[] = [];

    for (const [from, to] of moves) {
        out.push(
            { source: `/docs/${from}`, destination: `/docs/${to}`, statusCode: 301 },
            { source: `/${from}`, destination: `/docs/${to}`, statusCode: 301 },
        );
    }

    return out;
}

/** Shared with vercel.ts (production) and the Vite dev server (local). */
export const docsRedirects: Redirect[] = [
    { source: "/start", destination: "/what-is-surrealdb", statusCode: 302 },
    ...legacyPrefixRedirects("surrealql", "reference/query-language"),
    ...legacyPrefixRedirects("cloud", "manage/cloud"),
    ...legacyPrefixRedirects("surrealist", "explore/surrealist"),
    ...legacyPrefixRedirects("surrealml", "explore/ml-models"),
    ...legacyPrefixRedirects("integrations", "build/integrations"),
    ...legacyPrefixRedirects("tutorials", "explore/tutorials"),
    ...exploreTutorialsThematicRedirects(),
    ...sdkRedirects(),
    ...legacyMigratingRedirects(),
    ...deploymentObservabilityToManageRedirects(),
    ...runningFromSelfHostedRedirects(),
    ...databaseFunctionsOverviewRedirects(),
    ...phpVersionedRedirects(),
    ...sdkReferenceRedirects(),
    ...sdkGettingStartedRedirects(),
];

export type ResolvedRedirect = { destination: string; statusCode: number };

/**
 * Match a request pathname against Vercel-style redirect rules.
 * Used by the Vite dev/preview server so local behaviour mirrors production redirects.
 */
export function resolveRedirect(pathname: string): ResolvedRedirect | null {
    const normalized = pathname.replace(/\/$/, "") || "/";

    for (const rule of docsRedirects) {
        const statusCode = rule.statusCode ?? 302;
        const source = rule.source;
        const destination = rule.destination;

        if (source.endsWith("/:path*")) {
            const sourceBase = source.slice(0, -"/:path*".length);
            const destBase = destination.endsWith("/:path*")
                ? destination.slice(0, -"/:path*".length)
                : destination;
            if (normalized === sourceBase || normalized.startsWith(`${sourceBase}/`)) {
                const suffix = normalized.slice(sourceBase.length);
                return { destination: `${destBase}${suffix}`, statusCode };
            }
            continue;
        }

        if (normalized === source) {
            return { destination, statusCode };
        }
    }

    return null;
}

/** Prefix `/docs` when a redirect target is an app-internal path (Vite `base` is `/docs`). */
export function redirectDestinationForDev(destination: string): string {
    if (destination.startsWith("/docs")) {
        return destination;
    }
    return `/docs${destination.startsWith("/") ? destination : `/${destination}`}`;
}
