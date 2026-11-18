/**
 * When each page last changed, from `generated/last-modified.json`, which
 * `scripts/generate-last-modified.mjs` writes from the git history at build
 * time (`prebuild`). A server has no git history to ask at request time.
 *
 * Server-only: importing this module bundles the whole file, so a component
 * receives a page's date through its page data instead.
 *
 * Read through a glob so that a checkout that has not run `prebuild`, such as
 * `bun run dev` on a fresh clone, builds and runs without the file and simply
 * shows no dates. `bun run generate:last-modified` writes it.
 */

interface LastModifiedFile {
    /** Whether the history the dates came from was shallow. */
    shallow: boolean;
    /** ISO 8601 dates keyed by path without `/docs`, the docs root being `/`. */
    pages: Record<string, string>;
}

const files = import.meta.glob<LastModifiedFile>("../../generated/last-modified.json", {
    eager: true,
    import: "default",
});

const pages: Record<string, string> = Object.values(files)[0]?.pages ?? {};

/**
 * The date the page at `path` last changed, as an ISO 8601 string, or
 * undefined when it is not known. `path` excludes `/docs`; the docs root may
 * be given as `/` or as an empty string.
 */
export function lastModifiedFor(path: string): string | undefined {
    const key = `/${path.replace(/^\/+|\/+$/g, "")}`;

    return pages[key];
}
