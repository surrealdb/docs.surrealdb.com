import { Anchor, Breadcrumbs } from "@mantine/core";
import { Icon, iconChevronRight, iconHome } from "@surrealdb/ui";
import { findBreadcrumbTrail, type SidebarItem } from "@util/sidebar";
import { usePageContext } from "vike-react/usePageContext";
import classes from "./style.module.scss";

export interface PageBreadcrumbsProps {
    sidebar: SidebarItem[];
}

export function PageBreadcrumbs({ sidebar }: PageBreadcrumbsProps) {
    const { urlPathname } = usePageContext();
    const trail = findBreadcrumbTrail(sidebar, urlPathname);

    if (!trail?.length) return null;

    return (
        <Breadcrumbs
            className={classes.breadcrumbs}
            separator={
                <Icon
                    path={iconChevronRight}
                    size="sm"
                />
            }
            fz="sm"
        >
            <Anchor
                href="/"
                c="dimmed"
                display="flex"
                aria-label="Home"
            >
                <Icon
                    path={iconHome}
                    size="md"
                />
            </Anchor>
            {trail.map((item, index) => {
                const isLast = index === trail.length - 1;

                if (isLast) {
                    return (
                        <Anchor
                            key={item.href}
                            href={item.href}
                            c="bright"
                            fz="md"
                            fw={500}
                            aria-current="page"
                        >
                            {item.label}
                        </Anchor>
                    );
                }

                return (
                    <Anchor
                        key={item.href}
                        href={item.href}
                        c="dimmed"
                        fz="md"
                    >
                        {item.label}
                    </Anchor>
                );
            })}
        </Breadcrumbs>
    );
}
