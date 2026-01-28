const DOCS_PATH = 'dist/docs';

export const IGNORE_DIRECTORIES_REGEX = ['_astro'];

export const ALLOW_FILES_EXTENSIONS = ['html'];

import { execFile } from 'node:child_process';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { promisify } from 'node:util';
import { parse } from 'node-html-parser';

const execFileAsync = promisify(execFile);

interface MapEntryLink {
    text: string;
    url: string;
    summary: string;
    exclude: boolean;
}

interface MapEntry {
    title: string;
    summary: string;
    links: MapEntryLink[];
    children?: MapEntry[];
}

async function listDirectories(path: string) {
    const entries = await readdir(path, { withFileTypes: true });
    return entries
        .filter((d) => d.isDirectory())
        .filter(
            (d) =>
                !IGNORE_DIRECTORIES_REGEX.some((rx) =>
                    new RegExp(rx).test(d.name)
                )
        )
        .map((d) => d.name);
}

async function listHtmlFilesRecursively(path: string): Promise<string[]> {
    const results: string[] = [];
    const entries = await readdir(path, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (
                IGNORE_DIRECTORIES_REGEX.some((rx) =>
                    new RegExp(rx).test(entry.name)
                )
            )
                continue;
            results.push(
                ...(await listHtmlFilesRecursively(join(path, entry.name)))
            );
            continue;
        }
        const isAllowed = ALLOW_FILES_EXTENSIONS.some((ext) =>
            entry.name.toLowerCase().endsWith(`.${ext}`)
        );
        if (!isAllowed) continue;
        results.push(join(path, entry.name));
    }
    return results;
}

function toDocsUrl(filePath: string) {
    const rel = relative(DOCS_PATH, filePath).split(sep).join('/');
    let href = `/docs/${rel}`;
    if (href.endsWith('/index.html'))
        href = href.slice(0, -'/index.html'.length);
    else if (href.endsWith('.html')) href = href.slice(0, -'.html'.length);
    return new URL(href, 'https://surrealdb.com').toString();
}

async function parseHtmlForLink(
    filePath: string
): Promise<MapEntryLink | null> {
    try {
        const content = await readFile(filePath, 'utf-8');
        const html = parse(content);
        const rawTitle = html.querySelector('title')?.text || '';
        const titleParts = rawTitle
            .split(' | ')
            .map((p) => p.trim())
            .filter(Boolean);
        let title = titleParts[0] ?? '';
        const relPathFromDocs = relative(DOCS_PATH, filePath)
            .split(sep)
            .join('/');
        if (relPathFromDocs.startsWith('sdk/')) {
            // For SDK pages, prefer the most specific trailing segment in the title
            title = titleParts[titleParts.length - 1] ?? title;
        }

        // Normalize display: handle underscores and uppercase first letter
        if (title.includes('_')) {
            const normalized = title.replace(/_/g, ' ').toLowerCase();
            title = normalized.charAt(0).toUpperCase() + normalized.slice(1);
        } else if (title) {
            // Ensure first letter is uppercase
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }
        if (!title) return null;
        const description =
            html
                .querySelector("meta[name='description']")
                ?.getAttribute('content')
                ?.trim() || '';
        const paragraphs = html
            .querySelectorAll('.flag-markdown p')
            .slice(0, 3)
            .map((p) => p.text.trim())
            .filter(Boolean)
            .join(' ');
        const summary = normalizeSummary(paragraphs || description);
        return {
            text: title,
            url: toDocsUrl(filePath),
            summary: summary,
            exclude: !shouldIncludeInMinimal(relPathFromDocs, title),
        };
    } catch {
        return null;
    }
}

