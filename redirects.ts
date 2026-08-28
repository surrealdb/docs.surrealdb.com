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

/**
 * Legacy `/docs/surrealdb/*` tree from the pre-restructure IA. The www repo
 * redirects some of this tree (`installation`, `security`, `cli`, and the bare
 * `/docs/surrealdb`), but `introduction/*`, the nested `surrealql/*` pages, and
 * the old top-level `/docs/cli` prefix were left behind and 404 (verified
 * August 2026). Exact page rules precede the folder catch-alls that would
 * otherwise swallow them.
 */
function legacySurrealdbTreeRedirects(): Redirect[] {
    // "prefix" collapses a removed tree onto one page; "prefix-path" carries
    // the path through to a tree whose slugs still match one-for-one.
    const moves: [string, string, "exact" | "prefix" | "prefix-path"][] = [
        // The old "Start" page covered running the server; its successor is the
        // Running section index.
        ["surrealdb/introduction/start", "running/overview", "exact"],
        ["surrealdb/introduction/concepts", "learn/data-models/architecture", "exact"],
        ["surrealdb/introduction/architecture", "learn/data-models/architecture", "exact"],
        ["surrealdb/introduction", "what-is-surrealdb", "prefix"],
        // SurrealQL nested under the product prefix → the query language
        // reference, whose slugs mirror the old tree.
        ["surrealdb/surrealql", "reference/query-language", "prefix-path"],
        // Remaining unmapped pages fold into the product introduction rather
        // than 404. The www rules for `installation`, `security`, and `cli`
        // run first in production, so this only catches what they miss.
        ["surrealdb", "what-is-surrealdb", "prefix"],
    ];

    const out: Redirect[] = [];

    for (const [from, to, kind] of moves) {
        // Both source spellings: the www rewrite strips `/docs` in production,
        // while dev and preview see the prefixed path.
        for (const source of [`/${from}`, `/docs/${from}`]) {
            out.push({ source, destination: `/docs/${to}`, statusCode: 301 });

            if (kind !== "exact") {
                out.push({
                    source: `${source}/:path*`,
                    destination: kind === "prefix-path" ? `/docs/${to}/:path*` : `/docs/${to}`,
                    statusCode: 301,
                });
            }
        }
    }

    // The very old top-level CLI prefix. `overview` sits beside the commands
    // folder, so it is named before the command catch-all.
    out.push(
        { source: "/cli", destination: "/docs/reference/cli", statusCode: 301 },
        { source: "/docs/cli", destination: "/docs/reference/cli", statusCode: 301 },
        {
            source: "/cli/overview",
            destination: "/docs/reference/cli/surrealdb-cli/overview",
            statusCode: 301,
        },
        {
            source: "/docs/cli/overview",
            destination: "/docs/reference/cli/surrealdb-cli/overview",
            statusCode: 301,
        },
        {
            source: "/cli/:path*",
            destination: "/docs/reference/cli/surrealdb-cli/commands/:path*",
            statusCode: 301,
        },
        {
            source: "/docs/cli/:path*",
            destination: "/docs/reference/cli/surrealdb-cli/commands/:path*",
            statusCode: 301,
        },
    );

    return out;
}

/**
 * Old `/docs/integration(s)/sdks/*` pages → the per-language docs. Without
 * these, the general `integrations → build/integrations` prefix rule sends
 * SDK paths to `/docs/build/integrations/sdks/*`, which does not exist - a
 * redirect chain that ends in a 404 (verified August 2026). Spread before
 * `legacyPrefixRedirects("integrations", …)` so these rules win.
 */
