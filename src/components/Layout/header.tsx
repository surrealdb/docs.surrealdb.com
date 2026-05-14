// import { ThemedImage } from "~/components/Image";
import {
    ActionIcon,
    Anchor,
    Box,
    Burger,
    Button,
    Divider,
    Flex,
    Group,
    Loader,
    NavLink as MantineNavLink,
    Menu,
    Stack,
    Text,
} from "@mantine/core";
import {
    Icon,
    iconAPI,
    iconAuthKeyhole,
    iconAutoFix,
    iconBraces,
    iconChevronDown,
    iconChevronRight,
    iconCloud,
    iconFunction,
    iconProgressClock,
    iconQuery,
    iconRelation,
    iconRoutes,
    iconSandbox,
    iconServerSecure,
    iconSidekick,
    iconSpectron,
    iconSurrealist,
    iconTable,
    iconText,
    iconTransfer,
    iconVideo,
    iconWrench,
    ThemedImage,
} from "@surrealdb/ui";
import { Fragment, useState } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { usePageContext } from "vike-react/usePageContext";
import DocsDark from "~/assets/img/logo/dark/docs.svg";
import LogoDark from "~/assets/img/logo/dark/surrealdb.svg";
import DocsLight from "~/assets/img/logo/light/docs.svg";
import LogoLight from "~/assets/img/logo/light/surrealdb.svg";
import { ColorSchemeToggle } from "../ColorSchemeToggle";
import classes from "./style.module.scss";

const SIGN_IN_URL =
    "https://app.surrealdb.com/signin?_gl=1*6c6cw1*FPAU*MjUyNzg4NDQ3LjE3NzA3MzU0OTI.*_ga*MTUwNTkxNTcyNS4xNzcwNzM1NDky*_ga_J1NWM32T1V*czE3NzE4NDcxMTMkbzQ2JGcxJHQxNzcxODQ3MjAwJGo1NiRsMCRoNjUwODcxODU5*_fplc*dEpHdFVZdTN2eEolMkJBWkNUY1R5NUhKbmJySSUyRk56eEN6ZHlEcU52cTJzbUV0dXpOcmZhSU5MeXZFdW90bFdPZWRpbE4yTzA1dmZ1MiUyRlc5RnM3djhEZ2NVeGZhdmoyNW1rcFFsSmhwUXJzR1BoR2ZIWUdsMXYyZ0tJSXFmOW93JTNEJTNE";

export interface NavItem {
    label: string;
    href: string;
}

export interface NavMenuItem {
    label: string;
    href: string;
    description: string;
    icon: string;
}

export interface NavMenuSection {
    heading?: string;
    items: NavMenuItem[];
}

export interface NavMenuGroup {
    label: string;
    sections: NavMenuSection[];
}

export type NavEntry = NavItem | NavMenuGroup;

function isMenuGroup(entry: NavEntry): entry is NavMenuGroup {
    return "sections" in entry;
}

function flattenMenuItems(group: NavMenuGroup): NavMenuItem[] {
    return group.sections.flatMap((section) => section.items);
}

