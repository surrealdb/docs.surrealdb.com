import { Box, NavLink, ScrollArea, Stack, Text } from "@mantine/core";
import type { SidebarItem } from "@util/sidebar";
import { usePageContext } from "vike-react/usePageContext";
import classes from "./style.module.scss";

export interface NavbarProps {
    sidebar: SidebarItem[];
}

function isRouteActive(urlPathname: string, href: string) {
    return urlPathname === href || urlPathname.startsWith(`${href}/`);
}

function appendSlash(href: string) {
    return href.endsWith("/") ? href : `${href}/`;
}

function stripDocsPrefix(href: string) {
    return href.replace("/docs/", "/");
}

function SidebarNavLink({ item }: { item: SidebarItem }) {
    const { urlPathname } = usePageContext();
    const href = stripDocsPrefix(item.href);

    if (item.children?.length) {
        const expanded = isRouteActive(urlPathname, href);

        return (
            <NavLink
                label={item.label}
                href={appendSlash(item.href)}
                childrenOffset={16}
                defaultOpened={expanded}
                aria-expanded={expanded}
                bdrs={4}
                bg={expanded ? "obsidian.7" : "transparent"}
            >
                {item.children.map((child) => (
                    <SidebarNavLink
                        key={child.href}
                        item={child}
                    />
                ))}
            </NavLink>
        );
    }

    const active = appendSlash(urlPathname) === appendSlash(href);

    return (
        <NavLink
            label={item.label}
            href={item.href}
            variant={active ? "filled" : "subtle"}
            aria-current={active ? "page" : undefined}
            bdrs={4}
            bg={active ? "obsidian.7" : "transparent"}
        />
    );
}

function SidebarSection({ item }: { item: SidebarItem }) {
    return (
        <Box
            component="section"
            mt="lg"
        >
            <Text
                className={classes.sectionTitle}
                component="h3"
                tt="uppercase"
                fz="md"
                fw={700}
                mt="lg"
                mb="xs"
                px="sm"
                c="bright"
            >
                {item.label}
            </Text>
            {item.children?.map((child) => (
                <SidebarNavLink
                    key={child.href}
                    item={child}
                />
            ))}
        </Box>
    );
}

export function Navbar({ sidebar }: NavbarProps) {
    return (
        <ScrollArea
            p="sm"
            scrollbarSize={6}
        >
            <Stack gap={0}>
                {sidebar?.map((item) =>
                    item.children?.length ? (
                        <SidebarSection
                            key={item.href}
                            item={item}
                        />
                    ) : (
                        <SidebarNavLink
                            key={item.href}
                            item={item}
                        />
                    ),
                )}
            </Stack>
        </ScrollArea>
    );
}