function legacyIntegrationSdkRedirects(): Redirect[] {
    const sdks: [string, string][] = [
        ["nodejs", "javascript"],
        ["deno", "javascript"],
        ["dotnet", "dotnet"],
        ["golang", "golang"],
        ["java", "java"],
        ["javascript", "javascript"],
        ["kotlin", "kotlin"],
        ["php", "php"],
        ["python", "python"],
        ["rust", "rust"],
    ];

    const out: Redirect[] = [];

    for (const [from, to] of sdks) {
        for (const source of [`/integrations/sdks/${from}`, `/docs/integrations/sdks/${from}`]) {
            out.push(
                { source, destination: `/docs/languages/${to}`, statusCode: 301 },
                // Deeper legacy paths collapse onto the language hub; mapping
                // them through would name pages that no longer exist.
                {
                    source: `${source}/:path*`,
                    destination: `/docs/languages/${to}`,
                    statusCode: 301,
                },
            );
        }
    }

    // The section index and any SDK slug not named above.
    out.push(
        { source: "/integrations/sdks", destination: "/docs/languages", statusCode: 301 },
        { source: "/docs/integrations/sdks", destination: "/docs/languages", statusCode: 301 },
        { source: "/integrations/sdks/:path*", destination: "/docs/languages", statusCode: 301 },
        {
            source: "/docs/integrations/sdks/:path*",
            destination: "/docs/languages",
            statusCode: 301,
        },
    );

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

/**
 * Overview section consolidation (August 2026). The Getting started overview
 * held four pages where two would do, so `architecture` absorbed `concepts` and
 * moved under Data models, and `transactions-and-isolation` merged into the
 * querying guide that already covered `BEGIN` and `COMMIT`.
 *
 * All three sources sat directly under `/docs`, so each is an exact rule - there
 * is no subtree below them to carry through.
 */
function overviewConsolidationRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["/architecture", "/docs/learn/data-models/architecture"],
        ["/concepts", "/docs/learn/data-models/architecture"],
        ["/transactions-and-isolation", "/docs/learn/querying/concepts-and-guides/transactions"],
    ];

    return moves.flatMap(([source, destination]): Redirect[] => [
        { source, destination, statusCode: 301 },
        { source: `/docs${source}`, destination, statusCode: 301 },
    ]);
}

export const docsRedirects: Redirect[] = [
    ...authDiscoveryRedirects(),
    { source: "/start", destination: "/what-is-surrealdb", statusCode: 302 },
    ...overviewConsolidationRedirects(),
    ...legacyPrefixRedirects("surrealql", "reference/query-language"),
    // `surrealist/*` cannot map path-for-path: the tree it points at was
    // consolidated to three pages. The two survivors are named, and the rest go
    // to the section, same as the `explore/surrealist` rules further down.
    {
        source: "/surrealist/advanced-topics/search-and-shortcuts",
        destination: "/explore/studio/search-and-shortcuts",
        statusCode: 301,
    },
    {
        source: "/surrealist/advanced-topics/surrealql-editors",
        destination: "/explore/studio/surrealql-editors",
        statusCode: 301,
    },
    { source: "/surrealist", destination: "/explore/studio", statusCode: 301 },
    { source: "/surrealist/:path*", destination: "/explore/studio", statusCode: 301 },
    ...legacyPrefixRedirects("surrealml", "explore/ml-models"),
    ...legacyIntegrationSdkRedirects(),
    ...legacyPrefixRedirects("integrations", "build/integrations"),
    ...legacyPrefixRedirects("tutorials", "explore/tutorials"),
    ...sdkRedirects(),
    ...legacyMigratingRedirects(),
    ...legacySurrealdbTreeRedirects(),
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
    // The Surrealist tree was consolidated into a three-page Studio section, so
    // only these two pages have a counterpart to point at - both promoted out of
    // `advanced-topics/`. They are listed before the wildcard below, which would
    // otherwise swallow them.
    {
        source: "/docs/explore/surrealist/advanced-topics/search-and-shortcuts",
        destination: "/docs/explore/studio/search-and-shortcuts",
        statusCode: 301,
    },
    {
        source: "/docs/explore/surrealist/advanced-topics/surrealql-editors",
        destination: "/docs/explore/studio/surrealql-editors",
        statusCode: 301,
    },
    // Everything else under `surrealist/` was removed rather than moved, so it
    // goes to the section that absorbed it. Mapping the path through instead
    // would name a page that does not exist, which is now a 404 rather than a
    // quiet walk back up the tree.
    {
        source: "/docs/explore/surrealist/:path*",
        destination: "/docs/explore/studio",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist",
        destination: "/explore/studio",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist/advanced-topics/search-and-shortcuts",
        destination: "/explore/studio/search-and-shortcuts",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist/advanced-topics/surrealql-editors",
        destination: "/explore/studio/surrealql-editors",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist/:path*",
        destination: "/explore/studio",
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

            if (normalized !== sourceBase && !normalized.startsWith(`${sourceBase}/`)) {
                continue;
            }

            // The matched path carries through only where the destination asks
            // for it. A destination without `:path*` is a fixed target, and
            // Vercel sends every match there; appending the suffix anyway made
            // dev and preview resolve a URL production never produces, so a
            // wildcard rule collapsing a removed tree onto one page looked
            // broken locally and worked in production.
            if (!destination.endsWith("/:path*")) {
                return { destination, statusCode };
            }

            const destBase = destination.slice(0, -"/:path*".length);
            const suffix = normalized.slice(sourceBase.length);

            return { destination: `${destBase}${suffix}`, statusCode };
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
