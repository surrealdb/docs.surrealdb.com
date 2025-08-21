import { execFile } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

// Simple in-process cache for GitHub API calls to avoid rate limits
const commitDateCache = new Map<string, Date>();

export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function matchUrl(url: string, search: string): boolean {
    return new RegExp(`${escapeRegex(search)}\\b.*`, 'i').test(url);
}

export function at(value: unknown): string {
    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'number') {
        return value.toString();
    }

    if (value === false || value === null || value === undefined) {
        return '';
    }

    return JSON.stringify(value);
}

export async function getLastModifiedDateOfFile(
    filePath: string
): Promise<Date | undefined> {
    // Check cache first
    const cached = commitDateCache.get(filePath);
    if (cached) return cached;

    // Try GitHub API first for accurate per-file commit dates
    async function tryGitHubApi(): Promise<Date | undefined> {
        try {
            const ownerRepo = 'surrealdb/docs.surrealdb.com';
            const [owner, repo] = ownerRepo.split('/');
            if (!owner || !repo) return undefined;

            const branch = 'main';

            const url = new URL(`https://api.github.com/repos/${owner}/${repo}/commits`);
            url.searchParams.set('path', filePath);
            url.searchParams.set('sha', branch);
            url.searchParams.set('per_page', '1');

            const headers: Record<string, string> = {
                Accept: 'application/vnd.github+json',
            };

            const res = await fetch(url, { headers });
            if (!res.ok) return undefined;

            interface GitHubCommitListItem {
                commit?: {
                    author?: { date?: string };
                    committer?: { date?: string };
                };
            }

            const data = (await res.json()) as unknown;
            const first = Array.isArray(data)
                ? (data[0] as GitHubCommitListItem | undefined)
                : undefined;
            const dateStr = first?.commit?.committer?.date || first?.commit?.author?.date;
            if (dateStr) {
                const date = new Date(dateStr);
                commitDateCache.set(filePath, date);
                return date;
            }
        } catch (_) {
            // Ignore network or API errors and continue to git fallback
        }
        return undefined;
    }

    // Use Git last commit timestamp for this file, fallback to filesystem mtime
    async function tryGitLog(): Promise<Date | undefined> {
        try {
            const { stdout } = await execFileAsync('git', [
                'log',
                '-1',
                '--follow',
                '--format=%ct',
                '--',
                filePath,
            ]);

            const trimmed = stdout.trim();
            if (trimmed.length === 0) return undefined;

            const unixSeconds = Number.parseInt(trimmed, 10);
            if (!Number.isNaN(unixSeconds) && unixSeconds > 0) {
                return new Date(unixSeconds * 1000);
            }
        } catch (_) {
            // Ignore Git errors (e.g., not a git repo, shallow clone, file untracked, missing git)
        }
        return undefined;
    }

    // Try GitHub API first
    const ghDate = await tryGitHubApi();
    if (ghDate) return ghDate;

    // Fallback to git
    const gitDate = await tryGitLog();
    if (gitDate) return gitDate;

    // Attempt to deepen shallow clones, then retry (best-effort)
    try {
        await execFileAsync('git', ['fetch', '--unshallow']);
    } catch (_) {
        try {
            await execFileAsync('git', ['fetch', '--depth=1000']);
        } catch (_) {
            // Ignore failures
        }
    }

    const gitDateAfterFetch = await tryGitLog();
    if (gitDateAfterFetch) return gitDateAfterFetch;

    // Final fallback to filesystem
    try {
        const stats = await stat(filePath);
        return stats.mtime;
    } catch (error) {
        console.error(
            `Error getting last modified date of file ${filePath}:`,
            error
        );
        return undefined;
    }
}
