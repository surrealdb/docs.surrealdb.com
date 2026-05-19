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

/** Former learn/context Spectron walkthrough → Spectron docs quickstart. */
function learnContextToSpectronRedirects(): Redirect[] {
    const to = "/docs/spectron/quickstarts/surrealist-dashboard";
    return [
        { source: "/docs/learn/context", destination: to, statusCode: 301 },
        { source: "/docs/learn/context/:path*", destination: to, statusCode: 301 },
        { source: "/learn/context", destination: to, statusCode: 301 },
        { source: "/learn/context/:path*", destination: to, statusCode: 301 },
    ];
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
    ...learnContextToSpectronRedirects(),
    ...deploymentObservabilityToManageRedirects(),
    ...runningFromSelfHostedRedirects(),
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
