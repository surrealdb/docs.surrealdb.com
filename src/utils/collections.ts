import type { CollectionMap } from "vike-content-collection";
import { getCollection, getCollectionEntry } from "vike-content-collection";
import labs from "~/data/labs.json";
import labsBlog from "~/data/labs-blog.json";
import type { SdkVersionMap } from "~/lib/versions";
import { LLMS_TXT_URL } from "./agent-markdown";
import { labStages } from "./labs";
import { bundleFor, LLMS_BUNDLES, type LlmsBundle } from "./llms-bundles";
import { stripLanguageTestComments, stripLeadingH1 } from "./markdown";
import { flattenMdxComponents } from "./mdx-to-markdown";
import type { LabSchema } from "./schema";

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
    { prefix: "libraries", id: "libraries" },
    { prefix: "integrate/ai-agents", id: "integrate/ai-agents" },
    { prefix: "integrate/embedding", id: "integrate/embedding" },
    { prefix: "integrate/integrations", id: "integrate/integrations" },
    { prefix: "integrate/migrating", id: "integrate/migrating" },
    { prefix: "learn/data-models", id: "learn/data-models" },
    { prefix: "learn/database-basics", id: "learn/database-basics" },
    { prefix: "learn/extensions", id: "learn/extensions" },
    { prefix: "learn/querying", id: "learn/querying" },
    { prefix: "learn/schema-management", id: "learn/schema-management" },
    { prefix: "learn/security", id: "learn/security" },
    { prefix: "learn/tutorials", id: "learn/tutorials" },
    { prefix: "operate/enterprise", id: "operate/enterprise" },
    { prefix: "operate/instances", id: "operate/instances" },
    { prefix: "operate/observability", id: "operate/observability" },
    { prefix: "operate/organisations", id: "operate/organisations" },
    { prefix: "operate/schema-migration", id: "operate/schema-migration" },
    { prefix: "operate/self-hosted", id: "operate/self-hosted" },
    { prefix: "operate/upgrading", id: "operate/upgrading" },
    { prefix: "reference/cli", id: "reference/cli" },
    { prefix: "reference/studio", id: "reference/studio" },
    { prefix: "reference/dotnet", id: "reference/dotnet" },
    { prefix: "reference/golang", id: "reference/golang" },
    { prefix: "reference/java", id: "reference/java" },
    { prefix: "reference/javascript", id: "reference/javascript" },
    { prefix: "reference/kotlin", id: "reference/kotlin" },
    { prefix: "reference/mojo", id: "reference/mojo" },
    { prefix: "reference/php", id: "reference/php" },
    { prefix: "reference/python", id: "reference/python" },
    { prefix: "reference/query-language", id: "reference/query-language" },
    { prefix: "reference/protocols", id: "reference/protocols" },
    { prefix: "reference/rust", id: "reference/rust" },
    { prefix: "reference/swift", id: "reference/swift" },
    { prefix: "agent-memory/cookbooks", id: "agent-memory/cookbooks" },
    { prefix: "agent-memory/integrations", id: "agent-memory/integrations" },
    { prefix: "agent-memory/reference", id: "agent-memory/reference" },
    { prefix: "agent-memory/learn", id: "agent-memory/learn" },
    { prefix: "agent-memory/operate", id: "agent-memory/operate" },
    { prefix: "agent-memory", id: "agent-memory/index" },
    { prefix: "", id: "index" },
];

type CollectionEntry = NonNullable<ReturnType<typeof getCollectionEntry>>;

/** A content entry, with the collection and URL prefix that serve it. */
export interface CollectionMatch {
    entry: CollectionEntry;
    /** The collection id, such as `reference/javascript`. */
    id: string;
    /** The URL prefix the collection is served under, without `/docs`. */
    prefix: string;
    /** The entry's slug inside its collection. */
    slug: string;
}

/**
 * Resolve a URL pathname to its content collection entry and the collection
 * that serves it, using the same prefix-to-collection mapping the page routes
 * use.
 *
 * @param pathname - Docs pathname without the `/docs` base (leading/trailing
 *   slashes are tolerated), e.g. `reference/query-language/statements/select`.
 * @returns The match, or `undefined` if none resolves.
 */
export function resolveCollectionMatch(pathname: string): CollectionMatch | undefined {
    const path = pathname.replace(/^\/+/, "").replace(/\/+$/, "");

    for (const { prefix, id } of COLLECTION_ROUTES) {
        if (prefix !== "" && path !== prefix && !path.startsWith(`${prefix}/`)) {
            continue;
        }

        const slug = path.slice(prefix.length).replace(/^\/+/, "");
        const entry = getCollectionEntry(id, slug);

        if (entry) {
            return { entry, id, prefix, slug };
        }
    }

    return undefined;
}

