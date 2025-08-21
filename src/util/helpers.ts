import { stat } from 'node:fs/promises';

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
    try {
        return stat(filePath).then((stats) => stats.mtime);
    } catch (error) {
        console.error(
            `Error getting last modified date of file ${filePath}:`,
            error
        );
        return undefined;
    }
}
