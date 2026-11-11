/**
 * Short URLs: `/docs/<word>` for the words a reader or an agent guesses, such as
 * `/docs/python`, `/docs/select` or `/docs/define-table`.
 *
 * Each one answers with a 302, because it names the current best page for the
 * word rather than a page that moved, so the target can change when the docs are
 * reorganised and the short URL keeps working. `redirects.ts` turns this list into
 * rules placed after every other redirect, so a path some page used to live at
 * always wins over a guess.
 *
 * `bun run check:links` checks the list: every target has to be a page, no short
 * URL may hide a page or be hidden by an earlier redirect, a word may appear only
 * once, and every page in the folders under `SHORT_URL_FOLDERS` needs a short URL,
 * so a new statement or function family is reported until it has one.
 */

export type ShortUrl = [word: string, destination: string];

const QL = "/docs/reference/query-language";
const STATEMENTS = `${QL}/statements`;
const CLAUSES = `${QL}/clauses`;
const FUNCTIONS = `${QL}/functions/database-functions`;
const DATA_TYPES = `${QL}/language-primitives/data-types`;
const CLI_COMMANDS = "/docs/reference/cli/db/commands";

/** Pages a reference folder holds, one short URL each, named by `word`. */
function family(folder: string, pages: string[], word = (page: string) => page): ShortUrl[] {
    return pages.map((page) => [word(page), `${folder}/${page}`]);
}

