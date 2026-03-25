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
import {
    brandDotNet,
    brandGo,
    brandJava,
    brandJavaScript,
    brandPHP,
    brandPython,
    brandRust,
    clsx,
    Icon,
    iconChevronDown,
    pictoTutorials,
    pictoUniversity,
    ThemedImage,
} from "@surrealdb/ui";
import { ClientOnly } from "vike-react/ClientOnly";
import { usePageContext } from "vike-react/usePageContext";
import DocsDark from "~/assets/img/logo/dark/docs.svg";
import LogoDark from "~/assets/img/logo/dark/surrealdb.svg";
import DocsLight from "~/assets/img/logo/light/docs.svg";
import LogoLight from "~/assets/img/logo/light/surrealdb.svg";
import { ColorSchemeToggle } from "../ColorSchemeToggle";
import classes from "./style.module.scss";

export interface NavigationProps {
    opened?: boolean;
    onToggle?: () => void;
}

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
    { label: "SurrealDB", href: "/docs/surrealdb/" },
    { label: "SurrealQL", href: "/docs/surrealql/" },
    { label: "Surrealist", href: "/docs/surrealist/" },
    { label: "Cloud", href: "/docs/cloud/" },
    { label: "Extensions", href: "/docs/surrealdb/extensions" },
    {
        label: "SDKs",
        items: [
            {
                label: "JavaScript",
                href: "/docs/sdk/javascript/",
                icon: brandJavaScript,
            },
            { label: "Python", href: "/docs/sdk/python/", icon: brandPython },
            { label: "Rust", href: "/docs/sdk/rust/", icon: brandRust },
            { label: "Go", href: "/docs/sdk/golang/", icon: brandGo },
            { label: "Java", href: "/docs/sdk/java/", icon: brandJava },
            { label: "PHP", href: "/docs/sdk/php/", icon: brandPHP },
            { label: ".NET", href: "/docs/sdk/dotnet/", icon: brandDotNet },
        ],
    },
    { label: "Integrations", href: "/docs/integrations/" },
    { label: "Tutorials", href: "/docs/tutorials" },
    { label: "University", href: "/learn"},
    { label: "Labs", href: "/docs/labs/" },
];

function normalizeHref(href: string) {
    const stripped = href.replace(/^\/docs\//, "/");
    return stripped.endsWith("/") ? stripped.slice(0, -1) : stripped;
}

function useIsNavActive(entry: NavEntry) {
    const { urlPathname } = usePageContext();
    const pathname = urlPathname.endsWith("/") ? urlPathname.slice(0, -1) : urlPathname;

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
                    className={clsx(classes.navLink, active && classes.navLinkActive)}
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

export function Header({ opened, onToggle }: NavigationProps) {
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
