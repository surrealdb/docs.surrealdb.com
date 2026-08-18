import { getCollectionEntry } from "vike-content-collection";
import type { SdkVersionMap } from "~/lib/versions";
import { stripLanguageTestComments, stripLeadingH1 } from "./markdown";
import { flattenMdxComponents } from "./mdx-to-markdown";

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
    { prefix: "build/embedding", id: "build/embedding" },
    { prefix: "build/integrations", id: "build/integrations" },
    { prefix: "build/migrating", id: "build/migrating" },
    { prefix: "explore/ml-models", id: "explore/ml-models" },
    { prefix: "explore/studio", id: "explore/studio" },
    { prefix: "explore/tutorials", id: "explore/tutorials" },
    { prefix: "learn/data-models", id: "learn/data-models" },
    { prefix: "learn/extensions", id: "learn/extensions" },
    { prefix: "learn/querying", id: "learn/querying" },
    { prefix: "learn/schema-management", id: "learn/schema-management" },
    { prefix: "learn/security", id: "learn/security" },
    { prefix: "manage/enterprise", id: "manage/enterprise" },
    { prefix: "manage/instances", id: "manage/instances" },
    { prefix: "manage/observability", id: "manage/observability" },
    { prefix: "manage/organisations", id: "manage/organisations" },
    { prefix: "manage/schema-migration", id: "manage/schema-migration" },
    { prefix: "manage/self-hosted", id: "manage/self-hosted" },
    { prefix: "manage/surrealctl", id: "manage/surrealctl" },
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
    { prefix: "spectron", id: "spectron/index" },
    { prefix: "", id: "index" },
];

type CollectionEntry = NonNullable<ReturnType<typeof getCollectionEntry>>;

/**
 * Resolve a URL pathname to its content collection entry, using the same
 * prefix-to-collection mapping the page routes use.
 *
 * @param pathname - Docs pathname without the `/docs` base (leading/trailing
 *   slashes are tolerated), e.g. `reference/query-language/statements/select`.
 * @returns The matching entry, or `undefined` if none resolves.
 */
export function resolveCollectionEntry(pathname: string): CollectionEntry | undefined {
    const path = pathname.replace(/^\/+/, "").replace(/\/+$/, "");

    for (const { prefix, id } of COLLECTION_ROUTES) {
        if (prefix !== "" && path !== prefix && !path.startsWith(`${prefix}/`)) {
            continue;
        }

        const slug = path.slice(prefix.length).replace(/^\/+/, "");
        const entry = getCollectionEntry(id, slug);

        if (entry) {
            return entry;
        }
    }

    return undefined;
}

/**
 * Append a `.md` suffix to internal `/docs/...` links so an agent following
 * links from a raw markdown page stays in markdown mode. Handles both markdown
 * links (`](/docs/…)`) and JSX/HTML `href` attributes, preserving any trailing
 * `#anchor` or `?query`, and leaving root (`/docs`), directory (`/docs/…/`) and
 * already-suffixed links untouched.
 */
export function suffixDocsLinks(markdown: string): string {
    const appendMd = (path: string) =>
        path.endsWith(".md") || path.endsWith("/") ? path : `${path}.md`;

    return markdown
        .replace(/(\]\()(\/docs\/[^)\s#?]+)/g, (_match, open, path) => `${open}${appendMd(path)}`)
        .replace(
            /(href=["'])(\/docs\/[^"'#?]+)/g,
            (_match, open, path) => `${open}${appendMd(path)}`,
        );
}

/**
 * Build the raw markdown document served for a page's `.md` URL.
 *
 * Prepends the frontmatter title as a top-level heading and the description
 * beneath it, followed by the page body (with its own leading H1 removed to
 * avoid a duplicate heading). MDX components are flattened to plain markdown,
 * and internal docs links are rewritten to `.md` so link-following stays in
 * markdown mode.
 *
 * The `[test]` annotations that the docs test harness embeds in code samples are
 * stripped, mirroring `resolveMarkdown` - without this the markdown carries
 * internal expectations the rendered page never shows.
 *
 * `sdkVersions` resolves `<Version>` markers to the version numbers the
 * rendered page shows; without it they fall back to "latest".
 */
export function composeRawMarkdown(entry: CollectionEntry, sdkVersions?: SdkVersionMap): string {
    const metadata = entry.metadata as { title?: string; description?: string };
    const heading = metadata.title ? `# ${metadata.title}` : undefined;
    const body = flattenMdxComponents(
        stripLanguageTestComments(stripLeadingH1(entry.content)),
        sdkVersions,
    );

    const document = [heading, metadata.description, body].filter(Boolean).join("\n\n");

    return `${suffixDocsLinks(document)}\n`;
}
