// Route table: which content collection serves which URL prefix.
//
// Kept in its own module (no imports) so build-time tooling can read it
// without pulling in the runtime content-collection API or the markdown
// renderer. The search index generator (plugins/vite-search-index.ts)
// depends on it, which is why it must stay dependency-free.

/**
 * Maps a URL prefix to the content collection that serves it.
 *
 * This mirrors the collection bindings declared in `src/pages/**\/+data.ts`
 * (the second argument to `resolveDataFromCollection`, and the optional third
 * `urlPrefix` argument where it differs from the collection id). Keep this list
 * in sync when page groups are added, removed, or re-pointed.
 *
 * Ordered most-specific prefix first so that lookups match the narrowest route.
 * The empty-prefix `index` entry is the root catch-all and must remain last.
 */
export const COLLECTION_ROUTES: { prefix: string; id: string }[] = [
    { prefix: "build/ai-agents", id: "build/ai-agents" },
    { prefix: "build/deployment", id: "build/deployment" },
    { prefix: "build/embedding", id: "build/embedding" },
    { prefix: "build/integrations", id: "build/integrations" },
    { prefix: "build/migrating", id: "build/migrating" },
    { prefix: "explore/ml-models", id: "explore/ml-models" },
    { prefix: "explore/surrealist", id: "explore/surrealist" },
    { prefix: "explore/tutorials", id: "explore/tutorials" },
    { prefix: "learn/data-models", id: "learn/data-models" },
    { prefix: "learn/extensions", id: "learn/extensions" },
    { prefix: "learn/querying", id: "learn/querying" },
    { prefix: "learn/schema-management", id: "learn/schema-management" },
    { prefix: "learn/security", id: "learn/security" },
    { prefix: "manage/cloud", id: "manage/cloud" },
    { prefix: "manage/enterprise", id: "manage/enterprise" },
    { prefix: "manage/observability", id: "manage/observability" },
    { prefix: "manage/schema-migration", id: "manage/schema-migration" },
    { prefix: "manage/self-hosted", id: "manage/self-hosted" },
    { prefix: "reference/cli", id: "reference/cli" },
    { prefix: "reference/dotnet", id: "reference/dotnet" },
    { prefix: "reference/golang", id: "reference/golang" },
    { prefix: "reference/java", id: "reference/java" },
    { prefix: "reference/javascript", id: "reference/javascript" },
    { prefix: "reference/kotlin", id: "reference/kotlin" },
    { prefix: "reference/mojo", id: "reference/mojo" },
    { prefix: "reference/php", id: "reference/php" },
    { prefix: "reference/python", id: "reference/python" },
    { prefix: "reference/query-language", id: "reference/query-language" },
    { prefix: "reference/rest-api", id: "reference/rest-api" },
    { prefix: "reference/rust", id: "reference/rust" },
    { prefix: "reference/swift", id: "reference/swift" },
    { prefix: "spectron/agent-memory", id: "spectron/agent-memory" },
    { prefix: "spectron/cookbooks", id: "spectron/cookbooks" },
    { prefix: "spectron/integrations", id: "spectron/integrations" },
    { prefix: "spectron/reference", id: "spectron/reference" },
    { prefix: "spectron/self-hosting", id: "spectron/self-hosting" },
    { prefix: "spectron", id: "spectron/index" },
    { prefix: "", id: "index" },
];
