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
    Image,
    Loader,
    NavLink as MantineNavLink,
    Menu,
    Stack,
} from "@mantine/core";
import { Icon, iconChevronDown, ThemedImage } from "@surrealdb/ui";
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
    icon?: string;
}

export interface NavMenuGroup {
    label: string;
    items: NavItem[];
}

export type NavEntry = NavItem | NavMenuGroup;

function isMenuGroup(entry: NavEntry): entry is NavMenuGroup {
    return "items" in entry;
}

export const NAV_LINKS: NavEntry[] = [
    { label: "Home", href: "/docs/" },
    { label: "Start", href: "/docs/start" },
    {
        label: "Learn",
        items: [
            { label: "Querying", href: "/docs/learn/querying" },
            { label: "Schema Management", href: "/docs/learn/schema-management" },
            { label: "Data Models", href: "/docs/learn/data-models" },
            { label: "Security", href: "/docs/learn/security" },
            { label: "Extensions", href: "/docs/learn/extensions" },
        ],
    },
    {
        label: "Build",
        items: [
            { label: "Deployment", href: "/docs/build/deployment" },
            { label: "Migrating", href: "/docs/build/migrating" },
            { label: "Embedding", href: "/docs/build/embedding" },
            { label: "AI Agents", href: "/docs/build/ai-agents" },
            { label: "Integrations", href: "/docs/build/integrations" },
        ],
    },
    {
        label: "Manage",
        items: [
            { label: "SurrealDB Cloud", href: "/docs/manage/cloud" },
            { label: "Self-hosted", href: "/docs/manage/self-hosted" },
            { label: "Enterprise Edition", href: "/docs/manage/enterprise" },
        ],
    },
    {
        label: "Explore",
        items: [
            { label: "Surrealist UI", href: "/docs/explore/surrealist" },
            { label: "ML Models", href: "/docs/explore/ml-models" },
            { label: "Tutorials & Demos", href: "/docs/explore/tutorials" },
        ],
    },
    {
        label: "Reference",
        items: [
            { label: "Query Language", href: "/docs/reference/query-language" },
            { label: "CLI Tools", href: "/docs/reference/cli" },
            { label: "REST API", href: "/docs/reference/rest-api" },
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
        return entry.items.some((item) => {
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

function NavDropdown({ label, items }: NavMenuGroup) {
    const active = useIsNavActive({ label, items });

    return (
        <Menu
            shadow="md"
            width={220}
            position="bottom-start"
            withinPortal
            trigger="click-hover"
        >
            <Menu.Target>
                <Anchor
                    component="button"
                    fz="sm"
                    fw={500}
                    underline="never"
                    className={classes.navLink}
                    data-active={active || undefined}
                    aria-current={active ? "page" : undefined}
                >
                    <Flex
                        align="center"
                        gap={4}
                    >
                        {label}
                        <Icon
                            path={iconChevronDown}
                            size="xs"
                        />
                    </Flex>
                </Anchor>
            </Menu.Target>
            <Menu.Dropdown bdrs="xs">
                {items.map((item) => (
                    <Menu.Item
                        key={item.href}
                        component="a"
                        href={item.href}
                        bdrs="xs"
                        p="sm"
                        leftSection={
                            item.icon ? (
                                <Image
                                    src={item.icon}
                                    w={20}
                                    h={20}
                                    fit="contain"
                                />
                            ) : undefined
                        }
                    >
                        {item.label}
                    </Menu.Item>
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
                    gap="xl"
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
            gap={0}
            px="sm"
        >
            {NAV_LINKS.map((entry) =>
                isMenuGroup(entry) ? (
                    <MantineNavLink
                        key={entry.label}
                        label={entry.label}
                        childrenOffset={16}
                    >
                        {entry.items.map((item) => (
                            <MantineNavLink
                                key={item.href}
                                label={item.label}
                                href={item.href}
                                component="a"
                                leftSection={
                                    item.icon ? (
                                        <Image
                                            src={item.icon}
                                            w={20}
                                            h={20}
                                            fit="contain"
                                        />
                                    ) : undefined
                                }
                            />
                        ))}
                    </MantineNavLink>
                ) : (
                    <MantineNavLink
                        key={entry.href}
                        label={entry.label}
                        href={entry.href}
                        component="a"
                    />
                ),
            )}
        </Stack>
    );
}
