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
    try {
        const { stdout } = await execFileAsync('git', [
            'log',
            '-1',
            '--format=%ct',
            '--',
            filePath,
        ]);

        const unixSeconds = Number.parseInt(stdout.trim(), 10);
        if (!Number.isNaN(unixSeconds) && unixSeconds > 0) {
            return new Date(unixSeconds * 1000);
        }
    } catch (_) {
        // Ignore Git errors (e.g., not a git repo, shallow clone, or file untracked)
    }

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