function normalizeSummary(input: string): string {
    if (!input) return '';
    // Collapse whitespace and unify spaces
    let text = input.replace(/\s+/g, ' ').trim();
    // Split into sentences conservatively on . ! ? followed by space or end
    const sentences = text
        .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
        .map((s) => s.trim())
        .filter(Boolean);
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const s of sentences) {
        const key = s.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(s);
        if (deduped.length >= 2) break; // keep it concise
    }
    text = deduped.join(' ');
    // Final length guard
    const maxLen = 320;
    if (text.length > maxLen) {
        text = `${text
            .slice(0, maxLen)
            .replace(/[,;\s]+[^,;\s]*$/, '')
            .trim()}...`;
    }
    return text;
}

function shouldIncludeInMinimal(
    relPathFromDocs: string,
    title: string
): boolean {
    const path = relPathFromDocs.toLowerCase();
    const name = title.toLowerCase();
    const segments = path.split('/');

    // 1) Always include top-level section index pages: <section>/index.html
    if (segments.length === 2 && segments[1] === 'index.html') {
        return true;
    }

    // 2) SurrealQL: include main category indexes
    if (
        segments[0] === 'surrealql' &&
        segments.length === 3 &&
        segments[2] === 'index.html'
    ) {
        if (
            ['statements', 'clauses', 'functions', 'datamodel'].includes(
                segments[1]
            )
        )
            return true;
    }

    // 3) SDKs: include language landing indexes and select onboarding/concepts pages
    if (segments[0] === 'sdk') {
        // language index
        if (segments.length === 3 && segments[2] === 'index.html') return true;
        // onboarding and concepts pages
        const allowSdkKeywords =
            /(installation|install|start|getting-started|quick[- ]?start|setup|concepts|core|data-types|frameworks|properties|api-documentation|create-a-new-connection)/i;
        if (allowSdkKeywords.test(path) || allowSdkKeywords.test(name))
            return true;
        // Exclude method-heavy or API detail pages by default
        const denySdkKeywords = /(methods|api|class|function|examples?)/i;
        if (denySdkKeywords.test(path) || denySdkKeywords.test(name))
            return false;
        return false;
    }

    // 4) Cloud: include index and key onboarding pages
    if (segments[0] === 'cloud') {
        if (
            /(getting-started|connect|architecture|faqs|billing|support|create-an-account|create-an-instance)/i.test(
                path
            )
        )
            return true;
    }

    // 5) SurrealDB: include intro, installation, querying hubs
    if (segments[0] === 'surrealdb') {
        if (
            /(introduction|installation|querying|models|embedding|cli)/i.test(
                path
            )
        )
            return true;
    }

    // 6) Integrations: include key category indexes
    if (segments[0] === 'integrations') {
        if (
            /(^integrations\/index\.html$|embeddings\/index\.html$|frameworks\/index\.html$|data-management\/index\.html$|surreal-sync\/index\.html$)/i.test(
                path
            )
        )
            return true;
    }

    // 7) Surrealist: include landing and getting started
    if (segments[0] === 'surrealist') {
        if (/(index\.html$|getting-started|installation)/i.test(path))
            return true;
    }

    // 8) SurrealML / SurrealKV: include landing only
    if (segments[0] === 'surrealml' || segments[0] === 'surrealkv') {
        return segments.length === 2 && segments[1] === 'index.html';
    }

    // 9) Tutorials: exclude from minimal
    if (segments[0] === 'tutorials') return false;

    // 10) Fallback: only include obvious overview/introduction pages
    if (/(overview|introduction|about)/i.test(name)) return true;

    return false;
}

function titleFromFolder(folder: string) {
    switch (folder.toLowerCase()) {
        case 'surrealdb':
            return 'SurrealDB';
        case 'surrealql':
            return 'SurrealQL';
        case 'surrealml':
            return 'SurrealML';
        case 'surrealkv':
            return 'SurrealKV';
        case 'surrealist':
            return 'Surrealist';
        case 'integrations':
            return 'Integrations';
        case 'cloud':
            return 'Cloud';
        case 'labs':
            return 'Labs';
        case 'sdk':
            return 'SDK';
        case 'tutorials':
            return 'Tutorials';
        default:
            return folder.charAt(0).toUpperCase() + folder.slice(1);
    }
}