/** Resolve a URL pathname to its content collection entry; see `resolveCollectionMatch`. */
export function resolveCollectionEntry(pathname: string): CollectionEntry | undefined {
    return resolveCollectionMatch(pathname)?.entry;
}

/**
 * Append a `.md` suffix to internal `/docs/...` links so an agent following
 * links from a raw markdown page stays in markdown mode. Handles both markdown
 * links (`](/docs/…)`) and JSX/HTML `href` attributes, preserving any trailing
 * `#anchor` or `?query`, and leaving root (`/docs`), directory (`/docs/…/`) and
 * already-suffixed links untouched.
 *
 * A link whose last segment carries an extension is left alone too, because it
 * addresses a file rather than a page. `/docs/llms.txt` and
 * `/docs/llms-full.txt` are the two that matter: they are the indexes this
 * whole convention exists to point an agent at, and suffixing them produced
 * `/docs/llms.txt.md`, which nothing serves. An extension is unambiguous here
 * because a slug never contains a dot - `github-slugger` drops them, so `v1.x`
 * becomes `v1x`.
 */
export function suffixDocsLinks(markdown: string): string {
    const appendMd = (path: string) => {
        const last = path.slice(path.lastIndexOf("/") + 1);
        return last.includes(".") || path.endsWith("/") ? path : `${path}.md`;
    };

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

/**
 * Prepend the pointer to the page index that a single-page markdown response
 * carries.
 *
 * An agent that arrives at one `.md` page by following a search result has no
 * way to learn that a curated index of the whole site exists; this is the line
 * that tells it, and it is what the `llms-txt-directive-md` readiness check
 * looks for. It is a blockquote so that it reads as metadata rather than as the
 * first sentence of the page.
 *
 * Applied at the response, not inside `composeRawMarkdown`, because
 * `composeFullCorpusMarkdown` reuses that function for every page it embeds and
 * already states this once in its own preamble - repeating it 1,000 times would
 * be the same fact at a thousand times the cost.
 */
export function withIndexPointer(markdown: string): string {
    return `> Full SurrealDB documentation index: ${LLMS_TXT_URL}\n\n${markdown}`;
}

/** The fields a page's markdown rendering opens with, in YAML frontmatter. */
export interface MarkdownFrontmatter {
    title: string;
    description?: string;
    canonical_url: string;
    /** The SDK an SDK reference page documents, such as "JavaScript SDK". */
    sdk?: string;
    /** The released SDK version that page describes, when it is known. */
    sdk_version?: string;
    /** The section or product any other page sits in. */
    section?: string;
    /** The SurrealDB major version the documentation describes, such as "4.x". */
    surrealdb_version: string;
    /** When the page's source last changed, as an ISO 8601 date. */
    last_modified?: string;
}

/**
 * Prepend YAML frontmatter to a page's markdown rendering, so an agent that
 * fetched one page knows what it is, where it lives, which SDK or section and
 * version it describes, and how recent it is, without parsing the prose.
 *
 * Applied at the response, like `withIndexPointer`, and outside it, because
 * frontmatter has to be the first thing in the document. Every value is
 * written as a JSON string, which is also a valid YAML scalar, so a colon or
 * a quote in a title cannot break the block. Fields without a value are left
 * out.
 */
export function withFrontmatter(fields: MarkdownFrontmatter, markdown: string): string {
    const lines = Object.entries(fields)
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);

    return `---\n${lines.join("\n")}\n---\n\n${markdown}`;
}

/**
 * Every Labs item, newest first: the awesome-surreal entries in
 * `src/data/labs.json` (written by `bun run generate:labs`) plus the blog posts
 * in `src/data/labs-blog.json` (written by `bun run generate:labs-blog`).
 */
type LabItem = LabSchema & { slug: string };

