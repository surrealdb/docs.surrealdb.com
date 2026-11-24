import type { Redirect } from "@vercel/config/v1";
import { shortUrls } from "./short-urls";

/**
 * Legacy path prefixes from src-old (see src-old/content/config.ts urlForCollection)
 * → new information-architecture paths under src/content + src/pages.
 */
function legacyPrefixRedirects(from: string, to: string): Redirect[] {
    return [
        { source: `/docs/${from}`, destination: `/${to}`, statusCode: 301 },
        { source: `/docs/${from}/:path*`, destination: `/${to}/:path*`, statusCode: 301 },
        { source: `/${from}`, destination: `/${to}`, statusCode: 301 },
        { source: `/${from}/:path*`, destination: `/${to}/:path*`, statusCode: 301 },
    ];
}

/** Old /sdk and /:version/sdk/* → index collection language docs. */
function sdkRedirects(): Redirect[] {
    const versions = ["1.x", "2.x", "3.x"] as const;
    const out: Redirect[] = [
        { source: "/docs/sdk/:sdk", destination: "/docs/languages/:sdk", statusCode: 301 },
        {
            source: "/docs/sdk/:sdk/:path*",
            destination: "/docs/languages/:sdk/:path*",
            statusCode: 301,
        },
        { source: "/sdk/:sdk", destination: "/docs/languages/:sdk", statusCode: 301 },
        { source: "/sdk/:sdk/:path*", destination: "/docs/languages/:sdk/:path*", statusCode: 301 },
    ];
    for (const v of versions) {
        out.push(
            { source: `/docs/${v}/sdk/:sdk`, destination: "/languages/:sdk", statusCode: 301 },
            {
                source: `/docs/${v}/sdk/:sdk/:path*`,
                destination: "/languages/:sdk/:path*",
                statusCode: 301,
            },
            { source: `/${v}/sdk/:sdk`, destination: "/languages/:sdk", statusCode: 301 },
            {
                source: `/${v}/sdk/:sdk/:path*`,
                destination: "/languages/:sdk/:path*",
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
            destination: "/docs/operate/observability",
            statusCode: 301,
        },
        {
            source: "/docs/build/deployment/observability/:path*",
            destination: "/docs/operate/observability/:path*",
            statusCode: 301,
        },
        {
            source: "/build/deployment/observability",
            destination: "/docs/operate/observability",
            statusCode: 301,
        },
        {
            source: "/build/deployment/observability/:path*",
            destination: "/docs/operate/observability/:path*",
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
            destination: `/docs/integrate/migrating/from-other-databases/from-${d}`,
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
        // Security is the most-followed branch of the old tree - it is what
        // "how do I authenticate with SurrealDB" resolves to in search results
        // and in model training data. The catch-all below used to swallow it
        // and answer with the product introduction, so an agent asking about
        // authentication was handed a page that never mentions it (observed in
        // an agent trace, September 2026). Named here so it lands on the
        // security section instead.
        ["surrealdb/security", "learn/security", "prefix"],
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
            destination: "/docs/reference/cli/db",
            statusCode: 301,
        },
        {
            source: "/docs/cli/overview",
            destination: "/docs/reference/cli/db",
            statusCode: 301,
        },
        {
            source: "/cli/:path*",
            destination: "/docs/reference/cli/db/commands/:path*",
            statusCode: 301,
        },
        {
            source: "/docs/cli/:path*",
            destination: "/docs/reference/cli/db/commands/:path*",
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
/** SurrealDB 4.0 renames Surrealism modules to extensions. */
function extensionRedirects(): Redirect[] {
    const moves: [string, string][] = [
        [
            "reference/query-language/statements/define/module",
            "reference/query-language/statements/define/extension",
        ],
        ["reference/cli/db/commands/module", "reference/cli/ext"],
        ["reference/cli/db/commands/extension", "reference/cli/ext"],
        ["reference/cli/modules", "reference/cli/ext"],
        [
            "learn/extensions/guides/creating-custom-modules",
            "learn/extensions/guides/creating-custom-extensions",
        ],
        [
            "learn/extensions/guides/module-architecture",
            "learn/extensions/guides/extension-architecture",
        ],
        ["explore/cli/modules", "reference/cli/guides/extensions"],
    ];

    // Source without `/docs` (the www rewrite strips it); destination with `/docs`.
    return moves.map(([from, to]) => ({
        source: `/${from}`,
        destination: `/docs/${to}`,
        statusCode: 301,
    }));
}
/**
 * The `surreal` launcher replaced the separate `surrealctl` and `surreal` tools,
 * and the two CLI sections became one.
 *
 * - The `surrealctl` guide moved from `manage/surrealctl` to the Cloud guides
 *   under `explore/cli/cloud`, and its install page to `explore/cli/install`.
 * - The reference folders were renamed after the components they document:
 *   `surrealctl` is `cloud`, and `surrealdb-cli` is `db`. Both landing pages
 *   moved from `overview` to the folder index.
 * - `surrealctl spectron` was the memory command group and has no page for now,
 *   so it lands on the commands index.
 *
 * Page renames are listed before the folder rule that would otherwise swallow
 * them.
 */
function surrealCliRedirects(): Redirect[] {
    const moves: [string, string, "exact" | "prefix"][] = [
        ["manage/surrealctl/install", "reference/cli/guides/install", "exact"],
        ["reference/cli/surrealctl/install", "reference/cli/guides/install", "exact"],
        ["manage/surrealctl", "reference/cli/guides/cloud", "prefix"],
        ["reference/cli/surrealctl/overview", "reference/cli/cloud", "exact"],
        ["reference/cli/surrealctl/commands/spectron", "reference/cli/cloud/commands", "exact"],
        ["reference/cli/surrealctl", "reference/cli/cloud", "prefix"],
        ["reference/cli/surrealdb-cli/overview", "reference/cli/db", "exact"],
        ["reference/cli/surrealdb-cli", "reference/cli/db", "prefix"],
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
 * The .NET reference follows the layout of the other SDKs: one page for each
 * concept at `/reference/dotnet/concepts/<concept>`, with the method pages
 * folded into the concept they belong to. The pages that held a method on its
 * own, the `core` folder that became `concepts`, and the data types page go to
 * their new page in one hop, with the method's anchor where the old page was
 * one method. The old `/languages/dotnet/...` addresses go there too. These
 * come before the generic SDK reference moves, which no longer name these
 * pages.
 */
function dotnetReferenceRedirects(): Redirect[] {
    const concepts = "reference/dotnet/concepts";
    const moves: [string, string][] = [
        ["methods", "reference/dotnet"],
        ["methods/authenticate", `${concepts}/authentication#authenticate`],
        ["methods/signin", `${concepts}/authentication#signin`],
        ["methods/signup", `${concepts}/authentication#signup`],
        ["methods/invalidate", `${concepts}/authentication#invalidate`],
        ["methods/info", `${concepts}/authentication#info`],
        ["methods/connect", `${concepts}/connecting-to-surrealdb#connect`],
        ["methods/use", `${concepts}/connecting-to-surrealdb#use`],
        ["methods/health", `${concepts}/connecting-to-surrealdb#health`],
        ["methods/version", `${concepts}/connecting-to-surrealdb#version`],
        ["methods/query", `${concepts}/executing-queries#query`],
        ["methods/raw-query", `${concepts}/executing-queries#raw_query`],
        ["methods/run", `${concepts}/executing-queries#run`],
        ["methods/set", `${concepts}/executing-queries#set`],
        ["methods/unset", `${concepts}/executing-queries#unset`],
        ["methods/create", `${concepts}/data-manipulation#create`],
        ["methods/delete", `${concepts}/data-manipulation#delete`],
        ["methods/insert", `${concepts}/data-manipulation#insert`],
        ["methods/insert-relation", `${concepts}/data-manipulation#insert_relation`],
        ["methods/merge", `${concepts}/data-manipulation#merge`],
        ["methods/patch", `${concepts}/data-manipulation#patch`],
        ["methods/relate", `${concepts}/data-manipulation#relate`],
        ["methods/select", `${concepts}/data-manipulation#select`],
        ["methods/update", `${concepts}/data-manipulation#update`],
        ["methods/upsert", `${concepts}/data-manipulation#upsert`],
        ["methods/kill", `${concepts}/live-queries#kill`],
        ["methods/listen_live", `${concepts}/live-queries#listen-live`],
        ["methods/live-query", `${concepts}/live-queries#live-query`],
        ["methods/live-raw-query", `${concepts}/live-queries#live-raw-query`],
        ["methods/live-table", `${concepts}/live-queries#live-table`],
        ["methods/import", `${concepts}/import-and-export#import`],
        ["methods/export", `${concepts}/import-and-export#export`],
        ["core", `${concepts}/connecting-to-surrealdb`],
        ["core/create-a-new-connection", `${concepts}/connecting-to-surrealdb`],
        ["core/connection-strings", `${concepts}/connecting-to-surrealdb#connection-strings`],
        ["core/writing-surrealql", `${concepts}/executing-queries`],
        ["core/parameters", `${concepts}/executing-queries#set`],
        ["core/streaming", `${concepts}/live-queries`],
        ["core/authentication", `${concepts}/authentication`],
        ["core/data-manipulation", `${concepts}/data-manipulation`],
        ["core/multiple-sessions", `${concepts}/multiple-sessions`],
        ["core/transactions", `${concepts}/transactions`],
        ["core/dependency-injection", `${concepts}/dependency-injection`],
        ["core/logging", `${concepts}/logging`],
        ["data-types", `${concepts}/value-types`],
    ];

    return moves.flatMap(([page, destination]) =>
        ["reference/dotnet", "languages/dotnet"]
            .flatMap((base) => [`/docs/${base}/${page}`, `/${base}/${page}`])
            .map(
                (source): Redirect => ({
                    source,
                    destination: `/docs/${destination}`,
                    statusCode: 301,
                }),
            ),
    );
}

/**
 * The SDK references that follow the shared concept layout: a method that had a
 * page of its own is now a section of the concept page it belongs to, and a
 * concept page that was named differently has the slug that the other SDKs
 * use. Each old address goes to its new page in one hop, with the method's
 * anchor where the old page was one method, from the current address and from
 * the `/languages/<sdk>` address that the SDK documentation used before it
 * moved to the reference. These come before the generic SDK reference moves,
 * which no longer name these pages.
 */
function sdkConceptRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["reference/rust/concepts/authenticating-users", "reference/rust/concepts/authentication"],
        ["reference/rust/concepts/working-with-types", "reference/rust/concepts/value-types"],
        ["reference/rust/concepts/multi-tenancy", "reference/rust/concepts/multiple-sessions"],
        [
            "reference/mojo/methods/begin-transaction",
            "reference/mojo/concepts/transactions#begin-transaction",
        ],
        [
            "reference/mojo/methods/transaction-multi",
            "reference/mojo/concepts/transactions#transaction-multi",
        ],
        [
            "reference/php/v1/methods/insert-relation",
            "reference/php/v1/concepts/data-manipulation#insertrelation",
        ],
        [
            "reference/mojo/methods/insert-relation",
            "reference/mojo/concepts/data-manipulation#insert-relation",
        ],
        [
            "reference/php/v1/methods/authenticate",
            "reference/php/v1/concepts/authentication#authenticate",
        ],
        [
            "reference/php/v1/concepts/connecting",
            "reference/php/v1/concepts/connecting-to-surrealdb",
        ],
        ["reference/php/v1/concepts/data-types", "reference/php/v1/concepts/value-types"],
        ["reference/php/v2/concepts/data-types", "reference/php/v2/concepts/value-types"],
        [
            "reference/swift/methods/authenticate",
            "reference/swift/concepts/authentication#authenticate",
        ],
        [
            "reference/mojo/methods/authenticate",
            "reference/mojo/concepts/authentication#authenticate",
        ],
        [
            "reference/php/v1/methods/invalidate",
            "reference/php/v1/concepts/authentication#invalidate",
        ],
        ["reference/rust/concepts/transaction", "reference/rust/concepts/transactions"],
        ["reference/swift/concepts/connecting", "reference/swift/concepts/connecting-to-surrealdb"],
        [
            "reference/php/v1/methods/query-raw",
            "reference/php/v1/concepts/executing-queries#queryraw",
        ],
        ["reference/php/v2/concepts/sessions", "reference/php/v2/concepts/multiple-sessions"],
        [
            "reference/swift/methods/invalidate",
            "reference/swift/concepts/authentication#invalidate",
        ],
        ["reference/mojo/methods/invalidate", "reference/mojo/concepts/authentication#invalidate"],
        [
            "reference/swift/methods/query-raw",
            "reference/swift/concepts/executing-queries#query-raw",
        ],
        [
            "reference/php/v1/methods/connect",
            "reference/php/v1/concepts/connecting-to-surrealdb#connect",
        ],
        [
            "reference/php/v1/methods/version",
            "reference/php/v1/concepts/connecting-to-surrealdb#version",
        ],
        [
            "reference/php/v1/methods/health",
            "reference/php/v1/concepts/connecting-to-surrealdb#health",
        ],
        [
            "reference/php/v1/methods/status",
            "reference/php/v1/concepts/connecting-to-surrealdb#status",
        ],
        ["reference/php/v1/methods/signup", "reference/php/v1/concepts/authentication#signup"],
        ["reference/php/v1/methods/signin", "reference/php/v1/concepts/authentication#signin"],
        ["reference/php/v1/methods/select", "reference/php/v1/concepts/data-manipulation#select"],
        ["reference/php/v1/methods/create", "reference/php/v1/concepts/data-manipulation#create"],
        ["reference/php/v1/methods/insert", "reference/php/v1/concepts/data-manipulation#insert"],
        ["reference/php/v1/methods/update", "reference/php/v1/concepts/data-manipulation#update"],
        ["reference/php/v1/methods/upsert", "reference/php/v1/concepts/data-manipulation#upsert"],
        ["reference/php/v1/methods/delete", "reference/php/v1/concepts/data-manipulation#delete"],
        ["reference/php/v1/methods/import", "reference/php/v1/concepts/import-and-export#import"],
        ["reference/php/v1/methods/export", "reference/php/v1/concepts/import-and-export#export"],
        [
            "reference/swift/methods/connect",
            "reference/swift/concepts/connecting-to-surrealdb#connect",
        ],
        [
            "reference/mojo/methods/connect",
            "reference/mojo/concepts/connecting-to-surrealdb#connect",
        ],
        [
            "reference/mojo/methods/version",
            "reference/mojo/concepts/connecting-to-surrealdb#version",
        ],
        [
            "reference/php/v1/methods/close",
            "reference/php/v1/concepts/connecting-to-surrealdb#close",
        ],
        ["reference/php/v1/methods/query", "reference/php/v1/concepts/executing-queries#query"],
        ["reference/php/v1/methods/unset", "reference/php/v1/concepts/executing-queries#unset"],
        ["reference/php/v1/methods/merge", "reference/php/v1/concepts/data-manipulation#merge"],
        ["reference/php/v1/methods/patch", "reference/php/v1/concepts/data-manipulation#patch"],
        ["reference/swift/methods/signin", "reference/swift/concepts/authentication#signin"],
        ["reference/swift/methods/signup", "reference/swift/concepts/authentication#signup"],
        ["reference/swift/methods/select", "reference/swift/concepts/data-manipulation#select"],
        ["reference/swift/methods/create", "reference/swift/concepts/data-manipulation#create"],
        ["reference/swift/methods/update", "reference/swift/concepts/data-manipulation#update"],
        ["reference/swift/methods/upsert", "reference/swift/concepts/data-manipulation#upsert"],
        ["reference/swift/methods/delete", "reference/swift/concepts/data-manipulation#delete"],
        ["reference/mojo/methods/health", "reference/mojo/concepts/connecting-to-surrealdb#health"],
        ["reference/mojo/methods/signin", "reference/mojo/concepts/authentication#signin"],
        ["reference/mojo/methods/signup", "reference/mojo/concepts/authentication#signup"],
        ["reference/mojo/methods/select", "reference/mojo/concepts/data-manipulation#select"],
        ["reference/mojo/methods/create", "reference/mojo/concepts/data-manipulation#create"],
        ["reference/mojo/methods/insert", "reference/mojo/concepts/data-manipulation#insert"],
        ["reference/mojo/methods/update", "reference/mojo/concepts/data-manipulation#update"],
        ["reference/mojo/methods/upsert", "reference/mojo/concepts/data-manipulation#upsert"],
        ["reference/mojo/methods/delete", "reference/mojo/concepts/data-manipulation#delete"],
        ["reference/php/v1/methods/info", "reference/php/v1/concepts/authentication#info"],
        ["reference/swift/methods/query", "reference/swift/concepts/executing-queries#query"],
        ["reference/mojo/methods/close", "reference/mojo/concepts/connecting-to-surrealdb#close"],
        ["reference/mojo/methods/query", "reference/mojo/concepts/executing-queries#query"],
        ["reference/mojo/methods/unset", "reference/mojo/concepts/executing-queries#unset"],
        ["reference/mojo/methods/merge", "reference/mojo/concepts/data-manipulation#merge"],
        ["reference/mojo/methods/patch", "reference/mojo/concepts/data-manipulation#patch"],
        ["reference/php/v1/methods/use", "reference/php/v1/concepts/connecting-to-surrealdb#use"],
        ["reference/php/v1/methods/run", "reference/php/v1/concepts/executing-queries#run"],
        ["reference/php/v1/methods/let", "reference/php/v1/concepts/executing-queries#let"],
        ["reference/rust/concepts/live", "reference/rust/concepts/live-queries"],
        ["reference/swift/methods/live", "reference/swift/concepts/live-queries#live"],
        ["reference/swift/methods/kill", "reference/swift/concepts/live-queries#kill"],
        ["reference/mojo/methods/call", "reference/mojo/concepts/executing-queries#call"],
        ["reference/mojo/methods/live", "reference/mojo/concepts/live-queries#live-query"],
        ["reference/mojo/methods/kill", "reference/mojo/concepts/live-queries#kill"],
        ["reference/swift/methods/use", "reference/swift/concepts/connecting-to-surrealdb#use"],
        ["reference/mojo/methods/use", "reference/mojo/concepts/connecting-to-surrealdb#use"],
        ["reference/mojo/methods/set", "reference/mojo/concepts/executing-queries#set"],
        ["reference/mojo/methods/api", "reference/mojo/concepts/executing-queries#api"],
        ["reference/swift/data-types", "reference/swift/concepts/value-types"],
        ["reference/php/v1/methods", "reference/php/v1"],
        ["reference/rust/concepts", "reference/rust/concepts/connecting-to-surrealdb"],
        ["reference/swift/methods", "reference/swift"],
        ["reference/mojo/methods", "reference/mojo"],
    ];

    return moves.flatMap(([page, destination]) =>
        [page, page.replace(/^reference\//, "languages/")]
            .flatMap((from) => [`/docs/${from}`, `/${from}`])
            .map(
                (source): Redirect => ({
                    source,
                    destination: `/docs/${destination}`,
                    statusCode: 301,
                }),
            ),
    );
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
        ["languages/dotnet/embedding", "reference/dotnet/embedding", "exact"],
        ["languages/dotnet/installation", "reference/dotnet/installation", "exact"],
        ["languages/java/concepts", "reference/java/concepts", "prefix"],
        ["languages/java/api", "reference/java/api", "prefix"],
        ["languages/java/installation", "reference/java/installation", "exact"],
        ["languages/kotlin/concepts", "reference/kotlin/concepts", "prefix"],
        ["languages/kotlin/api", "reference/kotlin/api", "prefix"],
        ["languages/kotlin/installation", "reference/kotlin/installation", "exact"],
        ["languages/php/v1", "reference/php/v1", "exact"],
        ["languages/php/v1/concepts", "reference/php/v1/concepts", "prefix"],
        ["languages/php/v1/installation", "reference/php/v1/installation", "exact"],
        ["languages/php/v2", "reference/php/v2", "exact"],
        ["languages/php/v2/migration", "reference/php/v2/migration", "exact"],
        ["languages/php/v2/concepts", "reference/php/v2/concepts", "prefix"],
        ["languages/php/v2/api", "reference/php/v2/api", "prefix"],
        ["languages/php/v2/installation", "reference/php/v2/installation", "exact"],
        ["languages/php/frameworks", "reference/php/frameworks", "prefix"],
        ["languages/mojo/concepts", "reference/mojo/concepts", "prefix"],
        ["languages/mojo/installation", "reference/mojo/installation", "exact"],
        ["languages/python/concepts", "reference/python/concepts", "prefix"],
        ["languages/python/api", "reference/python/api", "prefix"],
        ["languages/python/installation", "reference/python/installation", "exact"],
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
 * Surqlize moved out of the SDK trees into the Libraries section. Page names
 * are unchanged, so each old tree needs its folder, its landing page and one
 * wildcard. The wildcard also serves `.md` requests, because a `.md` suffix is
 * only more path.
 */
function librariesRedirects(): Redirect[] {
    const trees: [string, string][] = [
        ["reference/php/libraries", "libraries/surqlize-php"],
        ["reference/javascript/libraries", "libraries/surqlize-typescript"],
        ["languages/php/libraries", "libraries/surqlize-php"],
    ];
    const out: Redirect[] = [];

    for (const [from, to] of trees) {
        out.push(
            { source: `/${from}`, destination: "/libraries", statusCode: 301 },
            { source: `/${from}/surqlize`, destination: `/${to}`, statusCode: 301 },
            { source: `/${from}/surqlize/:path*`, destination: `/${to}/:path*`, statusCode: 301 },
        );
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
        ["build/ai-agents/connect-mcp-to-your-editor", "integrate/ai-agents/mcp/embedded"],
        // Points at the folder index, not at the old stuttering filename that
        // `stutteringPathRedirects` now moves - otherwise this rule redirects
        // to a path that immediately redirects again.
        ["build/ai-agents/agent-rules", "integrate/integrations/agent-rules"],
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
            "operate/instances/private-connectivity",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/data-export-and-backup",
            "operate/instances/backups",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/logs",
            "operate/instances/monitoring",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/metrics",
            "operate/instances/monitoring",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/monitoring-overview",
            "operate/instances/monitoring",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/migrating-data",
            "operate/instances/import-and-export",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/network-access",
            "operate/instances/network-access",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/operations/scaling",
            "operate/instances/scaling",
            "exact",
        ],
        ["build/deployment/surrealdb-cloud/operations", "operate/instances", "prefix"],

        // Cloud onboarding → organisation and instance creation.
        [
            "build/deployment/surrealdb-cloud/getting-started/create-an-account",
            "operate/organisations/sign-in",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/getting-started/create-an-instance",
            "operate/instances/create",
            "exact",
        ],
        [
            "build/deployment/surrealdb-cloud/getting-started/create-an-organisation",
            "operate/organisations",
            "exact",
        ],
        ["build/deployment/surrealdb-cloud/getting-started", "operate/organisations", "prefix"],

        // Billing, support, FAQs, and referrals keep their slugs under organisations.
        ["build/deployment/surrealdb-cloud/billing-and-support", "operate/organisations", "prefix"],

        // Connecting → instances/connect (the Surrealist page was renamed to Studio).
        [
            "build/deployment/surrealdb-cloud/connecting/via-surrealist",
            "operate/instances/connect/via-studio",
            "exact",
        ],
        ["build/deployment/surrealdb-cloud/connecting", "operate/instances/connect", "prefix"],

        // Cloud tooling pages are Studio features, not Cloud features.
        ["build/deployment/surrealdb-cloud/tooling", "reference/studio", "prefix"],

        // Remaining Cloud pages fold into the instances section index.
        ["build/deployment/surrealdb-cloud/what-is-surrealdb-cloud", "operate/instances", "exact"],
        ["build/deployment/surrealdb-cloud", "operate/instances", "prefix"],

        // Self-hosted deployment → the Manage section. The Amazon EKS, Azure AKS,
        // and Google GKE pages merged into a single Managed Kubernetes page.
        [
            "build/deployment/self-hosted/amazon-eks",
            "operate/self-hosted/managed-kubernetes",
            "exact",
        ],
        [
            "build/deployment/self-hosted/azure-aks",
            "operate/self-hosted/managed-kubernetes",
            "exact",
        ],
        [
            "build/deployment/self-hosted/google-gke",
            "operate/self-hosted/managed-kubernetes",
            "exact",
        ],
        ["build/deployment/self-hosted/overview", "operate/self-hosted", "exact"],
        // The self-hosted Docker page was a near copy of the Running one, and was
        // merged into it. Both rules precede the folder rule below.
        ["build/deployment/self-hosted/docker", "running/docker", "exact"],
        ["manage/self-hosted/docker", "running/docker", "exact"],
        // `kubernetes` keeps its slug, so the folder rule covers it.
        ["build/deployment/self-hosted", "operate/self-hosted", "prefix"],

        // The deployment section index became the Deployment models page. There is
        // deliberately no `build/deployment/:path*` rule: the subtrees above cover
        // every page, and `build/deployment/observability` is handled separately by
        // `deploymentObservabilityToManageRedirects`.
        ["build/deployment", "operate/self-hosted/deployment-models", "exact"],

        // manage/cloud split into manage/instances and manage/organisations.
        ["manage/cloud/architecture", "operate/instances/architecture", "exact"],
        ["manage/cloud/aws-marketplace", "operate/organisations/aws-marketplace", "exact"],
        ["manage/cloud/backups-and-recovery", "operate/instances/backups", "exact"],
        ["manage/cloud/billing-and-support", "operate/organisations/billing", "exact"],
        ["manage/cloud/high-availability", "operate/instances/high-availability", "exact"],
        ["manage/cloud/instance-management", "operate/instances/create", "exact"],
        ["manage/cloud/monitoring-and-logs", "operate/instances/monitoring", "exact"],
        ["manage/cloud/network-access", "operate/instances/network-access", "exact"],
        [
            "manage/cloud/organisations-and-users",
            "operate/organisations/members-and-roles",
            "exact",
        ],
        ["manage/cloud/patches-and-upgrades", "operate/instances/versions-and-upgrades", "exact"],
        ["manage/cloud/scaling", "operate/instances/scaling", "exact"],
        ["manage/cloud", "operate/instances", "prefix"],

        // The legacy `/cloud/*` prefix used to point at `manage/cloud`; send it
        // straight to the final destination rather than chaining through it.
        ["cloud", "operate/instances", "prefix"],
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

/** The source shape a markdown twin uses; see `withMarkdownTwins`. */
const MD_WILDCARD = "/:path(.*\\.md)";

/**
 * Give every collapsing wildcard rule a `.md` twin, placed just before it.
 *
 * A wildcard whose destination carries `:path*` keeps a `.md` suffix on its
 * own, because the suffix is only more path - `/self-hosted/overview.md` lands
 * on `/docs/running/overview.md`. One that collapses a removed tree onto a
 * fixed page drops it, so `/surrealist/removed.md` redirected to
 * `/docs/explore/studio` and answered an agent asking for markdown with HTML.
 * 33 rules collapse that way against 93 that carry, and nothing in either
 * source says which kind it is.
 *
 * The twin matches `.md` paths only. `:path(.*\.md)` rather than `:path*.md`,
 * which path-to-regexp also accepts but compiles to a pattern that additionally
 * matches `/surrealist.md` - the markdown form of a page named `surrealist`,
 * which belongs to that page and not to this rule.
 *
 * Derived rather than written out, so a wildcard added later gets its twin
 * without anyone remembering that this has to be done. Sources already carrying
 * `/docs` are skipped: they are inert in production, where the prefix is
 * stripped before this project sees the request, and the dev middleware tries
 * the stripped path first.
 */
function withMarkdownTwins(rules: Redirect[]): Redirect[] {
    return rules.flatMap((rule) => {
        const collapsing = rule.source.endsWith("/:path*") && !rule.destination.endsWith("/:path*");

        if (!collapsing || rule.source.startsWith("/docs/")) {
            return [rule];
        }

        const base = rule.source.slice(0, -"/:path*".length);

        return [
            { ...rule, source: `${base}${MD_WILDCARD}`, destination: `${rule.destination}.md` },
            rule,
        ];
    });
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
    // The guides on what Agent Memory does with memory live in their own
    // section, so their folders keep their paths below it. Listed first so an
    // old `/spectron` link also needs one hop.
    const memoryAndKnowledge = [
        "ingest",
        "sessions",
        "retrieve",
        "reasoning",
        "operations",
        "tuning",
    ];
    const section = "/docs/agent-memory/learn";
    const sectionMoves = memoryAndKnowledge.flatMap((folder): [string, string][] =>
        ["/agent-memory", "/spectron", "/spectron/agent-memory"].flatMap(
            (root): [string, string][] => [
                [`${root}/${folder}`, `${section}/${folder}`],
                [`${root}/${folder}/:path*`, `${section}/${folder}/:path*`],
            ],
        ),
    );

    const moves: [string, string][] = [
        ...sectionMoves,
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
        // Folded into From context to memory, which covers the same ground
        [
            "/agent-memory/welcome/why-agentic-memory",
            "/docs/agent-memory/welcome/from-context-to-memory",
        ],
        [
            "/spectron/welcome/why-agentic-memory",
            "/docs/agent-memory/welcome/from-context-to-memory",
        ],
        // Removed in October 2026: these described the management API and the
        // internal schema, which customers on SurrealDB Cloud do not use. Listed
        // before the `/spectron` prefix rules so the old paths need one hop.
        ["/agent-memory/reference/management-api", "/docs/agent-memory/operate/cloud"],
        ["/spectron/reference/management-api", "/docs/agent-memory/operate/cloud"],
        ["/agent-memory/reference/data-model-and-schema", "/docs/agent-memory/reference"],
        ["/spectron/reference/data-model-and-schema", "/docs/agent-memory/reference"],
        // The Get started page is the one quickstart. The Cloud page explains
        // how contexts work on Cloud, so it moved to Operate, and the two pages
        // that described a library Agent Memory does not offer were removed.
        ...(
            [
                ["quickstarts/surrealdb-cloud", "/docs/agent-memory/operate/cloud"],
                ["quickstarts/hosted", "/docs/agent-memory#quickstart"],
                ["quickstarts/embedded", "/docs/agent-memory#quickstart"],
                ["quickstarts", "/docs/agent-memory#quickstart"],
                [
                    "integrations/surfaces/embedded-library",
                    "/docs/agent-memory/integrations/surfaces/rest",
                ],
            ] as [string, string][]
        ).flatMap(([from, to]): [string, string][] =>
            ["/agent-memory", "/spectron"].map((root): [string, string] => [`${root}/${from}`, to]),
        ),
        // The architecture glossary is part of the glossary in Reference. Listed
        // before the folder rules below so each older address needs one hop.
        ...["/agent-memory", "/spectron"].flatMap((root): [string, string][] =>
            ["architecture", "learn/architecture"].map((folder): [string, string] => [
                `${root}/${folder}/glossary`,
                "/docs/agent-memory/reference/glossary",
            ]),
        ),
        // Concepts moved into Learn, Enterprise into Deploy, and Memory & knowledge
        // was renamed Learn. Listed before the `/spectron` prefix rules so the
        // old paths need one hop.
        ...(
            [
                ["memory-and-knowledge", "learn"],
                ["mental-model", "learn/mental-model"],
                ["architecture", "learn/architecture"],
                ["enterprise", "operate/enterprise"],
            ] as [string, string][]
        ).flatMap(([from, to]): [string, string][] =>
            ["/agent-memory", "/spectron"].flatMap((root): [string, string][] => [
                [`${root}/${from}`, `/docs/agent-memory/${to}`],
                [`${root}/${from}/:path*`, `/docs/agent-memory/${to}/:path*`],
            ]),
        ),
        // Flattened section - the hub page's content lives at a new slug.
        ["/spectron/agent-memory", "/docs/agent-memory/learn"],
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
 * held five pages where one would do, so `architecture` absorbed `concepts` and
 * moved under Data models, `transactions-and-isolation` merged into the querying
 * guide that already covered `BEGIN` and `COMMIT`, and `sample-queries` moved
 * into the SurrealQL section. `what-is-surrealdb` is all that remains beside the
 * section index.
 *
 * Every source sat directly under `/docs`, so each is an exact rule - there is
 * no subtree below them to carry through.
 */
function overviewConsolidationRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["/architecture", "/docs/learn/data-models/architecture"],
        ["/concepts", "/docs/learn/data-models/architecture"],
        ["/transactions-and-isolation", "/docs/learn/querying/concepts-and-guides/transactions"],
        // Runnable SurrealQL examples belong beside the pages that teach the
        // language, next to the GraphQL and GQL pages of the same name.
        ["/sample-queries", "/docs/learn/querying/surrealql/sample-queries"],
    ];

    return moves.flatMap(([source, destination]): Redirect[] => [
        { source, destination, statusCode: 301 },
        { source: `/docs${source}`, destination, statusCode: 301 },
    ]);
}

/**
 * The Enterprise subtree, collapsed onto one page.
 *
 * Twelve of its thirteen pages were a title, a description and an H1 with no
 * body - `what-ee-is.mdx` was literally `# What EE is` and stopped - and the
 * thirteenth was a signpost to the observability section. They were reachable,
 * indexed, listed in the sidebar and in `llms.txt`, and answered nothing.
 * Nothing outside the subtree linked to any of them.
 *
 * The index now carries what could be said accurately, and points at sales for
 * what could not. A blank page is worse than a redirect to a page that tells
 * you where to ask.
 */
function enterpriseConsolidationRedirects(): Redirect[] {
    const removed = [
        "capabilities/distributed-live-queries",
        "licensing-and-activation",
        "overview/contact-and-licensing",
        "overview/feature-table",
        "overview/what-ee-is",
        "security/fips",
        "security/trusted-execution",
        "storage/file-storage",
        "support/slas",
        "support/support-tiers",
        "upgrading-from-community",
    ];

    const out: Redirect[] = removed.map((slug) => ({
        source: `/manage/enterprise/${slug}`,
        destination: "/docs/operate/enterprise",
        statusCode: 301 as const,
    }));

    // This one had content, and the content said the real reference is in the
    // observability section, so send it there rather than to the index.
    out.push({
        source: "/manage/enterprise/security/audit-logging",
        destination: "/docs/operate/observability/audit-logging",
        statusCode: 301,
    });

    // Enterprise docs moved from being nested under organisations to top-level manage/enterprise
    out.push(
        {
            source: "/manage/organisations/enterprise",
            destination: "/docs/operate/enterprise",
            statusCode: 301,
        },
        {
            source: "/manage/organisations/enterprise/:path*",
            destination: "/docs/operate/enterprise/:path*",
            statusCode: 301,
        },
    );

    return out;
}

/**
 * Pages whose filename repeated the folder they sat in, so the URL said the
 * same word twice: `…/authentication/authentication`,
 * `…/schema-design/schema-design`, `…/agent-rules/agent-rules`.
 *
 * The first of the three was the worse case, because the page is titled "Users"
 * - the URL named neither the folder's subject nor the page's. The other two
 * became their folder's index, which drops a segment as well as the repeat.
 */
function stutteringPathRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["learn/security/authentication/authentication", "learn/security/authentication/users"],
        [
            "learn/schema-management/schema-design/schema-design",
            "learn/schema-management/schema-design",
        ],
        ["build/integrations/agent-rules/agent-rules", "integrate/integrations/agent-rules"],
    ];

    return moves.map(([from, to]) => ({
        source: `/${from}`,
        destination: `/docs/${to}`,
        statusCode: 301 as const,
    }));
}

/**
 * Two more pages folded for the same reason. `blink` became a section of the
 * demos index it sat under; `ai-agents/ai-frameworks` was a middleman that
 * listed the frameworks and then told the reader to start from the integrations
 * overview instead, so it now redirects to that overview directly.
 */
function shortPageFoldRedirects(): Redirect[] {
    return [
        {
            source: "/explore/tutorials/demos/blink",
            destination: "/learn/tutorials/demos/overview#blink-note-taking-app",
            statusCode: 301,
        },
        {
            source: "/build/ai-agents/ai-frameworks",
            destination: "/integrate/integrations/ai-frameworks/overview",
            statusCode: 301,
        },
    ];
}

/**
 * The short URLs in `short-urls.ts`. Their markdown forms, such as
 * `/docs/python.md`, need no rules of their own: the `.md` handler in
 * `src/pages/+server.ts` looks up the path without the suffix.
 */
function shortUrlRedirects(): Redirect[] {
    return shortUrls.map(([word, destination]) => ({
        source: `/${word}`,
        destination,
        statusCode: 302 as const,
    }));
}

/**
 * `integration(s)/apis` → the protocol reference.
 *
 * `/docs/integration/apis` redirected to `/docs/integrations/apis`, which the
 * `integrations → build/integrations` prefix rule then sent to
 * `/docs/build/integrations/apis` - a page that does not exist. The chain ended
 * in a 404 while looking like a working redirect (verified September 2026).
 * The API content lives in the protocol reference now, so say so. Spread before
 * `legacyPrefixRedirects("integrations", …)` so this wins.
 */
function legacyIntegrationApiRedirects(): Redirect[] {
    return ["integration", "integrations"].flatMap((prefix) => [
        {
            source: `/${prefix}/apis`,
            destination: "/docs/reference/protocols",
            statusCode: 301 as const,
        },
        {
            source: `/${prefix}/apis/:path*`,
            destination: "/docs/reference/protocols",
            statusCode: 301 as const,
        },
    ]);
}

/**
 * React Native and Expo share one guide, beside the other JavaScript framework
 * guides. These rules come before `sdkReferenceRedirects`, whose
 * `languages/javascript/frameworks` prefix would otherwise send an old Expo
 * link through a second hop.
 */
function mobileFrameworkRedirects(): Redirect[] {
    const guide = "/docs/reference/javascript/frameworks/react-native";
    return [
        "/frameworks/expo",
        "/frameworks/react-native",
        "/reference/javascript/frameworks/expo",
        "/languages/javascript/frameworks/expo",
    ]
        .map((source): Redirect => ({ source, destination: guide, statusCode: 301 }))
        .concat({
            source: "/frameworks",
            destination: "/docs/reference/javascript/frameworks",
            statusCode: 301,
        });
}

/**
 * The Actix, Axum and Rocket guides are one page, with the code for each
 * framework in tabs. Each old address goes to its framework's heading, which
 * opens that framework's tab in every tab group on the page. Listed before the
 * `languages/rust/frameworks` prefix rule, so the oldest addresses also answer
 * in one hop.
 */
function rustWebServerRedirects(): Redirect[] {
    return ["actix", "axum", "rocket"].flatMap((framework): Redirect[] =>
        ["/reference/rust/frameworks", "/languages/rust/frameworks"].map((folder) => ({
            source: `${folder}/${framework}`,
            destination: `/docs/reference/rust/frameworks/web-servers#${framework}`,
            statusCode: 301,
        })),
    );
}

/**
 * The top bars of the database docs and Agent Memory share five sections: Get
 * started, Learn, Build, Deploy and Reference.
 *
 * - Explore was folded into the others: Studio and the CLI guides joined
 *   Reference, and tutorials joined Build. The `/explore` hub goes to Build.
 * - Manage is named Deploy, in its URLs as well as its label.
 * - Agent Memory's concept pages moved into its Learn section, and its
 *   deployment pages into its Deploy section.
 *
 * Listed after every rule naming an older path, so those still answer in one hop.
 */
function sharedSectionRedirects(): Redirect[] {
    const moves: [string, string][] = [
        ["explore/studio", "reference/studio"],
        ["explore/cli", "reference/cli/guides"],
        ["explore/tutorials", "learn/tutorials"],
        ["manage", "operate"],
        // Build became Integrate. Its tutorials joined Learn and its version
        // upgrade guides joined Operate, so those come before the folder rules.
        ["build/migrating/from-old-surrealdb-versions", "operate/upgrading"],
        ["build/tutorials", "learn/tutorials"],
        ["build/ai-agents", "integrate/ai-agents"],
        ["build/embedding", "integrate/embedding"],
        ["build/integrations", "integrate/integrations"],
        ["build/migrating", "integrate/migrating"],
        ["build", "integrate"],
    ];
    const exact: [string, string][] = [["explore", "learn"]];
    return [
        ...moves.flatMap(([from, to]): Redirect[] => [
            { source: `/${from}`, destination: `/docs/${to}`, statusCode: 301 },
            { source: `/${from}/:path*`, destination: `/docs/${to}/:path*`, statusCode: 301 },
        ]),
        ...exact.map(
            ([from, to]): Redirect => ({
                source: `/${from}`,
                destination: `/docs/${to}`,
                statusCode: 301,
            }),
        ),
    ];
}

/** The tutorials that have a page at `/learn/tutorials/walkthroughs/<slug>`. */
const TUTORIAL_PAGES = [
    "auth0-integration",
    "authorizer-integration",
    "aws-cognito-integration",
    "build-a-real-time-presence-app",
    "build-an-ai-agent",
    "connect-via-ngrok",
    "define-a-schema",
    "gen-ai-chatbot",
    "github-actions",
    "how-to-build-a-knowledge-graph-for-ai",
    "http-via-postman",
    "minimal-langchain",
    "navigate-a-drone-without-gps",
    "semantic-search-in-rust",
];

/**
 * Every tutorial page lives at `/learn/tutorials/walkthroughs/<slug>`. Older
 * addresses name it in two shapes: a `tutorials` folder inside the tutorials
 * section, and the slug directly under `/tutorials`, `/explore/tutorials`,
 * `/build/tutorials` or `/learn/tutorials`. Each goes to the page in one hop,
 * so these rules come before the prefix rules that would send them to
 * `/learn/tutorials/<slug>`, where no page exists.
 */
function tutorialPathRedirects(): Redirect[] {
    const walkthroughs = "/docs/learn/tutorials/walkthroughs";
    const parents = ["tutorials", "explore/tutorials", "build/tutorials", "learn/tutorials"];
    const forms = (path: string) => [`/${path}`, `/docs/${path}`];

    return parents.flatMap((parent) => [
        ...forms(`${parent}/tutorials`).flatMap((source): Redirect[] => [
            { source, destination: `${walkthroughs}/overview`, statusCode: 301 },
            { source: `${source}/:path*`, destination: `${walkthroughs}/:path*`, statusCode: 301 },
        ]),
        ...TUTORIAL_PAGES.flatMap((page) =>
            forms(`${parent}/${page}`).map(
                (source): Redirect => ({
                    source,
                    destination: `${walkthroughs}/${page}`,
                    statusCode: 301,
                }),
            ),
        ),
    ]);
}

/**
 * The migrating section has one overview page, and the two sources that once
 * had pages of their own are its sections. Their old addresses go to those
 * sections in one hop, under the current and the former `build` prefix. Only
 * these exact addresses move: the pages under them keep their paths.
 */
function migratingOverviewRedirects(): Redirect[] {
    const hub = "/docs/integrate/migrating";
    const moves: [string, string][] = [
        ["from-other-databases/overview", "from-other-databases"],
        ["from-other-databases", "from-other-databases"],
        ["from-files-and-streams", "from-files-and-streams"],
    ];

    return ["integrate/migrating", "build/migrating"].flatMap((parent) =>
        moves.flatMap(([page, section]) =>
            [`/${parent}/${page}`, `/docs/${parent}/${page}`].map(
                (source): Redirect => ({
                    source,
                    destination: `${hub}#${section}`,
                    statusCode: 301,
                }),
            ),
        ),
    );
}

/**
 * The upgrade guides open on `/operate/upgrading`, which is the page that was
 * called `overview`. Its former address, and the same address under the old
 * `build/migrating/from-old-surrealdb-versions` folder, goes there in one hop.
 * Listed before the folder rule that would send the second one to
 * `/operate/upgrading/overview`.
 */
function upgradingLandingRedirects(): Redirect[] {
    return ["operate/upgrading", "build/migrating/from-old-surrealdb-versions"].flatMap((parent) =>
        [`/${parent}/overview`, `/docs/${parent}/overview`].map(
            (source): Redirect => ({
                source,
                destination: "/docs/operate/upgrading",
                statusCode: 301,
            }),
        ),
    );
}

/**
 * The protocol and API reference is at `/reference/protocols`. Its former
 * `/reference/rest-api` address, and every page under it, goes there in one hop.
 */
function protocolsRedirects(): Redirect[] {
    return ["/reference/rest-api", "/docs/reference/rest-api"].flatMap((source): Redirect[] => [
        { source, destination: "/docs/reference/protocols", statusCode: 301 },
        {
            source: `${source}/:path*`,
            destination: "/docs/reference/protocols/:path*",
            statusCode: 301,
        },
    ]);
}

/**
 * Each language's embedding guide is in its SDK reference. The pages that once
 * sat under `embedding/by-language` go there in one hop, under the current and
 * the former `build` prefix, and the folder goes to the embedding overview.
 */
function embeddingLanguageRedirects(): Redirect[] {
    const guides: [string, string][] = [
        ["dotnet", "/docs/reference/dotnet/embedding"],
        ["golang", "/docs/reference/golang/embedding"],
        ["javascript", "/docs/reference/javascript/concepts/embedded-engines"],
        ["python", "/docs/reference/python/concepts/embedded-databases"],
        ["rust", "/docs/reference/rust/embedding"],
    ];

    return ["integrate", "build"].flatMap((section) => {
        const folder = `${section}/embedding/by-language`;
        const forms = (path: string) => [`/${path}`, `/docs/${path}`];

        return [
            ...forms(folder).map(
                (source): Redirect => ({
                    source,
                    destination: "/docs/integrate/embedding",
                    statusCode: 301,
                }),
            ),
            ...guides.flatMap(([language, destination]) =>
                forms(`${folder}/${language}`).map(
                    (source): Redirect => ({ source, destination, statusCode: 301 }),
                ),
            ),
        ];
    });
}

const baseRedirects: Redirect[] = [
    ...authDiscoveryRedirects(),
    ...overviewConsolidationRedirects(),
    ...legacyPrefixRedirects("surrealql", "reference/query-language"),
    // `surrealist/*` cannot map path-for-path: the tree it points at was
    // consolidated to three pages. The two survivors are named, and the rest go
    // to the section, same as the `explore/surrealist` rules further down.
    {
        source: "/surrealist/advanced-topics/search-and-shortcuts",
        destination: "/reference/studio/search-and-shortcuts",
        statusCode: 301,
    },
    {
        source: "/surrealist/advanced-topics/surrealql-editors",
        destination: "/reference/studio/surrealql-editors",
        statusCode: 301,
    },
    { source: "/surrealist", destination: "/reference/studio", statusCode: 301 },
    { source: "/surrealist/:path*", destination: "/reference/studio", statusCode: 301 },
    // SurrealDB 4.0 removed SurrealML, so its pages and the older `/surrealml`
    // URLs go to the upgrade guide's section on what the removal takes away.
    ...["/surrealml", "/surrealml/:path*", "/explore/ml-models", "/explore/ml-models/:path*"].map(
        (source): Redirect => ({
            source,
            destination: "/docs/operate/upgrading/3x-to-4x#surrealml-is-removed",
            statusCode: 301,
        }),
    ),
    ...mobileFrameworkRedirects(),
    ...rustWebServerRedirects(),
    ...legacyIntegrationSdkRedirects(),
    ...legacyIntegrationApiRedirects(),
    ...legacyPrefixRedirects("integrations", "integrate/integrations"),
    ...protocolsRedirects(),
    ...tutorialPathRedirects(),
    ...migratingOverviewRedirects(),
    ...embeddingLanguageRedirects(),
    ...legacyPrefixRedirects("tutorials", "learn/tutorials"),
    ...sdkRedirects(),
    ...legacyMigratingRedirects(),
    ...legacySurrealdbTreeRedirects(),
    ...deploymentObservabilityToManageRedirects(),
    ...runningFromSelfHostedRedirects(),
    ...databaseFunctionsOverviewRedirects(),
    ...surrealCliRedirects(),
    ...extensionRedirects(),
    ...phpVersionedRedirects(),
    ...dotnetReferenceRedirects(),
    ...sdkConceptRedirects(),
    ...sdkReferenceRedirects(),
    ...sdkGettingStartedRedirects(),
    ...aiAgentsRedirects(),
    ...cloudAndDeploymentRedirects(),
    ...librariesRedirects(),
    ...agentMemoryRedirects(),
    // `meta::tb()` and `meta::id()` were renamed to `record::` in 2.x. Both old
    // names still work, so the note on the record page says so rather than the
    // reference page staying behind to document a discouraged spelling.
    {
        source: "/reference/query-language/functions/database-functions/meta",
        destination: "/docs/reference/query-language/functions/database-functions/record",
        statusCode: 301,
    },
    // `DEFINE SCOPE` and `DEFINE TOKEN` were replaced in 2.0 and removed in 3.0.
    // Each redirects to the statement that replaced it, whose page says so.
    {
        source: "/reference/query-language/statements/define/scope",
        destination: "/docs/reference/query-language/statements/define/access/record",
        statusCode: 301,
    },
    {
        source: "/reference/query-language/statements/define/token",
        destination: "/docs/reference/query-language/statements/define/access/jwt",
        statusCode: 301,
    },
    // `surreal format` was removed from the CLI shortly after it shipped. The
    // parser holds no comment nodes, so the command could only re-emit each
    // statement from its syntax tree, and with `--write` that silently changed
    // what a script meant. `surqlfmt` is the formatter that remains.
    {
        source: "/reference/cli/surrealdb-cli/commands/format",
        destination: "/docs/reference/cli/formatter/overview",
        statusCode: 301,
    },
    // "Types after 3.0" split into a concepts page and an attribute reference.
    // The old slug dropped the dot in the filename, so it was served at
    // `rust-after-30`.
    {
        source: "/reference/rust/concepts/rust-after-30",
        destination: "/docs/reference/rust/concepts/working-with-types",
        statusCode: 301,
    },
    // Surrealist → SurrealDB Studio path rename
    {
        source: "/docs/explore/surrealist",
        destination: "/docs/reference/studio",
        statusCode: 301,
    },
    // The Surrealist tree was consolidated into a three-page Studio section, so
    // only these two pages have a counterpart to point at - both promoted out of
    // `advanced-topics/`. They are listed before the wildcard below, which would
    // otherwise swallow them.
    {
        source: "/docs/explore/surrealist/advanced-topics/search-and-shortcuts",
        destination: "/docs/reference/studio/search-and-shortcuts",
        statusCode: 301,
    },
    {
        source: "/docs/explore/surrealist/advanced-topics/surrealql-editors",
        destination: "/docs/reference/studio/surrealql-editors",
        statusCode: 301,
    },
    // Everything else under `surrealist/` was removed rather than moved, so it
    // goes to the section that absorbed it. Mapping the path through instead
    // would name a page that does not exist, which is now a 404 rather than a
    // quiet walk back up the tree.
    {
        source: "/docs/explore/surrealist/:path*",
        destination: "/docs/reference/studio",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist",
        destination: "/reference/studio",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist/advanced-topics/search-and-shortcuts",
        destination: "/reference/studio/search-and-shortcuts",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist/advanced-topics/surrealql-editors",
        destination: "/reference/studio/surrealql-editors",
        statusCode: 301,
    },
    {
        source: "/explore/surrealist/:path*",
        destination: "/reference/studio",
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
    ...enterpriseConsolidationRedirects(),
    ...stutteringPathRedirects(),
    ...shortPageFoldRedirects(),
    ...upgradingLandingRedirects(),
    ...sharedSectionRedirects(),
    // Last, so that every rule naming a real former path is tried first. A short
    // URL is a guess at a word, and a guess should only be answered once nothing
    // better matches.
    ...shortUrlRedirects(),
];

export const docsRedirects: Redirect[] = withMarkdownTwins(baseRedirects.map(withDocsDestination));

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

        // The markdown twins `withMarkdownTwins` adds. Matched explicitly
        // rather than by parsing the regex, mirroring what path-to-regexp
        // compiles this shape to: a path under the base that ends in `.md`.
        if (source.endsWith(MD_WILDCARD)) {
            const base = source.slice(0, -MD_WILDCARD.length);

            if (normalized.startsWith(`${base}/`) && normalized.endsWith(".md")) {
                return { destination, statusCode };
            }

            continue;
        }

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