/** Words chosen by hand: entry points, SDKs, features and operations. */
const curated: ShortUrl[] = [
    // Getting started
    ["quickstart", "/docs"],
    ["quick-start", "/docs"],
    ["getting-started", "/docs"],
    ["get-started", "/docs"],
    ["intro", "/docs/what-is-surrealdb"],
    ["introduction", "/docs/what-is-surrealdb"],
    ["install", "/docs/running/installation"],
    ["installation", "/docs/running/installation"],
    ["docker", "/docs/running/docker"],
    ["sandbox", "/docs/running/sandbox"],
    ["studio", "/docs/explore/studio"],
    ["mcp", "/docs/build/ai-agents/mcp"],

    // SDKs. Each goes to the SDK's own section, which links to its quickstart.
    ["sdk", "/docs/languages"],
    ["sdks", "/docs/languages"],
    ["clients", "/docs/languages"],
    ["javascript", "/docs/reference/javascript"],
    ["js", "/docs/reference/javascript"],
    ["typescript", "/docs/reference/javascript"],
    ["ts", "/docs/reference/javascript"],
    ["python", "/docs/reference/python"],
    ["rust", "/docs/reference/rust"],
    ["go", "/docs/reference/golang"],
    ["golang", "/docs/reference/golang"],
    ["java", "/docs/reference/java"],
    ["dotnet", "/docs/reference/dotnet"],
    ["csharp", "/docs/reference/dotnet"],
    ["php", "/docs/reference/php"],
    ["swift", "/docs/reference/swift"],
    ["kotlin", "/docs/reference/kotlin"],
    ["mojo", "/docs/reference/mojo"],

    // Query language and protocols
    ["query", QL],
    ["queries", QL],
    // The statements folder has no page of its own, so a link to it lands on
    // whichever child sorts first. The SurrealQL index lists them all.
    ["statements", QL],
    ["functions", FUNCTIONS],
    ["types", DATA_TYPES],
    ["data-types", DATA_TYPES],
    ["operators", `${QL}/language-primitives/operators`],
    ["idioms", `${QL}/language-primitives/idioms`],
    ["parameters", `${QL}/language-primitives/parameters`],
    ["casting", `${QL}/language-primitives/casting`],
    ["api", "/docs/reference/rest-api"],
    ["apis", "/docs/reference/rest-api"],
    ["rest", "/docs/reference/rest-api"],
    ["http", "/docs/reference/rest-api/http-protocol"],
    ["rpc", "/docs/reference/rest-api/rpc-protocol"],
    ["graphql", "/docs/learn/querying/graphql/overview"],

    // Data models and features
    ["graph", "/docs/learn/data-models/graph/overview"],
    ["document", "/docs/learn/data-models/document/overview"],
    ["vector-search", "/docs/learn/data-models/vector-search/overview"],
    ["vectors", "/docs/learn/data-models/vector-search/overview"],
    ["full-text-search", "/docs/learn/data-models/full-text-search/overview"],
    ["fts", "/docs/learn/data-models/full-text-search/overview"],
    ["time-series", "/docs/learn/data-models/time-series/overview"],
    ["geospatial", "/docs/learn/data-models/geospatial/overview"],
    ["rag", "/docs/learn/data-models/vector-search/rag-architecture-patterns"],
    ["hybrid-search", "/docs/learn/data-models/vector-search/hybrid-search"],
    ["live-queries", "/docs/learn/querying/real-time/live-queries"],
    ["changefeeds", "/docs/learn/querying/real-time/changefeeds"],
    ["transactions", "/docs/learn/querying/concepts-and-guides/transactions"],
    ["schema", "/docs/learn/schema-management"],
    ["extensions", "/docs/learn/extensions"],

    // Security
    ["security", "/docs/learn/security"],
    ["auth", "/docs/learn/security/authentication/overview"],
    ["authentication", "/docs/learn/security/authentication/overview"],
    ["permissions", "/docs/learn/security/authorization/permissions-and-row-level-security"],
    ["capabilities", "/docs/learn/security/authorization/capabilities"],
    ["jwt", "/docs/learn/security/authorization/tokens-and-jwts"],
    ["tokens", "/docs/learn/security/authorization/tokens-and-jwts"],

    // Deploying and operating
    ["cloud", "/docs/manage/instances"],
    ["kubernetes", "/docs/manage/self-hosted/kubernetes"],
    ["k8s", "/docs/manage/self-hosted/kubernetes"],
    ["backups", "/docs/manage/self-hosted/backups-and-recovery"],
    // The guide for the latest major version. Repoint it at each major release.
    ["upgrade", "/docs/build/migrating/from-old-surrealdb-versions/3x-to-4x"],
    ["migrate", "/docs/build/migrating/from-other-databases/overview"],
    ["postgres", "/docs/build/migrating/from-other-databases/from-postgresql"],
    ["postgresql", "/docs/build/migrating/from-other-databases/from-postgresql"],
    ["mongodb", "/docs/build/migrating/from-other-databases/from-mongodb"],
    ["neo4j", "/docs/build/migrating/from-other-databases/from-neo4j"],
    ["mysql", "/docs/build/migrating/from-other-databases/from-mysql"],
    ["environment-variables", "/docs/reference/cli/db/environment-variables"],
    ["env", "/docs/reference/cli/db/environment-variables"],
    ["observability", "/docs/manage/observability"],
    ["metrics", "/docs/manage/observability/metrics"],
    ["enterprise", "/docs/manage/enterprise"],
    ["sso", "/docs/manage/enterprise/single-sign-on"],
];

/**
 * The reference, by name. A word appears once, so where two pages share a name
 * one keeps the bare word and the other is reached by its qualified form:
 *
 * - `explain` is the statement, and `explain-clause` the clause.
 * - `start` is `surreal start`, and `start-clause` the clause.
 * - `sleep` is the statement, and `sleep-functions` the functions.
 * - `bytes` is the data type, and `bytes-functions` the functions.
 * - `upgrade` and `mcp` are chosen by hand above, and the commands are
 *   `surreal-upgrade` and `surreal-mcp`.
 *
 * Function families are singular (`string`) and data types plural (`strings`),
 * as the pages are named.
 */
const statements = [
    "access",
    "begin",
    "break",
    "cancel",
    "commit",
    "continue",
    "create",
    "delete",
    "explain",
    "for",
    "if-else",
    "info",
    "insert",
    "kill",
    "let",
    "live-select",
    "rebuild",
    "relate",
    "remove",
    "return",
    "select",
    "show",
    "sleep",
    "throw",
    "update",
    "upsert",
    "use",
];