export function getLabItems(): LabItem[] {
    return [...(labs as LabItem[]), ...(labsBlog as LabItem[])].sort(
        (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
}

/**
 * The Labs listing as markdown.
 *
 * Labs is a React page over `getLabItems()` rather than an entry in
 * a documentation collection, so `resolveCollectionEntry` cannot reach it and it
 * had no `.md` of its own. `llms.txt` lists it and its preamble tells an agent
 * that appending `.md` works on any entry, so the choice was to write this or to
 * drop Labs back out of the index - and the listing is the answer to "what talks
 * and examples exist", which is worth more in markdown than in a card grid.
 *
 * Grouped by `labStages` in journey order.
 */
export function composeLabsMarkdown(): string {
    const items = getLabItems();

    const sections = labStages.flatMap((stage) => {
        const lines = items
            .filter((item) => item.stage === stage)
            .map((item) => {
                const { title, url, description, author } = item;
                // `author` is either the literal "surrealdb" or an object.
                const by = author === "surrealdb" ? "SurrealDB" : author.name;
                const link = url ? `[${title}](${url})` : title;

                // A couple of author names end in an initial, so the
                // sentence period would double up.
                const credit = by.endsWith(".") ? `By ${by}` : `By ${by}.`;

                return `- ${link} - ${description ? `${description} ` : ""}${credit}`;
            });

        return lines.length ? [`## ${stage}\n\n${lines.join("\n")}`] : [];
    });

    return [
        "# SurrealDB Labs",
        "Talks, videos and experiments from the team and the community. Each entry links out to its own source.",
        ...sections,
    ].join("\n\n");
}

const DOCS_ORIGIN = "https://surrealdb.com";

/** One page of the corpus, composed for `llms-full.txt` and its bundles. */
export interface CorpusPage {
    /** The page's path without `/docs`, the docs root being `/`. */
    path: string;
    /** The page as markdown, opening with its `Source:` line. */
    markdown: string;
}

/**
 * How to read the code examples in a corpus, said once at the top of each
 * corpus file rather than on every page.
 */
const CORPUS_CONVENTIONS = `Each page starts with a "Source:" line naming its canonical URL, and every page is also available individually by appending \`.md\` to its URL. In code examples, a fenced block whose title contains "output" holds the result of the block above it rather than runnable code, and a qualifier such as "Example output" or "Possible output" means the value shown is one of several possible ones. Inside a block, a "//-" comment marks a value the statement above it returned, while "--" is an ordinary comment.`;

/**
 * Every page of every collection, composed once, in the order `llms-full.txt`
 * lists them. Each page opens with a `Source:` line naming its canonical URL,
 * so an agent can cite or re-fetch the page it is quoting.
 *
 * Pages are composed with the same `composeRawMarkdown` pipeline as the
 * per-page `.md` endpoint, so `<Version>` markers, stripped test annotations,
 * and `.md`-suffixed internal links all match what a single-page fetch returns.
 * `__category` entries are folder metadata, not pages, and are skipped.
 */
export function composeCorpusPages(sdkVersions?: SdkVersionMap): CorpusPage[] {
    const pages: CorpusPage[] = [];

    for (const { prefix, id } of COLLECTION_ROUTES) {
        const entries = [...getCollection(id as keyof CollectionMap)]
            .filter((entry) => !entry.slug.endsWith("__category"))
            .sort((a, b) => a.slug.localeCompare(b.slug));

        for (const entry of entries) {
            const path = [prefix, entry.slug].filter(Boolean).join("/");
            const url = path ? `${DOCS_ORIGIN}/docs/${path}` : `${DOCS_ORIGIN}/docs`;
            const page = composeRawMarkdown(entry, sdkVersions).trimEnd();

            pages.push({ path: `/${path}`, markdown: `Source: ${url}\n\n${page}` });
        }
    }

    pages.push({
        path: "/labs",
        markdown: `Source: ${DOCS_ORIGIN}/docs/labs\n\n${composeLabsMarkdown().trimEnd()}`,
    });

    return pages;
}

function joinCorpus(header: string[], pages: CorpusPage[]): string {
    const sections = [...header, ...pages.map((page) => `---\n\n${page.markdown}`)];

    return `${sections.join("\n\n")}\n`;
}

/** The address a bundle is served at. */
export function bundleUrl(bundle: LlmsBundle): string {
    return `${DOCS_ORIGIN}/docs/llms-full/${bundle.slug}.txt`;
}

/**
 * The full documentation corpus served at `/docs/llms-full.txt`: every page
 * as one markdown document, in the llms-full.txt convention.
 */
export function composeFullCorpusMarkdown(pages: CorpusPage[]): string {
    return joinCorpus(
        [
            "# SurrealDB documentation - full corpus",
            `> The complete SurrealDB documentation as a single markdown document. The page index is at ${LLMS_TXT_URL}, which also lists the same pages split into ${LLMS_BUNDLES.length} smaller bundles, one per section or SDK, such as ${bundleUrl(LLMS_BUNDLES[0] as LlmsBundle)}. ${CORPUS_CONVENTIONS}`,
        ],
        pages,
    );
}

/**
 * One bundle of the corpus, served at `/docs/llms-full/<slug>.txt`: the pages
 * `bundleFor` assigns to it, in the order `llms-full.txt` lists them.
 */
export function composeBundleMarkdown(bundle: LlmsBundle, pages: CorpusPage[]): string {
    return joinCorpus(
        [
            `# SurrealDB documentation - ${bundle.title}`,
            `> ${bundle.description} This is one of the bundles the SurrealDB documentation is split into. The page index at ${LLMS_TXT_URL} lists every bundle, and ${DOCS_ORIGIN}/docs/llms-full.txt holds every page. ${CORPUS_CONVENTIONS}`,
        ],
        pages.filter((page) => bundleFor(page.path).slug === bundle.slug),
    );
}