export const NAV_LINKS: NavEntry[] = [
    { label: "Start", href: "/docs/" },
    {
        label: "Learn",
        sections: [
            {
                heading: "Database",
                items: [
                    {
                        label: "Querying",
                        href: "/docs/learn/querying",
                        description: "SurrealQL and live result handling.",
                        icon: iconQuery,
                    },
                    {
                        label: "Schema management",
                        href: "/docs/learn/schema-management",
                        description: "Namespaces, tables, and indexes.",
                        icon: iconTable,
                    },
                    {
                        label: "Data models",
                        href: "/docs/learn/data-models",
                        description: "Documents, graphs, vectors, time series.",
                        icon: iconBraces,
                    },
                    {
                        label: "Security",
                        href: "/docs/learn/security",
                        description: "Authentication, scopes, and permissions.",
                        icon: iconAuthKeyhole,
                    },
                ],
            },
            {
                heading: "Extending",
                items: [
                    {
                        label: "Agent memory context",
                        href: "/docs/learn/context",
                        description: "LLM memory and tool context patterns.",
                        icon: iconSpectron,
                    },
                    {
                        label: "Extensions",
                        href: "/docs/learn/extensions",
                        description: "Functions, procedures, and plugins.",
                        icon: iconFunction, // TODO iconPuzzle
                    },
                ],
            },
        ],
    },
    {
        label: "Build",
        sections: [
            {
                heading: "Running",
                items: [
                    {
                        label: "Deployment",
                        href: "/docs/build/deployment",
                        description: "Cloud, edge, and on-premises.",
                        icon: iconRoutes,
                    },
                    {
                        label: "Embedding SurrealDB",
                        href: "/docs/build/embedding",
                        description: "Native and WebAssembly embedding.",
                        icon: iconSandbox,
                    },
                ],
            },
            {
                heading: "Ecosystem",
                items: [
                    {
                        label: "Migrating",
                        href: "/docs/build/migrating",
                        description: "Import data and schemas from elsewhere.",
                        icon: iconTransfer,
                    },
                    {
                        label: "Integrations",
                        href: "/docs/build/integrations",
                        description: "SDKs, frameworks, and connectors.",
                        icon: iconRelation,
                    },
                ],
            },
            {
                heading: "Intelligence",
                items: [
                    {
                        label: "AI agents",
                        href: "/docs/build/ai-agents",
                        description: "Design patterns for AI agents.",
                        icon: iconSidekick,
                    },
                ],
            },
        ],
    },
    {
        label: "Manage",
        sections: [
            {
                heading: "Hosting",
                items: [
                    {
                        label: "SurrealDB Cloud",
                        href: "/docs/manage/cloud",
                        description: "Hosted instances and Cloud console.",
                        icon: iconCloud,
                    },
                    {
                        label: "Self-hosted",
                        href: "/docs/manage/self-hosted",
                        description: "Clusters, backups, your infrastructure.",
                        icon: iconServerSecure,
                    },
                ],
            },
            {
                heading: "Operations",
                items: [
                    {
                        label: "Schema migration",
                        href: "/docs/manage/schema-migration",
                        description: "Promote schema updates safely.",
                        icon: iconProgressClock,
                    },
                ],
            },
        ],
    },
    {
        label: "Explore",
        sections: [
            {
                heading: "Tools",
                items: [
                    {
                        label: "Surrealist UI",
                        href: "/docs/explore/surrealist",
                        description: "Official SurrealDB IDE.",
                        icon: iconSurrealist,
                    },
                ],
            },
            {
                heading: "Guides and resources",
                items: [
                    // {
                    //     label: "ML models",
                    //     href: "/docs/explore/ml-models",
                    //     description: "Models inside SurrealDB.",
                    //     icon: iconModuleML,
                    // },
                    {
                        label: "Tutorials & demos",
                        href: "/docs/explore/tutorials",
                        description: "Hands-on walkthroughs and demos.",
                        icon: iconVideo,
                    },
                    {
                        label: "SurrealDB Labs",
                        href: "/docs/labs",
                        description: "Preview features and lab notes.",
                        icon: iconAutoFix,
                    },
                ],
            },
        ],
    },
    {
        label: "Reference",
        sections: [
            {
                items: [
                    {
                        label: "Query language",
                        href: "/docs/reference/query-language",
                        description: "Syntax, statements, and builtins.",
                        icon: iconText,
                    },
                    {
                        label: "CLI tools",
                        href: "/docs/reference/cli",
                        description: "CLI install, backup, and ops.",
                        icon: iconWrench,
                    },
                    {
                        label: "REST API",
                        href: "/docs/reference/rest-api",
                        description: "HTTP API for queries and admin.",
                        icon: iconAPI,
                    },
                ],
            },
        ],
    },
];

function normalizeHref(href: string) {
    return href.replace(/^\/docs/, "").replace(/\/$/, "") || "/";
}

function useIsNavActive(entry: NavEntry) {
    const { urlPathname } = usePageContext();
    const pathname = normalizeHref(urlPathname);

    if (isMenuGroup(entry)) {
        return flattenMenuItems(entry).some((item) => {
            const href = normalizeHref(item.href);
            return pathname === href || pathname.startsWith(`${href}/`);
        });
    }

    const href = normalizeHref(entry.href);
    return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ label, href }: NavItem) {
    const active = useIsNavActive({ label, href });

    return (
        <Anchor
            href={href}
            fz="sm"
            py="sm"
            px="xs"
            fw={500}
            underline="never"
            className={classes.navLink}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
        >
            {label}
        </Anchor>
    );
}

