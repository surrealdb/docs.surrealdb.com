import { useSyncExternalStore } from "react";

/**
 * The storage prefix `@surrealdb/ui` uses for its own synced tabs, kept so a
 * choice a reader made before this store existed still applies.
 */
const STORAGE_PREFIX = "surreal-synced-tabs__";

/** The tab group key that every major version tab group and the header menu share. */
export const MAJOR_VERSION_KEY = "surrealdb-version";

type Listener = () => void;

const selected = new Map<string, string>();
const listeners = new Map<string, Set<Listener>>();

function read(key: string): string | null {
    if (selected.has(key)) return selected.get(key) ?? null;

    try {
        return localStorage.getItem(STORAGE_PREFIX + key);
    } catch {
        return null;
    }
}

function notify(key: string) {
    for (const listener of listeners.get(key) ?? []) listener();
}

/**
 * Selects `label` in every tab group that shares `key`, on this page and on
 * every later page, and in other browser tabs through the `storage` event.
 */
export function selectSyncedTab(key: string, label: string) {
    selected.set(key, label);

    try {
        localStorage.setItem(STORAGE_PREFIX + key, label);
    } catch {
        // Storage can be blocked; the choice still applies to this page.
    }

    notify(key);
}

function subscribe(key: string, listener: Listener): () => void {
    let set = listeners.get(key);

    if (!set) {
        set = new Set();
        listeners.set(key, set);
    }

    set.add(listener);

    const onStorage = (event: StorageEvent) => {
        if (event.key !== STORAGE_PREFIX + key || event.newValue === null) return;
        selected.set(key, event.newValue);
        notify(key);
    };

    window.addEventListener("storage", onStorage);

    return () => {
        set.delete(listener);
        window.removeEventListener("storage", onStorage);
    };
}

/**
 * The label selected for `key`, or `null` when there is none. The server and
 * the first client render both see `null`, so hydration matches, and the
 * stored choice applies straight after.
 */
export function useSyncedTab(key: string | undefined): string | null {
    return useSyncExternalStore(
        (listener) => (key ? subscribe(key, listener) : () => {}),
        () => (key ? read(key) : null),
        () => null,
    );
}
