import DocsDark from "@assets/img/logo/dark/docs.svg";
import LogoDark from "@assets/img/logo/dark/surrealdb.svg";
import DocsLight from "@assets/img/logo/light/docs.svg";
import LogoLight from "@assets/img/logo/light/surrealdb.svg";
import {
    ActionIcon,
    Anchor,
    Box,
    Burger,
    Button,
    Divider,
    Flex,
    Image,
    NavLink as MantineNavLink,
    Menu,
    Stack,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";
import {
    brandDotNet,
    brandGo,
    brandJava,
    brandJavaScript,
    brandPHP,
    brandPython,
    brandRust,
    Icon,
    iconChevronDown,
    iconMoon,
    iconSun,
    pictoTutorials,
    pictoUniversity,
} from "@surrealdb/ui";
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
    { label: "Surrealism", href: "/docs/surrealml/" },
    {
        label: "SDKs",
        items: [
            { label: "JavaScript", href: "/docs/sdk/javascript/", icon: brandJavaScript },
            { label: "Python", href: "/docs/sdk/python/", icon: brandPython },
            { label: "Rust", href: "/docs/sdk/rust/", icon: brandRust },
            { label: "Go", href: "/docs/sdk/golang/", icon: brandGo },
            { label: "Java", href: "/docs/sdk/java/", icon: brandJava },
            { label: "PHP", href: "/docs/sdk/php/", icon: brandPHP },
            { label: ".NET", href: "/docs/sdk/dotnet/", icon: brandDotNet },
        ],
    },
    { label: "Integrations", href: "/docs/integrations/" },
    {
        label: "Examples",
        items: [
            { label: "Define a Schema", href: "/docs/tutorials/define-a-schema/" },
            { label: "Using GitHub Actions", href: "/docs/tutorials/using-github-actions/" },
            {
                label: "Integrate Auth0",
                href: "/docs/tutorials/integrate-auth0-as-authentication-provider/",
            },
            {
                label: "Integrate AWS Cognito",
                href: "/docs/tutorials/integrate-aws-cognito-as-authentication-provider/",
            },
            {
                label: "SurrealDB over HTTP via Postman",
                href: "/docs/tutorials/working-with-surrealdb-over-http-via-postman/",
            },
            {
                label: "Connect via Ngrok Tunnel",
                href: "/docs/tutorials/connect-to-surrealdb-via-ngrok-tunnel/",
            },
            {
                label: "Realtime Presence App",
                href: "/docs/tutorials/build-a-realtime-presence-web-application-using-surrealdb-live-queries/",
            },
        ],
    },
    {
        label: "Education",
        items: [
            { label: "Tutorials", href: "/docs/tutorials/", icon: pictoTutorials },
            { label: "SurrealDB University", href: "/learn", icon: pictoUniversity },
        ],
    },
];

function NavLink({ label, href }: NavItem) {
    return (
        <Anchor
            href={href}
            fz="sm"
            fw={500}
            underline="never"
            className={classes.navLink}
        >
            {label}
        </Anchor>
    );
}

function NavDropdown({ label, items }: NavMenuGroup) {
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
            <Menu.Dropdown>
                {items.map((item) => (
                    <Menu.Item
                        key={item.href}
                        component="a"
                        href={item.href}
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
    const { toggleColorScheme } = useMantineColorScheme();
    const colorScheme = useComputedColorScheme("dark");

    const isDark = colorScheme === "dark";
    const logo = isDark ? LogoDark : LogoLight;
    const docsLogo = isDark ? DocsDark : DocsLight;

    return (
        <Box
            component="header"
            aria-label="Main navigation"
            h="56px"
            px={1}
        >
            <Flex
                align="center"
                h="100%"
                px={{ base: "md", lg: "xl" }}
                gap="md"
            >
                <Anchor href="/">
                    <Image
                        src={logo}
                        alt="SurrealDB"
                        height={24}
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
                    <Image
                        src={docsLogo}
                        alt="SurrealDB Docs"
                        height={24}
                    />
                </Anchor>

                <Flex
                    component="ul"
                    align="center"
                    gap="xl"
                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                    visibleFrom="lg"
                    mx="auto"
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
                </Flex>

                <Box
                    flex={1}
                    hiddenFrom="lg"
                />

                <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={toggleColorScheme}
                    aria-label="Toggle color scheme"
                    color="gray"
                >
                    <Icon path={isDark ? iconSun : iconMoon} />
                </ActionIcon>

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
            </Flex>
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
