/**
 * The features that `check:features` reports on. A feature is everything a
 * reader can meet under one name: its commands and flags, its settings, its
 * HTTP routes and RPC methods, its functions, and the statements and terms
 * that the inventories do not hold.
 *
 * Scope: the community edition on a single node, from 3.0. What is not tracked
 * is listed in `OUT_OF_SCOPE` with its reason: distributed storage (TiKV and
 * FoundationDB) and SurrealML, which 4.0 removed. Anything that only Enterprise
 * has will be listed there too, until it has a place of its own.
 *
 * Each field is a rule over one inventory in `src/data` and
 * `public/cli-history/data.json`. A rule that matches nothing in a release
 * means that the feature has no such part there, which is how a feature that
 * ended shows up. A part can belong to several features, as a capability flag
 * belongs to `capabilities` and to the command that takes it.
 *
 * Keeping it up to date
 *
 * The inventories are regenerated after each release (`generate:cli-history`,
 * `generate:function-history`, `generate:surface-history`). `check-features.ts`
 * adds one feature for each command and one for each function namespace, so a
 * new command or function is covered with no change here. It then fails on any
 * setting, route or RPC method that no feature claims and `OUT_OF_SCOPE` does
 * not list. That failure is the prompt to edit this file:
 *
 * - A new setting usually matches a rule already, by its name. If it does not,
 *   widen the rule of the feature it belongs to, or add a feature.
 * - A new capability of the database, such as a protocol, a statement family
 *   or a storage engine, is a new feature, with its flags, settings, routes
 *   and functions as rules. Add `terms` for what the inventories cannot see,
 *   which is every statement and every word of SurrealQL syntax.
 * - A feature that is removed stays here, so that the pages that still mention
 *   it are checked for saying that it is gone.
 */
export interface Feature {
    name: string;
    /** A command, flag or argument: matched against the item's full text, such as `surreal ml export --name`. */
    cli?: RegExp;
    /** A `SURREAL_` setting: matched against its name. */
    settings?: RegExp;
    /** A route, as `METHOD /path`. */
    routes?: RegExp;
    /** An RPC method name. */
    rpc?: RegExp;
    /** A built-in function path. */
    functions?: RegExp;
    /** Terms a page must mention, such as a statement, that no inventory holds. */
    terms?: string[];
}

