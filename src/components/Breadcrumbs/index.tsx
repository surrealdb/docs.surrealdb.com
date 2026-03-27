import { Anchor, Breadcrumbs, Text } from "@mantine/core";
import { usePageContext } from "vike-react/usePageContext";
import { findBreadcrumbTrail, type SidebarItem } from "~/utils/sidebar";

export interface PageBreadcrumbsProps {
    sidebar: SidebarItem[];
}

export function PageBreadcrumbs({ sidebar }: PageBreadcrumbsProps) {
    const { urlPathname } = usePageContext();
    const trail = findBreadcrumbTrail(sidebar, urlPathname);

    if (!trail?.length) return null;

    return (
        <Breadcrumbs
            fz="sm"
            separator={
                <Text
                    c="slate"
                    fw={600}
                >
                    /
                </Text>
            }
        >
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
