import { useLocalStorage } from "@mantine/hooks";

const STORAGE_KEY = "docs-sidebar-collapsed";

/**
 * Whether the reader has collapsed the docs tree. The choice is remembered
 * between pages and visits. The server and the first client render always show
 * the tree, and a stored choice applies once the page has hydrated.
 */
export function useSidebarCollapsed() {
    const [collapsed, setCollapsed] = useLocalStorage<boolean>({
        key: STORAGE_KEY,
        defaultValue: false,
        getInitialValueInEffect: true,
    });

    return [collapsed, () => setCollapsed((current) => !current)] as const;
}