function NavDropdown({ label, sections }: NavMenuGroup) {
    const active = useIsNavActive({ label, sections });
    const [hover, setHover] = useState(false);

    return (
        <Menu
            opened={hover}
            onChange={setHover}
            shadow="lg"
            offset={4}
            width={250}
            position="bottom-start"
            withinPortal
            trigger="click-hover"
            transitionProps={{
                transition: "scale-y",
            }}
        >
            <Menu.Target>
                <Anchor
                    component="button"
                    fz="sm"
                    py="sm"
                    px="xs"
                    fw={500}
                    underline="never"
                    className={classes.navLink}
                    data-active={active || undefined}
                    aria-current={active ? "page" : undefined}
                    mod={{ hover, active }}
                >
                    <Flex
                        align="center"
                        gap={4}
                    >
                        {label}
                        <Icon
                            path={iconChevronDown}
                            size="xs"
                            className={classes.navLinkChevron}
                        />
                    </Flex>
                </Anchor>
            </Menu.Target>
            <Menu.Dropdown
                bdrs="xs"
                bg="obsidian.7"
            >
                {sections.map((section, sectionIndex) => (
                    <Fragment key={section.heading}>
                        {section.heading && (
                            <Menu.Label
                                className={classes.navLinkLabel}
                                mt={sectionIndex > 0 ? "lg" : undefined}
                            >
                                {section.heading}
                            </Menu.Label>
                        )}
                        {section.items.map((item) => (
                            <Menu.Item
                                key={item.href}
                                component="a"
                                href={item.href}
                                className={classes.navItem}
                                bdrs="xs"
                                p="sm"
                                color="slate"
                                leftSection={
                                    <Icon
                                        path={item.icon}
                                        className={classes.navItemIcon}
                                        opacity={1}
                                        size="lg"
                                    />
                                }
                                rightSection={
                                    <Icon
                                        path={iconChevronRight}
                                        opacity={0.2}
                                    />
                                }
                            >
                                {item.label}
                            </Menu.Item>
                        ))}
                    </Fragment>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}

export interface HeaderProps {
    opened?: boolean;
    onToggle?: () => void;
}

export function Header({ opened, onToggle }: HeaderProps) {
    return (
        <Box
            component="header"
            aria-label="Main navigation"
            h="56px"
        >
            <Group
                align="center"
                h="100%"
                px="lg"
                gap="md"
            >
                <Group flex={1}>
                    <Anchor href="/">
                        <ThemedImage
                            lightSrc={LogoLight}
                            darkSrc={LogoDark}
                            h={24}
                        />
                    </Anchor>
                    <Divider
                        orientation="vertical"
                        variant="solid"
                        size="xs"
                        h="24px"
                        mt="auto"
                        mb="auto"
                        color="obsidian.6"
                    />
                    <Anchor
                        display="flex"
                        href="/docs/"
                        underline="never"
                        aria-label="SurrealDB Docs home"
                    >
                        <ThemedImage
                            lightSrc={DocsLight}
                            darkSrc={DocsDark}
                            h={24}
                        />
                    </Anchor>
                </Group>
                <Group
                    component="ul"
                    align="center"
                    gap="lg"
                    visibleFrom="lg"
                    mx="auto"
                    className={classes.navList}
                >
                    {NAV_LINKS.map((entry) => (
                        <Box
                            component="li"
                            key={entry.label}
                        >
                            {isMenuGroup(entry) ? (
                                <NavDropdown {...entry} />
                            ) : (
                                <NavLink {...entry} />
                            )}
                        </Box>
                    ))}
                </Group>
                <Group
                    flex={{ md: 1 }}
                    justify="flex-end"
                >
                    <ClientOnly
                        fallback={
                            <ActionIcon aria-label="Toggle color scheme">
                                <Loader size="xs" />
                            </ActionIcon>
                        }
                    >
                        <ColorSchemeToggle />
                    </ClientOnly>
                    <Button
                        component="a"
                        href={SIGN_IN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        variant="gradient"
                        visibleFrom="sm"
                    >
                        Sign In
                    </Button>

                    <Burger
                        opened={opened}
                        onClick={onToggle}
                        hiddenFrom="lg"
                        size="sm"
                        aria-label="Toggle navigation"
                    />
                </Group>
            </Group>
        </Box>
    );
}

export function MobileNav() {
    return (
        <Stack
            component="nav"
            gap="xs"
            px="sm"
        >
            {NAV_LINKS.map((entry, i) => (
                <>
                    {i > 0 && <Divider />}
                    {isMenuGroup(entry) ? (
                        <MantineNavLink
                            key={entry.label}
                            label={entry.label}
                            childrenOffset={16}
                            bdrs="xs"
                            py="sm"
                        >
                            {entry.sections.map((section, sectionIndex) => (
                                <Fragment key={section.heading}>
                                    <Text
                                        component="div"
                                        className={classes.navLinkLabel}
                                        mt={sectionIndex > 0 ? "md" : undefined}
                                    >
                                        {section.heading}
                                    </Text>
                                    {section.items.map((item) => (
                                        <MantineNavLink
                                            key={item.href}
                                            label={item.label}
                                            href={item.href}
                                            component="a"
                                            py="sm"
                                            bdrs="xs"
                                            leftSection={
                                                <Icon
                                                    path={item.icon}
                                                    className={classes.navItemIcon}
                                                    opacity={1}
                                                    size="md"
                                                />
                                            }
                                        />
                                    ))}
                                </Fragment>
                            ))}
                        </MantineNavLink>
                    ) : (
                        <MantineNavLink
                            key={entry.href}
                            label={entry.label}
                            href={entry.href}
                            component="a"
                            bdrs="xs"
                            py="sm"
                        />
                    )}
                </>
            ))}
        </Stack>
    );
}
