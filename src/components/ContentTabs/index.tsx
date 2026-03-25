import { Tabs as MantineTabs } from "@mantine/core";
import { Children, isValidElement, type ReactNode, useCallback, useEffect, useState } from "react";
import classes from "./style.module.scss";

const SYNC_EVENT = "content-tabs-sync";

interface TabInfo {
    value: string;
    label: string;
    isDefault: boolean;
    content: ReactNode;
}

interface AstNode {
    attributes?: Record<string, unknown>;
}

/**
 * RenderMarkdown wraps each child in an intermediate renderer element
 * whose props carry the AST node (`el.props.node`). Tab metadata
 * (label, value, default) lives in `node.attributes`, not directly
 * on `el.props`. We check both locations so the component works
 * regardless of how the renderer structures the element tree.
 */
function extractTabs(children: ReactNode): TabInfo[] {
    const elements = Children.toArray(children).filter(isValidElement);

    return elements.map((el, i) => {
        const props = el.props as Record<string, unknown>;
        const node = props.node as AstNode | undefined;
        const attrs = node?.attributes ?? props;

        const label = String(attrs.label ?? attrs.value ?? i);
        const value = String(attrs.value ?? attrs.label ?? i);
        const isDefault = attrs.default === true || attrs.default === "";

        return {
            value,
            label,
            isDefault,
            content: el,
        };
    });
}

interface ContentTabsProps {
    groupId?: string;
    syncKey?: string;
    children?: ReactNode;
}

export function ContentTabs({ groupId, syncKey, children }: ContentTabsProps) {
    const key = syncKey ?? groupId;
    const tabs = extractTabs(children);

    const initial = tabs.find((t) => t.isDefault)?.value ?? tabs[0]?.value ?? "0";

    const [active, setActive] = useState(initial);

    useEffect(() => {
        if (!key) return;

        const handler = ((e: CustomEvent<{ key: string; value: string }>) => {
            if (e.detail.key === key) {
                setActive(e.detail.value);
            }
        }) as EventListener;

        document.addEventListener(SYNC_EVENT, handler);
        return () => document.removeEventListener(SYNC_EVENT, handler);
    }, [key]);

    const handleChange = useCallback(
        (value: string | null) => {
            if (!value) return;
            setActive(value);

            if (key) {
                document.dispatchEvent(
                    new CustomEvent(SYNC_EVENT, {
                        detail: { key, value },
                    }),
                );
            }
        },
        [key],
    );

    if (tabs.length === 0) return null;

    return (
        <MantineTabs
            value={active}
            onChange={handleChange}
            className={classes.tabs}
            variant="gradient"
        >
            <MantineTabs.List>
                {tabs.map((tab) => (
                    <MantineTabs.Tab
                        key={tab.value}
                        value={tab.value}
                    >
                        {tab.label}
                    </MantineTabs.Tab>
                ))}
            </MantineTabs.List>

            {tabs.map((tab) => (
                <MantineTabs.Panel
                    key={tab.value}
                    value={tab.value}
                    pt="md"
                >
                    {tab.content}
                </MantineTabs.Panel>
            ))}
        </MantineTabs>
    );
}

export function ContentTabItem({ children }: Record<string, unknown>) {
    return <>{children as ReactNode}</>;
}
