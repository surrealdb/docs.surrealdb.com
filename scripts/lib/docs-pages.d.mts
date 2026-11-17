/** Types for `docs-pages.mjs`, so TypeScript scripts can share it with the generators. */

export interface DocsPage {
    url: string;
    file: string;
    title: string;
    description: string;
    priority: number;
    depth: number;
}

export const CONTENT_DIR: string;
export const PAGES_DIR: string;
export const SITE: string;

export function frontmatter(file: string): Record<string, string>;
export function slugify(segment: string): string;
export function walk(dir: string): string[];
export function readCollections(): Map<string, string>;
export function findDataFiles(dir: string): string[];
export function byDepthThenUrl(a: DocsPage, b: DocsPage): number;
export function pagesFor(id: string, prefix: string): DocsPage[];
