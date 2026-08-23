import { Box, type BoxProps, Group, NavLink, Stack, Text } from "@mantine/core";
import { Icon } from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";
import { SECTION_ICONS } from "~/utils/icons";
import type { NavLink as NavLinkItem, NavSection } from "~/utils/navigation";
import { ProductSwitcherSegmented } from "./product-switcher";
import { getProductFromPath } from "./products";
import classes from "./style.module.scss";

/**
 * Left inset shared by every sidebar block. The nav links add their own 8px
 * on top, so the label sits just inside the blocks above it rather than
 * flush with them.
 */
export const SIDEBAR_INSET = 24;

export interface SidebarPaneProps extends BoxProps {
    children: React.ReactNode;
}

/**
 * Scrollable column for a shell rail. One scroll container for the whole
 * pane, so anything above the listing travels with it rather than staying
 * pinned. Shared by the docs tree and the labs filter rail so both panes
 * scroll and fade identically.
 */
export function SidebarPane({ children, ...props }: SidebarPaneProps) {
    return (
        <Stack
            pb="sm"
            gap={0}
            {...props}
        >
            <Stack
                gap={0}
                flex={1}
                className={classes.sidebarScroll}
            >
                {children}
            </Stack>
        </Stack>
    );
}

export interface SidebarSectionHeadingProps {
    icon?: string;
    children: React.ReactNode;
}

/** Heading row for a sidebar section, shared with the labs filter rail. */
export function SidebarSectionHeading({ icon, children }: SidebarSectionHeadingProps) {
    return (
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
                fz={15}
                fw={600}
            >
                {children}
            </Text>
        </Group>
    );
}

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
    const icon = section.icon ? SECTION_ICONS.get(section.icon) : undefined;

    return (
        <Box component="section">
            <SidebarSectionHeading icon={icon}>{section.title}</SidebarSectionHeading>
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
        <SidebarPane {...props}>
            {/* The `nav` landmark stays on the tree alone - the switcher is a
                control, not navigation within this product's docs. */}
            <Box
                px={SIDEBAR_INSET}
                mb="md"
            >
                <ProductSwitcherSegmented current={product} />
            </Box>
            {versionSelector && (
                <Box
                    px={SIDEBAR_INSET}
                    mt="sm"
                    mb="xl"
                >
                    {versionSelector}
                </Box>
            )}
            <Stack
                gap="lg"
                component="nav"
                px={SIDEBAR_INSET}
            >
                {navigation.map((section) => (
                    <SidebarSection
                        key={section.title}
                        section={section}
                    />
                ))}
            </Stack>
        </SidebarPane>
    );
}
