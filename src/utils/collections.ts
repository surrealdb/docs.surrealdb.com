import { getCollectionEntry } from "vike-content-collection";
import { stripLeadingH1 } from "./markdown";
import { COLLECTION_ROUTES } from "./routes";

export { COLLECTION_ROUTES };

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
 * avoid a duplicate heading). Internal docs links are rewritten to `.md` so
 * link-following stays in markdown mode.
 */
export function composeRawMarkdown(entry: CollectionEntry): string {
    const metadata = entry.metadata as { title?: string; description?: string };
    const heading = metadata.title ? `# ${metadata.title}` : undefined;
    const body = stripLeadingH1(entry.content);

    const document = [heading, metadata.description, body].filter(Boolean).join("\n\n");

    return `${suffixDocsLinks(document)}\n`;
}
