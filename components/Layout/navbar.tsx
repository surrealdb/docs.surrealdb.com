import { SearchDocs } from "@components/SearchDocs";
import { Box, type BoxProps, NavLink, Stack, Text } from "@mantine/core";
import type { SidebarItem } from "@util/sidebar";
import { usePageContext } from "vike-react/usePageContext";
import classes from "./style.module.scss";

export interface NavbarProps extends BoxProps {
    sidebar: SidebarItem[];
}

function appendSlash(href: string) {
    return href.endsWith("/") ? href : `${href}/`;
}

function stripDocsPrefix(href: string) {
    return href.replace("/docs/", "/");
}

function hasActiveDescendant(urlPathname: string, items: SidebarItem[]): boolean {
    for (const item of items) {
        const href = stripDocsPrefix(item.href);
        if (appendSlash(urlPathname) === appendSlash(href)) return true;
        if (item.children?.length && hasActiveDescendant(urlPathname, item.children)) return true;
    }
    return false;
}

function SidebarNavLink({ item }: { item: SidebarItem }) {
    const { urlPathname } = usePageContext();
    const href = stripDocsPrefix(item.href);

    if (item.children?.length) {
        const expanded =
            appendSlash(urlPathname) === appendSlash(href) ||
            hasActiveDescendant(urlPathname, item.children);

        return (
            <NavLink
                label={item.label}
                href={appendSlash(item.href)}
                childrenOffset={16}
                opened={expanded}
                aria-expanded={expanded}
                bdrs={4}
                bg={expanded ? "rgba(from var(--surreal-color-primary) r g b / 0.2" : "transparent"}
                styles={{ label: { color: expanded ? "var(--surreal-color-primary)" : undefined } }}
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
            bg={active ? "rgba(from var(--surreal-color-primary) r g b / 0.2" : "transparent"}
            styles={{ label: { color: active ? "var(--surreal-color-primary)" : undefined } }}
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

export function Navbar({ sidebar, ...props }: NavbarProps) {
    return (
        <Box
            pt="xs"
            pb="sm"
            {...props}
        >
            <Box px="lg">
                <SearchDocs />
            </Box>
            <Stack
                gap={0}
                component="nav"
                px="lg"
            >
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
        </Box>
    );
}
