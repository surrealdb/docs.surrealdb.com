import { Box, type BoxProps, Group, NavLink, Stack, Text } from "@mantine/core";
import {
    Icon,
    iconAlert,
    iconAPI,
    iconAuthKeyhole,
    iconBook,
    iconBraces,
    iconChart,
    iconCloud,
    iconCog,
    iconCombined,
    iconConsole,
    iconDatabase,
    iconDownload,
    iconFunction,
    iconHelp,
    iconHome,
    iconInfo,
    iconList,
    iconPlus,
    iconQuery,
    iconServer,
    iconTransfer,
} from "@surrealdb/ui";
import { usePageContext } from "vike-react/usePageContext";
import { SearchDocs } from "~/components/SearchDocs";
import type { SidebarItem } from "~/utils/sidebar";
import classes from "./style.module.scss";

export interface NavbarProps extends BoxProps {
    sidebar: SidebarItem[];
    versionSelector?: React.ReactNode;
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

    const active = appendSlash(urlPathname) === appendSlash(href);

    if (item.children?.length) {
        const expanded =
            appendSlash(urlPathname) === appendSlash(href) ||
            hasActiveDescendant(urlPathname, item.children);

        return (
            <NavLink
                className={classes.navItem}
                label={item.label}
                href={appendSlash(item.href)}
                childrenOffset={16}
                opened={expanded}
                aria-expanded={expanded}
                aria-current={active ? "page" : undefined}
                active={active}
                variant="light"
                py="xs"
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

    return (
        <NavLink
            className={classes.navItem}
            label={item.label}
            href={item.href}
            variant="light"
            aria-current={active ? "page" : undefined}
            active={active}
            py="xs"
        />
    );
}

const SECTION_ICONS: [string, string][] = [
    ["overview", iconHome],
    ["get started", iconHome],
    ["install", iconDownload],
    ["query", iconQuery],
    ["data model", iconDatabase],
    ["data management", iconDatabase],
    ["function", iconFunction],
    ["method", iconFunction],
    ["statement", iconList],
    ["clause", iconList],
    ["cli", iconConsole],
    ["serving", iconConsole],
    ["deploy", iconServer],
    ["embed", iconCombined],
    ["extension", iconPlus],
    ["security", iconAuthKeyhole],
    ["access", iconAPI],
    ["reference", iconBook],
    ["faq", iconHelp],
    ["migrat", iconTransfer],
    ["concept", iconInfo],
    ["api", iconAPI],
    ["framework", iconCombined],
    ["engine", iconCog],
    ["connect", iconCloud],
    ["operat", iconCog],
    ["billing", iconCog],
    ["support", iconHelp],
    ["tool", iconCog],
    ["monitor", iconChart],
    ["advanced", iconBook],
    ["tutorial", iconBook],
    ["integrat", iconCombined],
    ["error", iconAlert],
    ["type", iconBraces],
    ["value", iconBraces],
    ["core", iconBraces],
    ["utilit", iconCog],
    ["language", iconConsole],
];

function getSectionIcon(label: string): string {
    const lower = label.toLowerCase();
    for (const [key, icon] of SECTION_ICONS) {
        if (lower.includes(key)) return icon;
    }
    return iconBook;
}

function SidebarSection({ item }: { item: SidebarItem }) {
    return (
        <Box
            component="section"
            mt="lg"
        >
            <Group
                align="center"
                gap="sm"
                mt="lg"
                mb="sm"
                px="sm"
                c="slate.1"
            >
                <Icon
                    path={getSectionIcon(item.label)}
                    size="sm"
                />
                <Text
                    component="h3"
                    fz="md"
                    fw="bold"
                >
                    {item.label}
                </Text>
            </Group>
            <Stack gap="xs">
                {item.children?.map((child) => (
                    <SidebarNavLink
                        key={child.href}
                        item={child}
                    />
                ))}
            </Stack>
        </Box>
    );
}

export function Navbar({ sidebar, versionSelector, ...props }: NavbarProps) {
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
                gap={0}
                component="nav"
                px="lg"
                flex={1}
                style={{ overflowY: "auto" }}
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
        </Stack>
    );
}
