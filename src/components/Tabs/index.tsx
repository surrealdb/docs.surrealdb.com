import { Tabs as MantineTabs } from "@mantine/core";
import { MarkdownContent } from "@surrealdb/ui";
import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from "react";
import {
    MAJOR_VERSION_KEY,
    SYNCED_TAB_SELECT_EVENT,
    selectSyncedTab,
    useSyncedTab,
} from "~/utils/synced-tabs";

/** Fired on `window` after any tab group changes the panel it shows. */
export const TABS_CHANGE_EVENT = "docs:tabs-change";

export interface TabsProps {
    syncKey?: string;
    children?: ReactNode;
}

interface Item {
    label: string;
    content: ReactNode;
}

function collectItems(children: ReactNode): Item[] {
    return (
        Children.map(children, (child, index) => {
            if (!isValidElement<{ label?: string; children?: ReactNode }>(child)) {
                return {
                    label: `Tab ${index + 1}`,
                    content: <MarkdownContent>{child}</MarkdownContent>,
                };
            }

            return {
                label: child.props.label || `Tab ${index + 1}`,
                content: <MarkdownContent>{child.props.children}</MarkdownContent>,
            };
        }) ?? []
    );
}

/**
 * Tab groups for markdown content, overriding the kit's for two reasons.
 *
 * Groups that share a `syncKey` switch together on the same page. The kit
 * syncs them through the `storage` event only, which a browser never fires in
 * the window that made the change, so they agreed only after a reload. The
 * header's version menu selects the `surrealdb-version` groups the same way.
 *
 * A link to a heading inside a panel the group is not showing opens that
 * panel, without changing the reader's stored choice, whether the page loads
 * with the link or the link is followed on the page. Every other group with
 * the same `syncKey` opens its panel of the same name too, so a link to
 * `#axum` on a page with a tab group for each step shows Axum in all of them.
 * Version groups are the exception: the header's version menu reads their
 * stored choice, so a link to a 3.x heading opens only the group it is in.
 */
export function Tabs({ syncKey, children }: TabsProps) {
    const items = collectItems(children);
    const labels = items.map((item) => item.label);
    const first = labels[0] ?? "";

    const synced = useSyncedTab(syncKey);
    const [local, setLocal] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const value =
        (local && labels.includes(local) && local) ||
        (synced && labels.includes(synced) && synced) ||
        first;

    // biome-ignore lint/correctness/useExhaustiveDependencies: reads the labels and key of this group, which do not change
    useEffect(() => {
        const openLinkedPanel = () => {
            const id = decodeURIComponent(window.location.hash.slice(1));
            const target = id ? document.getElementById(id) : null;
            const panel = target?.closest<HTMLElement>("[data-tab-label]");
            const group = panel?.closest<HTMLElement>("[data-docs-tabs]");
            const label = panel?.dataset.tabLabel;

            if (!group || !label) return;

            if (group === rootRef.current) {
                setLocal(label);
                requestAnimationFrame(() => target?.scrollIntoView());
            } else if (
                syncKey &&
                syncKey !== MAJOR_VERSION_KEY &&
                group.dataset.syncKey === syncKey &&
                labels.includes(label)
            ) {
                setLocal(label);
            }
        };

        openLinkedPanel();
        window.addEventListener("hashchange", openLinkedPanel);
        return () => window.removeEventListener("hashchange", openLinkedPanel);
    }, []);

    // A reader picking a tab, here, in another group or in the header, overrides
    // a panel that a link opened
    useEffect(() => {
        if (!syncKey) return;
        const onSelect = (event: Event) => {
            if ((event as CustomEvent<string>).detail === syncKey) setLocal(null);
        };
        window.addEventListener(SYNCED_TAB_SELECT_EVENT, onSelect);
        return () => window.removeEventListener(SYNCED_TAB_SELECT_EVENT, onSelect);
    }, [syncKey]);

    // A change to the shared choice from another browser tab does the same. The
    // first stored value to arrive after hydration does not count as a change.
    const previousSynced = useRef(synced);

    useEffect(() => {
        if (previousSynced.current !== null && previousSynced.current !== synced) setLocal(null);
        previousSynced.current = synced;
    }, [synced]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: runs on each change of the shown panel
    useEffect(() => {
        window.dispatchEvent(new Event(TABS_CHANGE_EVENT));
    }, [value]);

    const onChange = (next: string | null) => {
        if (!next) return;
        setLocal(syncKey ? null : next);
        if (syncKey) selectSyncedTab(syncKey, next);
    };

    return (
        <MantineTabs
            ref={rootRef}
            value={value}
            onChange={onChange}
            variant="gradient"
            keepMounted
            keepMountedMode="display-none"
            data-docs-tabs
            data-sync-key={syncKey}
        >
            <MantineTabs.List>
                {items.map((item) => (
                    <MantineTabs.Tab
                        key={item.label}
                        value={item.label}
                    >
                        {item.label}
                    </MantineTabs.Tab>
                ))}
            </MantineTabs.List>
            {items.map((item) => (
                <MantineTabs.Panel
                    key={item.label}
                    value={item.label}
                    pt="md"
                    data-tab-label={item.label}
                >
                    {item.content}
                </MantineTabs.Panel>
            ))}
        </MantineTabs>
    );
}