async function buildSectionSummary(sectionPath: string) {
    const indexFile = join(sectionPath, 'index.html');
    try {
        await stat(indexFile);
        const link = await parseHtmlForLink(indexFile);
        return link?.summary || '';
    } catch {
        return '';
    }
}

async function generateMap(): Promise<MapEntry[]> {
    const folders = await listDirectories(DOCS_PATH);
    const sections: MapEntry[] = [];
    for (const folder of folders) {
        const sectionPath = join(DOCS_PATH, folder);

        // Special handling for SDKs: group by language subfolders as children
        if (folder.toLowerCase() === 'sdk') {
            const languageFolders = await listDirectories(sectionPath);
            const languageEntries: MapEntry[] = [];
            for (const lang of languageFolders) {
                const langPath = join(sectionPath, lang);
                const langFiles = await listHtmlFilesRecursively(langPath);
                const langLinks: MapEntryLink[] = [];
                for (const filePath of langFiles) {
                    const link = await parseHtmlForLink(filePath);
                    if (link) langLinks.push(link);
                }
                languageEntries.push({
                    title: titleFromSdkFolder(lang),
                    summary: await buildSectionSummary(langPath),
                    links: langLinks,
                });
            }

            sections.push({
                title: titleFromFolder(folder),
                summary: await buildSectionSummary(sectionPath),
                links: [],
                children: languageEntries,
            });
            continue;
        }

        const files = await listHtmlFilesRecursively(sectionPath);
        const links: MapEntryLink[] = [];
        for (const filePath of files) {
            const link = await parseHtmlForLink(filePath);
            if (link) links.push(link);
        }
        sections.push({
            title: titleFromFolder(folder),
            summary: await buildSectionSummary(sectionPath),
            links,
        });
    }
    return sections;
}

const titleFromSdkFolderMap = new Map<string, string>([
    ['php', 'PHP'],
    ['python', 'Python'],
    ['rust', 'Rust'],
    ['golang', 'Golang'],
    ['javascript', 'JavaScript'],
    ['typescript', 'TypeScript'],
    ['dotnet', '.NET'],
    ['java', 'Java'],
    ['wasm', 'WebAssembly'],
    ['nodejs', 'Node.js'],
    ['node.js', 'Node.js'],
    ['node', 'Node.js'],
    ['go', 'Golang'],
    ['csharp', '.NET'],
    ['c#', '.NET'],
]);

function titleFromSdkFolder(folder: string) {
    const value = titleFromSdkFolderMap.get(folder.toLowerCase());
    if (value) return value;
    return folder.charAt(0).toUpperCase() + folder.slice(1);
}

function linksToMarkdownLines(links: MapEntryLink[]): string[] {
    return links.map((l) => {
        const summary = l.summary?.trim();
        return summary
            ? `- [${l.text}](${l.url}): ${summary}`
            : `- [${l.text}](${l.url})`;
    });
}

function entryToMarkdown(
    entry: MapEntry,
    includeExcluded: boolean,
    headingLevel: number
): string {
    const lines: string[] = [];
    const headingPrefix = '#'.repeat(Math.max(3, headingLevel));
    lines.push(`${headingPrefix} ${entry.title}`);
    // Blank line after heading
    lines.push('');
    if (entry.summary?.trim()) {
        lines.push(entry.summary.trim());
        // Blank line after summary
        lines.push('');
    }

    const entryLinks = entry.links.filter((l) => includeExcluded || !l.exclude);
    if (entryLinks.length) {
        lines.push(...linksToMarkdownLines(entryLinks));
    }

    if (entry.children?.length) {
        for (const child of entry.children) {
            lines.push('');
            lines.push(
                entryToMarkdown(child, includeExcluded, headingLevel + 1)
            );
        }
    }

    return lines.join('\n');
}

function groupedMarkdown(
    entries: MapEntry[],
    includeExcluded: boolean
): string {
    const blocks: string[] = [];
    for (const entry of entries) {
        blocks.push(entryToMarkdown(entry, includeExcluded, 3));
    }
    return blocks.join('\n\n');
}

