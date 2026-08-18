import { Box, type BoxProps, Group, NavLink, Stack, Text } from "@mantine/core";
import { Icon } from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";
import { SECTION_ICONS } from "~/utils/icons";
import type { NavLink as NavLinkItem, NavSection } from "~/utils/navigation";
import { ProductSwitcherSegmented } from "./product-switcher";
import { getProductFromPath } from "./products";
import classes from "./style.module.scss";

function normalize(href: string) {
    return href.replace(/\/$/, "");
}

function hasActiveDescendant(urlPathname: string, links: NavLinkItem[]): boolean {
    const pathname = normalize(urlPathname);

    for (const link of links) {
        if (pathname === normalize(link.path)) return true;
        if (link.children?.length && hasActiveDescendant(urlPathname, link.children)) return true;
    }

    return false;
}

function SidebarNavLink({ link }: { link: NavLinkItem }) {
    const { urlPathname } = usePageContext();
    const active = normalize(urlPathname) === normalize(link.path);

    if (link.children?.length) {
        const expanded = active || hasActiveDescendant(urlPathname, link.children);

        return (
            <NavLink
                className={classes.sidebarNavLink}
                label={link.title}
                href={`/docs${link.path}`}
                childrenOffset={16}
                opened={expanded}
                aria-expanded={expanded}
                aria-current={active ? "page" : undefined}
                active={active}
                py="xs"
            >
                {link.children.map((child) => (
                    <SidebarNavLink
                        key={child.path}
                        link={child}
                    />
                ))}
            </NavLink>
        );
    }

    return (
        <NavLink
            className={classes.sidebarNavLink}
            label={link.title}
            href={`/docs${link.path}`}
            aria-current={active ? "page" : undefined}
            active={active}
            py="xs"
        />
    );
}

function SidebarSection({ section }: { section: NavSection }) {
    const icon = section.icon && SECTION_ICONS.get(section.icon);

    return (
        <Box component="section">
            <Group
                align="center"
                gap="sm"
                mt="lg"
                mb="sm"
                px="sm"
            >
                {icon && (
                    <Icon
                        path={icon}
                        size="sm"
                    />
                )}
                <Text
                    component="h3"
                    fz="md"
                    fw={600}
                >
                    {section.title}
                </Text>
            </Group>
            <Stack gap="xs">
                {section.links.map((link) => (
                    <SidebarNavLink
                        key={link.path}
                        link={link}
                    />
                ))}
            </Stack>
        </Box>
    );
}

export interface SidebarProps extends BoxProps {
    navigation: NavSection[];
    versionSelector?: React.ReactNode;
}

export function Sidebar({ navigation, versionSelector, ...props }: SidebarProps) {
    const { urlPathname } = usePageContext();
    const product = getProductFromPath(urlPathname);

    return (
        <Stack
            pb="sm"
            mah="calc(100vh - 56px)"
            gap={0}
            {...props}
        >
            {/* One scroll container for the whole sidebar, so the product switcher
                and version selector travel with the tree rather than staying pinned
                above it. The `nav` landmark stays on the tree alone — the switcher
                is a control, not navigation within this product's docs. */}
            <Stack
                gap={0}
                flex={1}
                style={{ overflowY: "auto" }}
            >
                <Box
                    px="lg"
                    mb="md"
                >
                    <ProductSwitcherSegmented current={product} />
                </Box>
                {versionSelector && (
                    <Box
                        px="lg"
                        mt="sm"
                        mb="xl"
                    >
                        {versionSelector}
                    </Box>
                )}
                <Stack
                    gap="lg"
                    component="nav"
                    px="md"
                >
                    {navigation.map((section) => (
                        <SidebarSection
                            key={section.title}
                            section={section}
                        />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
}
