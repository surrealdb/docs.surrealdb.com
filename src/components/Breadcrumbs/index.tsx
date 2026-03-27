import { Anchor, Breadcrumbs } from "@mantine/core";
import { usePageContext } from "vike-react/usePageContext";
import { findBreadcrumbTrail, type SidebarItem } from "~/utils/sidebar";

export interface PageBreadcrumbsProps {
    sidebar: SidebarItem[];
}

export function PageBreadcrumbs({ sidebar }: PageBreadcrumbsProps) {
    const { urlPathname } = usePageContext();
    const trail = findBreadcrumbTrail(sidebar, urlPathname)?.slice(0, -1);

    if (!trail?.length) return null;

    return (
        <Breadcrumbs fz="sm">
            {trail.map((item) => {
                return (
                    <Anchor
                        key={item.href}
                        href={item.href}
                        variant="vibrant"
                        fz="md"
                        lh="unset"
                        fw={600}
                    >
                        {item.label}
                    </Anchor>
                );
            })}
        </Breadcrumbs>
    );
}
