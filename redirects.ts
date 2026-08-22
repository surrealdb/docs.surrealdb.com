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
/** surrealctl installation moved into the guide; the reference is command-only. */
function surrealctlInstallRedirects(): Redirect[] {
    const from = "/reference/cli/surrealctl/install";
    const to = "/manage/surrealctl/install";
    return [
        { source: `/docs${from}`, destination: `/docs${to}`, statusCode: 301 },
        { source: from, destination: `/docs${to}`, statusCode: 301 },
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

/**
 * The AI agents section no longer carries its own editor tutorial or agent
 * rules page. Editor setup for the built-in MCP server now lives on the
 * Embedded MCP page, and agent rules are documented under Integrations.
 */
function aiAgentsRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["build/ai-agents/connect-mcp-to-your-editor", "build/ai-agents/mcp/embedded"],
        ["build/ai-agents/agent-rules", "build/integrations/agent-rules/agent-rules"],
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

/**
 * OAuth/OIDC discovery hand-offs.
 *
 * Probing this origin for these documents did not 404 - it returned
 * `200 text/html`. The request fell through to the parent-path fallback, which
 * walks up to the nearest valid page and lands on `/docs`, so a client asking
 * for JSON metadata got a rendered docs page with a success status. That is
 * worse than a 404: a strict client fails to parse it, and a lenient one may
 * treat HTML as a valid response.
 *
 * These hand off to the host that owns each document. `auth.surrealdb.com` is
 * the issuer (`https://auth.surrealdb.com/`) and already publishes both.
 * Serving copies here would declare a docs site to be an OIDC issuer, which it
 * is not; a redirect points at the real one without ever claiming to be it.
 *
 * Both path forms are covered because this project is reached two ways:
 * directly, and through the `/docs` prefix that surrealdb.com rewrites onto it.
 *
 * 307 rather than 301: auth infrastructure moves more often than docs URLs, and
 * a permanent redirect gets cached hard by clients.
 *
 * `oauth-protected-resource` is deliberately absent. Per RFC 9728 it belongs on
 * the resource host, and api.surrealdb.com serves it per-resource (for example
 * `/.well-known/oauth-protected-resource/api/mcp`). There is no single document
 * for this origin to point at, and redirecting to a guess would be worse than
 * the 404 a client gets today.
 */
function authDiscoveryRedirects(): Redirect[] {
    const documents = ["openid-configuration", "oauth-authorization-server"] as const;

    return ["", "/docs"].flatMap((prefix) =>
        documents.map((doc) => ({
            source: `${prefix}/.well-known/${doc}`,
            destination: `https://auth.surrealdb.com/.well-known/${doc}`,
            statusCode: 307,
        })),
    );
}

/**
 * Cloud and deployment restructure: the `build/deployment` and `manage/cloud`
 * collections were dissolved and their pages redistributed.
 *
 * - Managed-instance topics (create, connect, scale, monitor, back up) →
 *   `manage/instances`.
 * - Account, team, and billing topics → `manage/organisations`.
 * - Self-hosting and Kubernetes topics → `manage/self-hosted`, with the three
 *   per-cloud Kubernetes pages merged into one `managed-kubernetes` page.
 * - The two Cloud tooling pages → `explore/studio`.
 *
 * Each tuple is `[from, to, kind]`. `exact` maps a single page; `prefix` maps a
 * folder and everything beneath it. The array is matched in order, so page
 * renames are listed before the folder rule that would otherwise swallow them,
 * and deeper folders before their parents.
 */
function cloudAndDeploymentRedirects(): Redirect[] {
    const moves: [string, string, "exact" | "prefix"][] = [
        // Cloud operations → instance operations.
        [
            "build/deployment/surrealdb-cloud/operations/aws-privatelink",
            "manage/instances/private-connectivity",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/data-export-and-backup",
            "manage/instances/backups",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/logs",
            "manage/instances/monitoring",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/metrics",
            "manage/instances/monitoring",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/monitoring-overview",
            "manage/instances/monitoring",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/migrating-data",
            "manage/instances/import-and-export",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/network-access",
            "manage/instances/network-access",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/scaling",
            "manage/instances/scaling",
            "exact",
        ],
        ["build/deployment/surrealdb-cloud/operations", "manage/instances", "prefix"],

        // Cloud onboarding → organisation and instance creation.
        [
            "build/deployment/surrealdb-cloud/getting-started/create-an-account",
            "manage/organisations/sign-in",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/getting-started/create-an-instance",
            "manage/instances/create",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/getting-started/create-an-organisation",
            "manage/organisations",
            "exact",
        ],
        ["build/deployment/surrealdb-cloud/getting-started", "manage/organisations", "prefix"],

        // Billing, support, FAQs, and referrals keep their slugs under organisations.
        ["build/deployment/surrealdb-cloud/billing-and-support", "manage/organisations", "prefix"],

        // Connecting → instances/connect (the Surrealist page was renamed to Studio).
        [
            "build/deployment/surrealdb-cloud/connecting/via-surrealist",
            "manage/instances/connect/via-studio",
            "exact",
        ],
        ["build/deployment/surrealdb-cloud/connecting", "manage/instances/connect", "prefix"],

        // Cloud tooling pages are Studio features, not Cloud features.
        ["build/deployment/surrealdb-cloud/tooling", "explore/studio", "prefix"],

        // Remaining Cloud pages fold into the instances section index.
        ["build/deployment/surrealdb-cloud/what-is-surrealdb-cloud", "manage/instances", "exact"],
        ["build/deployment/surrealdb-cloud", "manage/instances", "prefix"],

        // Self-hosted deployment → the Manage section. The Amazon EKS, Azure AKS,
        // and Google GKE pages merged into a single Managed Kubernetes page.
        [
            "build/deployment/self-hosted/amazon-eks",
            "manage/self-hosted/managed-kubernetes",
            "exact",
        ],
        [
            "build/deployment/self-hosted/azure-aks",
            "manage/self-hosted/managed-kubernetes",
            "exact",
        ],
        [
            "build/deployment/self-hosted/google-gke",
            "manage/self-hosted/managed-kubernetes",
            "exact",
        ],
        ["build/deployment/self-hosted/overview", "manage/self-hosted", "exact"],
        // `docker` and `kubernetes` keep their slugs, so the folder rule covers them.
        ["build/deployment/self-hosted", "manage/self-hosted", "prefix"],

        // The deployment section index became the Deployment models page. There is
        // deliberately no `build/deployment/:path*` rule: the subtrees above cover
        // every page, and `build/deployment/observability` is handled separately by
        // `deploymentObservabilityToManageRedirects`.
        ["build/deployment", "manage/self-hosted/deployment-models", "exact"],

        // manage/cloud split into manage/instances and manage/organisations.
        ["manage/cloud/architecture", "manage/instances/architecture", "exact"],
        ["manage/cloud/aws-marketplace", "manage/organisations/aws-marketplace", "exact"],
        ["manage/cloud/backups-and-recovery", "manage/instances/backups", "exact"],
        ["manage/cloud/billing-and-support", "manage/organisations/billing", "exact"],
        ["manage/cloud/high-availability", "manage/instances/high-availability", "exact"],
        ["manage/cloud/instance-management", "manage/instances/create", "exact"],
        ["manage/cloud/monitoring-and-logs", "manage/instances/monitoring", "exact"],
        ["manage/cloud/network-access", "manage/instances/network-access", "exact"],
        ["manage/cloud/organisations-and-users", "manage/organisations/members-and-roles", "exact"],
        ["manage/cloud/patches-and-upgrades", "manage/instances/versions-and-upgrades", "exact"],
        ["manage/cloud/scaling", "manage/instances/scaling", "exact"],
        ["manage/cloud", "manage/instances", "prefix"],

        // The legacy `/cloud/*` prefix used to point at `manage/cloud`; send it
        // straight to the final destination rather than chaining through it.
        ["cloud", "manage/instances", "prefix"],
    ];

    const out: Redirect[] = [];

    for (const [from, to, kind] of moves) {
        // Source without `/docs` (the www rewrite strips it); destination with
        // `/docs` (it is browser-facing).
        out.push({ source: `/${from}`, destination: `/docs/${to}`, statusCode: 301 });

        if (kind === "prefix") {
            out.push({
                source: `/${from}/:path*`,
                destination: `/docs/${to}/:path*`,
                statusCode: 301,
            });
        }
    }

    return out;
}

/**
 * A destination becomes a browser-facing `Location:` header resolved against
 * surrealdb.com, where these pages only exist under `/docs`. A destination
 * written without that prefix therefore sends the reader to a URL that does not
 * exist, even though the same rule looks correct next to its `/docs`-less source.
 *
 * Sources are the other half of the asymmetry and are deliberately left alone:
 * the www rewrite strips `/docs` before this project sees the request.
 *
 * Applying this at the point of export means a helper cannot reintroduce the bug.
 */
function withDocsDestination(rule: Redirect): Redirect {
    const { destination } = rule;

    if (/^[a-z][a-z0-9+.-]*:/i.test(destination) || destination.startsWith("/docs")) {
        return rule;
    }

    return {
        ...rule,
        destination: `/docs${destination.startsWith("/") ? destination : `/${destination}`}`,
    };
}

/** Shared with vercel.ts (production) and the Vite dev server (local). */
/**
 * Spectron → SurrealDB Agent Memory rename (August 2026). The docs moved from
 * `/docs/spectron` to `/docs/agent-memory` to match the website, and the nested
 * `agent-memory` section was flattened into the collection root - so paths under
 * `/spectron/agent-memory` lose that segment while everything else keeps its
 * shape below the new prefix.
 *
 * Exact rules precede their prefix rules: `:path*` also matches the empty path,
 * so `/spectron/agent-memory/:path*` would otherwise swallow the hub page.
 */
function agentMemoryRedirects(): Redirect[] {
    const moves: [string, string][] = [
        // Page slug renamed with the product; must precede the prefix rules below.
        // `what-is-agent-memory` shipped only briefly as an interim slug.
        [
            "/spectron/welcome/what-is-spectron",
            "/docs/agent-memory/welcome/what-is-surrealdb-agent-memory",
        ],
        [
            "/agent-memory/welcome/what-is-spectron",
            "/docs/agent-memory/welcome/what-is-surrealdb-agent-memory",
        ],
        [
            "/agent-memory/welcome/what-is-agent-memory",
            "/docs/agent-memory/welcome/what-is-surrealdb-agent-memory",
        ],
        // Flattened section - the hub page's content lives at a new slug.
        ["/spectron/agent-memory", "/docs/agent-memory/memory-and-knowledge"],
        ["/spectron/agent-memory/:path*", "/docs/agent-memory/:path*"],
        // Everything else keeps its path below the new prefix.
        ["/spectron", "/docs/agent-memory"],
        ["/spectron/:path*", "/docs/agent-memory/:path*"],
    ];

    // Emitted with and without a `/docs` source prefix. The www rewrite strips
    // `/docs` before the request reaches this project, but the repo's existing
    // rules cover both spellings and a duplicate destination is harmless.
    return moves.flatMap(([source, destination]): Redirect[] => [
        { source, destination, statusCode: 301 },
        { source: `/docs${source}`, destination, statusCode: 301 },
    ]);
}

export const docsRedirects: Redirect[] = [
    ...authDiscoveryRedirects(),
    { source: "/start", destination: "/what-is-surrealdb", statusCode: 302 },
    ...legacyPrefixRedirects("surrealql", "reference/query-language"),
    ...legacyPrefixRedirects("surrealist", "explore/studio"),
    ...legacyPrefixRedirects("surrealml", "explore/ml-models"),
    ...legacyPrefixRedirects("integrations", "build/integrations"),
    ...legacyPrefixRedirects("tutorials", "explore/tutorials"),
    ...exploreTutorialsThematicRedirects(),
    ...sdkRedirects(),
    ...legacyMigratingRedirects(),
    ...deploymentObservabilityToManageRedirects(),
    ...runningFromSelfHostedRedirects(),
    ...databaseFunctionsOverviewRedirects(),
    ...surrealctlInstallRedirects(),
    ...phpVersionedRedirects(),
    ...sdkReferenceRedirects(),
    ...sdkGettingStartedRedirects(),
    ...aiAgentsRedirects(),
    ...cloudAndDeploymentRedirects(),
    ...agentMemoryRedirects(),
    // Surrealist → SurrealDB Studio path rename
    {
        source: "/docs/explore/surrealist",
        destination: "/docs/explore/studio",
        statusCode: 301,
    },
    {
        source: "/docs/explore/surrealist/:path*",
        destination: "/docs/explore/studio/:path*",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist",
        destination: "/explore/studio",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist/:path*",
        destination: "/explore/studio/:path*",
        statusCode: 301,
    },
    {
        source: "/docs/learn/querying/graphql/via-surrealist",
        destination: "/docs/learn/querying/graphql/via-studio",
        statusCode: 301,
    },
    {
        source: "/docs/learn/querying/surrealql/executing-queries/via-surrealist",
        destination: "/docs/learn/querying/surrealql/executing-queries/via-studio",
        statusCode: 301,
    },
    {
        source: "/learn/querying/graphql/via-surrealist",
        destination: "/learn/querying/graphql/via-studio",
        statusCode: 301,
    },
    {
        source: "/learn/querying/surrealql/executing-queries/via-surrealist",
        destination: "/learn/querying/surrealql/executing-queries/via-studio",
        statusCode: 301,
    },
].map(withDocsDestination);

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
