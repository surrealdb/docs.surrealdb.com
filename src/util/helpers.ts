import { execFile } from 'node:child_process';
import { stat } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

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
    // Prefer Git last commit timestamp for this file, fallback to filesystem mtime
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

    // First attempt
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

    // Fallback: query GitHub API for the last commit affecting this file (useful when .git is absent in build env)
    async function tryGitHubApi(): Promise<Date | undefined> {
        try {
            const ownerRepo =
                process.env.GITHUB_REPOSITORY ?? 'surrealdb/docs.surrealdb.com';
            const [owner, repo] = ownerRepo.split('/');
            if (!owner || !repo) return undefined;

            const branch =
                process.env.VERCEL_GIT_COMMIT_REF ||
                process.env.GITHUB_REF_NAME ||
                'main';

            const url = new URL(
                `https://api.github.com/repos/${owner}/${repo}/commits`
            );
            url.searchParams.set('path', filePath);
            url.searchParams.set('sha', branch);
            url.searchParams.set('per_page', '1');

            const headers: Record<string, string> = {
                Accept: 'application/vnd.github+json',
            };
            const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
            if (token) headers.Authorization = `Bearer ${token}`;

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
            const dateStr =
                first?.commit?.committer?.date || first?.commit?.author?.date;
            if (dateStr) return new Date(dateStr);
        } catch (_) {
            // Ignore network or API errors and continue to filesystem fallback
        }
        return undefined;
    }

    const ghDate = await tryGitHubApi();
    if (ghDate) return ghDate;

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