// Detect CI/PR environment
const isCI = !!(
    process.env.CI ||
    process.env.GITHUB_ACTIONS ||
    process.env.GITHUB_PR_NUMBER
);

// Always generate full map for llms.txt generation (scan all files)
const MAP: MapEntry[] = await generateMap();

// Prepend header and append footer around the grouped markdown
const headerPath = join('src', 'assets', 'header.md');
const footerPath = join('src', 'assets', 'footer.md');

const [headerContent, footerContent] = await Promise.all([
    readFile(headerPath, 'utf-8').catch(() => ''),
    readFile(footerPath, 'utf-8').catch(() => ''),
]).then(([header, footer]) => [header.trim(), footer.trim()]);

function withHeaderFooter(body: string) {
    return `${[headerContent, body.trim(), footerContent]
        .filter(Boolean)
        .join('\n\n')}\n`;
}

// Collect links for validation
function collectLinks(
    entries: MapEntry[],
    includeExcluded: boolean
): MapEntryLink[] {
    const out: MapEntryLink[] = [];
    for (const e of entries) {
        for (const l of e.links) if (includeExcluded || !l.exclude) out.push(l);
        if (e.children?.length)
            out.push(...collectLinks(e.children, includeExcluded));
    }
    return out;
}

// Remote existence check with HEAD fallback to GET
async function remoteExists(url: string): Promise<boolean> {
    const res = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
    });

    if (res.status === 405 || res.status === 501) {
        return false;
    }

    return res.ok;
}

// Local existence check for /docs/... mapped to dist/docs
async function localExists(url: string): Promise<boolean> {
    const u = new URL(url);
    const pathname = u.pathname.replace(/\/?$/, '');

    if (!pathname.startsWith('/docs')) {
        return true;
    }

    const rel = pathname.replace(/^\/docs\/?/, '');

    if (!rel) {
        return await stat(join(DOCS_PATH, 'index.html'))
            .then(() => true)
            .catch(() => false);
    }

    const htmlPath = join(DOCS_PATH, `${rel}.html`);
    const indexPath = join(DOCS_PATH, rel, 'index.html');

    return await Promise.race([stat(htmlPath), stat(indexPath)])
        .then(() => true)
        .catch(() => false);
}

async function checkLinks(urls: string[], skipRemote = false) {
    const unique = Array.from(new Set(urls));
    const total = unique.length;
    const bad: string[] = [];
    const localOnly: string[] = [];

    // Skip link checking entirely if SKIP_LINK_CHECK is set (for faster PR builds)
    if (process.env.SKIP_LINK_CHECK === 'true') {
        console.log('Skipping link validation (SKIP_LINK_CHECK=true)');
        return { bad: [], localOnly: [], total: 0 };
    }

    let processed = 0;

    for (const url of unique) {
        const pathname = new URL(url).pathname || url;
        process.stdout.write(
            `\r\x1b[2K[${++processed}/${total}] Checking: ${pathname}`
        );

        const isLocal = await localExists(url);

        if (isLocal) {
            // If skipping remote checks (e.g., in PR/CI), only validate local files
            if (skipRemote) {
                continue; // Local file exists, skip remote check
            }

            // Check remote only if local exists and we're not skipping remote
            const isRemote = await remoteExists(url);
            if (isRemote) {
                continue; // Exists both locally and remotely
            }

            localOnly.push(url);
            continue;
        }

        // Local file doesn't exist
        if (skipRemote) {
            // In CI/PR mode, only check local files - mark as bad if not found locally
            bad.push(url);
            continue;
        }

        // Check remote as fallback
        const isRemote = await remoteExists(url);
        if (!isRemote) {
            bad.push(url);
        }
    }

    process.stdout.write(`\r\x1b[2KChecked ${total} links.\n`);
    return { bad, localOnly, total };
}

