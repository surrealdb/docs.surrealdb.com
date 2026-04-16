import { Box, type BoxProps, Group, NavLink, Stack, Text } from "@mantine/core";
import { Icon } from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";
import { SearchDocs } from "~/components/SearchDocs";
import { SECTION_ICONS } from "~/utils/icons";
import type { NavLink as NavLinkItem, NavSection } from "~/utils/navigation";
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
                className={classes.navItem}
                label={link.title}
                href={`/docs${link.path}`}
                childrenOffset={16}
                opened={expanded}
                aria-expanded={expanded}
                aria-current={active ? "page" : undefined}
                active={active}
                variant="light"
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
            className={classes.navItem}
            label={link.title}
            href={`/docs${link.path}`}
            variant="light"
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
                className={classes.sidebarSectionHeader}
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
                    fw="bold"
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
    return (
        <Stack
            pt="xs"
            pb="sm"
            mah="calc(100vh - 56px - 1rem)"
            gap={0}
            {...props}
        >
            <Box px="lg">
                <SearchDocs />
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
                px="lg"
                flex={1}
                style={{ overflowY: "auto" }}
            >
                {navigation.map((section) => (
                    <SidebarSection
                        key={section.title}
                        section={section}
                    />
                ))}
            </Stack>
        </Stack>
    );
}