const defineAndAlter = [
    "access",
    "analyzer",
    "api",
    "bucket",
    "config",
    "database",
    "event",
    "field",
    "function",
    "indexes",
    "namespace",
    "param",
    "sequence",
    "table",
    "type",
    "user",
];

const clauses = [
    "explain",
    "fetch",
    "from",
    "group",
    "limit",
    "omit",
    "order",
    "split",
    "start",
    "where",
    "with",
];

const commands = [
    "export",
    "fix",
    "help",
    "import",
    "isready",
    "mcp",
    "ml",
    "sql",
    "start",
    "upgrade",
    "validate",
    "version",
];

const functionFamilies = [
    "api",
    "array",
    "bytes",
    "count",
    "crypto",
    "duration",
    "encoding",
    "enum",
    "eval",
    "file",
    "geo",
    "http",
    "interval",
    "math",
    "not",
    "object",
    "parse",
    "rand",
    "record",
    "search",
    "sequence",
    "session",
    "set",
    "sleep",
    "string",
    "time",
    "type",
    "value",
    "vector",
];

const dataTypes = [
    "arrays",
    "booleans",
    "bytes",
    "closures",
    "dates-and-times",
    "datetimes",
    "durations",
    "files",
    "futures",
    "geometries",
    "literals",
    "named-types",
    "none-and-null",
    "numbers",
    "objects",
    "ranges",
    "record-ids",
    "regex",
    "sets",
    "strings",
    "uuids",
    "values",
];

/** Taken by a word above, so the family keeps only its qualified form. */
const TAKEN_CLAUSES = new Set(["explain", "start"]);
const TAKEN_FUNCTIONS = new Set(["api", "http", "bytes", "sleep", "search", "not"]);
const BARE_COMMANDS = new Set(["start", "sql", "import", "export", "validate", "isready"]);

const reference: ShortUrl[] = [
    ...family(STATEMENTS, statements),
    ["live", `${STATEMENTS}/live-select`],
    ["if", `${STATEMENTS}/if-else`],

    ...family(`${STATEMENTS}/define`, [...defineAndAlter, "extension"], (page) =>
        page === "indexes" ? "define-index" : `define-${page}`,
    ),
    // The 1.x statements, removed in 3.0, answer with the statements that replaced them.
    ["define-scope", `${STATEMENTS}/define/access/record`],
    ["define-token", `${STATEMENTS}/define/access/jwt`],
    ...family(`${STATEMENTS}/alter`, [...defineAndAlter, "system"], (page) =>
        page === "indexes" ? "alter-index" : `alter-${page}`,
    ),

    ...family(
        CLAUSES,
        clauses.filter((clause) => !TAKEN_CLAUSES.has(clause)),
    ),
    ...family(CLAUSES, clauses, (clause) => `${clause}-clause`),
    ["group-by", `${CLAUSES}/group`],
    ["order-by", `${CLAUSES}/order`],

    ...family(
        CLI_COMMANDS,
        commands.filter((command) => BARE_COMMANDS.has(command)),
    ),
    ...family(CLI_COMMANDS, commands, (command) => `surreal-${command}`),

    ...family(
        FUNCTIONS,
        functionFamilies.filter((name) => !TAKEN_FUNCTIONS.has(name)),
    ),
    ...family(FUNCTIONS, functionFamilies, (name) => `${name}-functions`),

    ...family(DATA_TYPES, dataTypes),
];

export const shortUrls: ShortUrl[] = [...curated, ...reference];

/** Folders in which every page needs a short URL; see the comment at the top. */
export const SHORT_URL_FOLDERS = [
    STATEMENTS,
    `${STATEMENTS}/define`,
    `${STATEMENTS}/alter`,
    CLAUSES,
    CLI_COMMANDS,
    FUNCTIONS,
    DATA_TYPES,
];