// Get changed HTML files in PR/CI to only check new links
async function getChangedHtmlFiles(): Promise<string[]> {
    // Skip if not in CI
    if (!isCI) {
        return [];
    }

    try {
        // Get base branch (default to main, or use GITHUB_BASE_REF if available)
        const baseBranch = process.env.GITHUB_BASE_REF || 'main';

        // Get changed files
        const { stdout } = await execFileAsync('git', [
            'diff',
            '--name-only',
            '--diff-filter=AM', // Only Added and Modified files
            baseBranch,
            'HEAD',
        ]);

        const changedFiles = stdout
            .trim()
            .split('\n')
            .filter(Boolean)
            .filter((file) => file.endsWith('.html') || file.endsWith('.mdx'));

        // Map source files to dist files
        const distFiles: string[] = [];
        for (const file of changedFiles) {
            if (file.startsWith('src/content/')) {
                // Convert src/content/doc-X/path.mdx to dist/docs/path/index.html
                const relPath = file.replace(/^src\/content\/doc-[^/]+\//, '');
                const withoutExt = relPath.replace(/\.mdx?$/, '');
                const distPath = join(DOCS_PATH, withoutExt, 'index.html');
                try {
                    await stat(distPath);
                    distFiles.push(distPath);
                } catch {
                    // File doesn't exist in dist yet, skip
                }
            } else if (
                file.startsWith('dist/docs/') &&
                file.endsWith('.html')
            ) {
                distFiles.push(file);
            }
        }

        return distFiles;
    } catch (error) {
        console.warn('Could not get changed files, checking all links:', error);
        return [];
    }
}

// Extract links from specific HTML files
async function extractLinksFromFiles(filePaths: string[]): Promise<string[]> {
    const links: string[] = [];

    for (const filePath of filePaths) {
        try {
            const content = await readFile(filePath, 'utf-8');
            const html = parse(content);
            const anchors = html.querySelectorAll('a[href]');

            for (const anchor of anchors) {
                const href = anchor.getAttribute('href');
                if (!href) continue;

                // Convert relative URLs to absolute
                if (href.startsWith('/')) {
                    const url = new URL(
                        href,
                        'https://surrealdb.com'
                    ).toString();
                    links.push(url);
                } else if (href.startsWith('http')) {
                    links.push(href);
                }
            }
        } catch (error) {
            console.warn(`Error reading ${filePath}:`, error);
        }
    }

    return links;
}

// Skip remote checks in CI/PR environments for faster builds
const skipRemoteChecks = isCI || process.env.SKIP_REMOTE_LINK_CHECK === 'true';

// In CI/PR, automatically check only links from changed files (faster builds)
// In local/dev, check all links
const changedFiles = await getChangedHtmlFiles();
let linksToCheck: string[];

if (changedFiles.length > 0 && isCI) {
    console.log(
        `Found ${changedFiles.length} changed files, checking only links from these files`
    );
    linksToCheck = await extractLinksFromFiles(changedFiles);
} else {
    // Check all links (default behavior for local builds)
    const fullLinks = collectLinks(MAP, true).map((l) => l.url);
    linksToCheck = Array.from(new Set([...fullLinks]));
}

const allToCheck = Array.from(new Set(linksToCheck));
const { bad, localOnly, total } = await checkLinks(
    allToCheck,
    skipRemoteChecks
);

if (bad.length) {
    console.warn(`\nBroken links detected (${bad.length}/${total}):`);
    for (const url of bad) console.warn(` - [BROKEN] ${url}`);
}

if (localOnly.length) {
    console.warn(
        `\nLinks not available remotely but present locally (${localOnly.length}):`
    );
    for (const url of localOnly) console.warn(` - [LOCAL-ONLY] ${url}`);
}

// Always generate llms.txt files (we always have a full map)
await writeFile(
    join(DOCS_PATH, 'llms.txt'),
    withHeaderFooter(groupedMarkdown(MAP, false))
);
await writeFile(
    join(DOCS_PATH, 'llms-full.txt'),
    withHeaderFooter(groupedMarkdown(MAP, true))
);
