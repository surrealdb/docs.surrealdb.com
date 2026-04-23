// ══════════════════════════════════════════════════════════
// docs-search-crawler — Vite plugin
//
// Runs at build time, after `vike-content-collection` has
// populated its global store, and emits a JSON artefact
// describing every page + section that should be searchable.
//
// The post-build `search:index` script reads this JSON,
// embeds each entry via OpenAI, and upserts the records into
// SurrealDB.
//
// Hooking into the build (rather than walking the filesystem
// from a standalone script) means we reuse the same parsed
// collection data the runtime uses, so search breadcrumbs and
// URLs always match what the site renders.
// ══════════════════════════════════════════════════════════

import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import type { Plugin } from "vite";
import type { CrawledEntry } from "../src/types";
// NOTE: `./crawl` is imported dynamically inside `closeBundle` (never at
// module load time). It transitively pulls in `@surrealdb/ui`, which eagerly
// imports `.webp` assets from its bundle. Vite's config loader evaluates
// `vite.config.ts` through Node's native loader, which doesn't know how to
// handle image files — so a static import here would break `vite dev` /
// `vite build` before any plugin hook ever runs. Deferring the import keeps
// the asset resolution inside the Rollup build pipeline where Vite's own
// asset handling can take over.
import type { CollectionEntry, LookupEntry } from "./crawl";

const CONTENT_CONFIG_PATTERN = /^\+Content\.(ts|js|mts|mjs)$/;

export interface DocsSearchCrawlerOptions {
    /** Where to write the crawled entries, relative to the project root. */
    outFile: string;
    /** Directory scanned for `+Content.ts` files. Defaults to `"src/content"`. */
    contentDir?: string;
    /** Collection IDs to skip (e.g. labs which uses a different schema). */
    skipCollections?: string[];
}

export function docsSearchCrawlerPlugin(options: DocsSearchCrawlerOptions): Plugin {
    const skipped = new Set(options.skipCollections ?? ["labs-items"]);
    const contentDir = options.contentDir ?? "src/content";

    let projectRoot = process.cwd();
    let hasRun = false;

    return {
        name: "docs-search-crawler",
        apply: "build",
        // Run after `vike-content-collection` (`enforce: "pre"`) so the
        // global store is populated before we read it.
        enforce: "post",
        configResolved(config) {
            projectRoot = config.root;
        },
        // `vike build` triggers two rollup passes (client + SSR) which both
        // call `closeBundle`. The `hasRun` flag keeps the work to a single
        // pass; the resulting JSON is identical for both bundles.
        async closeBundle() {
            if (hasRun) return;
            hasRun = true;

            // Both modules are loaded lazily:
            //   • `vike-content-collection` works only after its plugin's
            //     `buildStart` has populated the global store.
            //   • `./crawl` pulls in `@surrealdb/ui` (dynamically), which
            //     eagerly references `.webp` assets — the `vike-content-
            //     collection` plugin installs a Node loader hook that
            //     handles those, but only by the time `buildStart` has run.
            const [{ getCollection, getCollectionEntry }, { createCrawler }] = await Promise.all([
                import("vike-content-collection"),
                import("./crawl"),
            ]);
            const crawlEntry = await createCrawler();

            const contentDirAbs = resolve(projectRoot, contentDir);
            const collectionIds = await discoverCollectionIds(contentDirAbs);

            const entries: CrawledEntry[] = [];
            let pageCount = 0;
            let sectionCount = 0;

            for (const collectionId of collectionIds) {
                if (skipped.has(collectionId)) continue;

                const lookup: LookupEntry = (slug) =>
                    getCollectionEntry(collectionId, slug) as CollectionEntry | undefined;

                const collectionEntries = getCollection(collectionId) as CollectionEntry[];

                for (const entry of collectionEntries) {
                    if (isCategoryEntry(entry.slug)) continue;

                    for (const crawled of crawlEntry(collectionId, entry, lookup)) {
                        entries.push(crawled);
                        if (crawled.kind === "page") pageCount++;
                        else sectionCount++;
                    }
                }
            }

            const outPath = resolve(projectRoot, options.outFile);
            await mkdir(dirname(outPath), { recursive: true });
            await writeFile(outPath, JSON.stringify(entries));

            console.log(
                `[docs-search-crawler] Wrote ${pageCount} page(s) + ${sectionCount} section(s) to ${options.outFile}`,
            );
        },
    };
}

/** Category entries (`__category` files) are metadata-only — never indexed. */
function isCategoryEntry(slug: string): boolean {
    return slug === "__category" || slug.endsWith("/__category");
}

/**
 * Walks `contentDir` for `+Content.{ts,js,mts,mjs}` files and returns each
 * file's directory (relative to `contentDir`) as a collection ID. Mirrors
 * the discovery logic used by `vike-content-collection` itself.
 */
async function discoverCollectionIds(contentDir: string): Promise<string[]> {
    const ids: string[] = [];

    async function scan(dir: string): Promise<void> {
        let dirEntries: import("node:fs").Dirent[];
        try {
            dirEntries = await readdir(dir, { withFileTypes: true });
        } catch {
            return;
        }

        for (const dirEntry of dirEntries) {
            const full = resolve(dir, dirEntry.name);

            if (dirEntry.isDirectory()) {
                await scan(full);
            } else if (dirEntry.isFile() && CONTENT_CONFIG_PATTERN.test(dirEntry.name)) {
                const id = relative(contentDir, dir).replace(/\\/g, "/");
                if (id) ids.push(id);
            }
        }
    }

    await scan(contentDir);
    ids.sort();
    return ids;
}