export const FEATURES: Feature[] = [
    // ---- Language and data
    {
        name: "queries",
        rpc: /^(query|query_stream|query_cancel|run)$/,
        routes: /^\S+ \/(sql|rpc)$/,
        settings:
            /QUERY_(TIMEOUT|MEMORY)|MAX_(QUERY|COMPUTATION|EXPRESSION|ORDER|OBJECT|CONCURRENT)|STATEMENT_CACHE|NET_MAX|SLOW_QUERY|EXTERNAL_SORTING|REGEX_|STRING_SIMILARITY|IDIOM_RECURSION|RAND_SEED/,
        terms: ["SELECT", "EXPLAIN"],
    },
    {
        name: "records",
        rpc: /^(select|insert|create|upsert|update|merge|patch|delete|relate|insert_relation)$/,
        routes: /^\S+ \/key\//,
        settings: /COUNT_BATCH|SCAN_BATCH|TABLE_DOC|NORMAL_FETCH|SPECIALISED_BODY/,
    },
    {
        name: "transactions",
        rpc: /^(begin|commit|cancel)$/,
        settings: /TRANSACTION|MAX_TRANSACTIONS|HOLD_CREATES|DURABLE_SESSION/,
        terms: ["BEGIN", "COMMIT"],
    },
    {
        name: "live-queries",
        rpc: /^(live|kill)$/,
        settings: /LIVE_QUERY|ASYNC_EVENT|CHANGEFEED/,
        terms: ["LIVE SELECT", "KILL"],
    },
    {
        name: "sessions",
        rpc: /^(use|set|let|unset|info|attach|detach|sessions|reset|version|ping)$/,
        settings: /DURABLE_SESSION/,
    },
    {
        name: "indexes-and-search",
        settings:
            /KNN_|HNSW_|DISKANN_|INDEX_(BUILD|COMPACTION)|INDEXING_BATCH|FTS_|FULLTEXT_|BITMAP_|TOPK|SEGMENT_|FAN_OUT/,
        terms: ["DEFINE INDEX", "HNSW", "SEARCH ANALYZER"],
    },
    {
        name: "query-engine",
        settings:
            /MORSEL_|GRAPH_|VM_|STREAM_STAGE|SPILL_|OPERATOR_BUFFER|PLANNER_STRATEGY|COMPILE|TRACE_COMPILES|MEMORY_(LIMIT|RESERVE|THRESHOLD|WAIT)|COMPILED_UNIT|READ_SNAPSHOT|PROCESS_METRICS/,
    },
    {
        name: "scripting",
        settings: /SCRIPTING/,
        terms: ["function()"],
    },
    {
        name: "extensions",
        cli: /^surreal (module|mod|ext|extension)\b/,
        settings: /SURREALISM/,
        terms: ["DEFINE MODULE", "surrealism"],
    },
    // ---- Access and security
    {
        name: "authentication",
        rpc: /^(signup|signin|authenticate|refresh|invalidate|revoke)$/,
        routes: /^\S+ \/(signin|signup|signout|refresh)/,
        settings:
            /AUTH|JWKS|COOKIE|(^|_)(USER|PASS|TOKEN|UNAUTHENTICATED|NO_IDENTIFICATION|CLIENT_IP|INSECURE_FORWARD)(_|$)|SURREALDB_USER/,
        terms: ["DEFINE ACCESS", "DEFINE USER"],
    },
    {
        name: "capabilities",
        cli: /--(allow|deny)-|--no-defaults/,
        settings: /CAPS_|NO_DEFAULTS|FILE_ALLOWLIST|ALLOW_ORIGIN/,
        routes: /^\S+ \/credentials$/,
    },
    {
        name: "tls",
        settings: /(^|_)WEB_(CRT|KEY)|^SURREAL_(KEY|CERT)/,
    },
    // ---- Data in and out
    {
        name: "export",
        cli: /^surreal (export|backup)\b/,
        routes: /^\S+ \/export$/,
        settings: /EXPORT_BATCH/,
        terms: ["EXPORT"],
    },
    {
        name: "import",
        cli: /^surreal import\b/,
        routes: /^\S+ \/import$/,
        settings: /IMPORT_FILE|MAX_BATCH/,
    },
    { name: "sync", routes: /^\S+ \/sync$/ },
    { name: "migrate", routes: /^\S+ \/migrate$/, cli: /^surreal (fix|v2)\b/ },
    { name: "kvexport", routes: /^\S+ \/kvexport$/, settings: /KVEXPORT/ },
    {
        name: "buckets",
        routes: /^\S+ \/bucket\//,
        settings: /BUCKET|OBJECT_STORE/,
        functions: /^file::/,
        terms: ["DEFINE BUCKET"],
    },
    {
        name: "api",
        routes: /^\S+ \/api\//,
        functions: /^api::/,
        terms: ["DEFINE API"],
    },
    // ---- Protocols and servers
    {
        name: "http-server",
        routes: /^\S+ \/(status|health|ready|version|metrics)?$/,
        settings:
            /(^|_)HTTP_|MAX_HTTP|USER_AGENT|PUBLIC_ORIGIN|(^|_)BIND$|^SURREAL_PATH$|NO_BANNER|HIDE_WELCOME|ONLINE_VERSION|ACCESSIBLE_OUTPUT/,
    },
    {
        name: "websocket",
        settings: /WEBSOCKET|MAX_TRANSACTIONS|NOTIFICATION/,
    },
    {
        name: "grpc",
        routes: /^\S+ \/surrealdb\.protocol/,
        settings: /GRPC/,
    },
    {
        name: "graphql",
        settings: /GQL|GRAPHQL/,
        routes: /^\S+ \/(graphql|gql)\b/,
        rpc: /^(gql|graphql)$/,
    },
    {
        name: "postgres-and-mysql",
        rpc: /^(pgsql|mysql)$/,
        settings: /POSTGRES|MYSQL/,
    },
    {
        name: "mcp",
        cli: /^surreal mcp\b/,
        settings: /(^|_)MCP(_|$)/,
        routes: /^\S+ \/mcp\b/,
    },
    // ---- Running a server
    {
        name: "storage",
        settings:
            /ROCKSDB|SURREALKV|DATASTORE|KVS_THREADPOOL|SYNC_DATA|CACHE_STORE|TRANSACTION_CACHE|GENERATION_ALLOCATION|RECLAIM_|TEMPORARY_DIRECTORY|SURREAL_(STRICT)$/,
        terms: ["rocksdb", "surrealkv"],
    },
    {
        name: "clustering",
        settings: /NODE_MEMBERSHIP|READINESS|STARTUP_OPERATION/,
    },
    {
        name: "runtime",
        settings:
            /RUNTIME_|TOKIO|KVS_THREADPOOL|FEATURE_LEVEL|EXPERIMENTAL|BUILD_|INVOKED_AS|NAMESPACE|DATABASE|^SURREAL_(NAME|VERSION)$/,
    },
    {
        name: "logging-and-telemetry",
        settings: /(^|_)LOG(_|$)|TELEMETRY|METRICS|OTEL|SLOW_QUERY|TOKIO_CONSOLE/,
        terms: ["opentelemetry"],
    },
    // ---- The surreal command
    {
        name: "launcher",
        cli: /^surreal (upgrade|version|is-ready|validate|format)\b/,
        terms: ["surreal install", "surreal upgrade", "surreal use"],
    },
];

/**
 * Parts that are deliberately not covered, each with the reason. A part listed
 * here is not reported as unclaimed, and it is not checked against the docs.
 */
export const OUT_OF_SCOPE: (Omit<Feature, "name" | "terms"> & { why: string })[] = [
    {
        why: "TiKV is distributed storage, which is outside a single node",
        settings: /TIKV|KVS_(CA|CRT|KEY)/,
    },
    {
        why: "FoundationDB is distributed storage, which is outside a single node",
        settings: /FOUNDATIONDB/,
    },
    {
        why: "SurrealML was removed in 4.0 and is not tracked",
        cli: /^surreal ml\b/,
        settings: /(^|_)ML(_|$)/,
        routes: /^\S+ \/ml\//,
        functions: /^ml::/,
    },
];
