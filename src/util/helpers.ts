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
