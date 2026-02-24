import { SearchDocs } from "@components/SearchDocs";
import { SearchModal } from "@components/SearchModal";
import { Anchor, Box, Burger, Button, Flex, Menu, Text } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { Icon, iconChevronDown, Spacer } from "@surrealdb/ui";
import classes from "./style.module.scss";

export interface NavigationProps {
    opened?: boolean;
    onToggle?: () => void;
}

const SIGN_IN_URL =
    "https://app.surrealdb.com/signin?_gl=1*6c6cw1*FPAU*MjUyNzg4NDQ3LjE3NzA3MzU0OTI.*_ga*MTUwNTkxNTcyNS4xNzcwNzM1NDky*_ga_J1NWM32T1V*czE3NzE4NDcxMTMkbzQ2JGcxJHQxNzcxODQ3MjAwJGo1NiRsMCRoNjUwODcxODU5*_fplc*dEpHdFVZdTN2eEolMkJBWkNUY1R5NUhKbmJySSUyRk56eEN6ZHlEcU52cTJzbUV0dXpOcmZhSU5MeXZFdW90bFdPZWRpbE4yTzA1dmZ1MiUyRlc5RnM3djhEZ2NVeGZhdmoyNW1rcFFsSmhwUXJzR1BoR2ZIWUdsMXYyZ0tJSXFmOW93JTNEJTNE";

interface NavItem {
    label: string;
    href: string;
}

interface NavMenuGroup {
    label: string;
    items: NavItem[];
}

type NavEntry = NavItem | NavMenuGroup;

function isMenuGroup(entry: NavEntry): entry is NavMenuGroup {
    return "items" in entry;
}

const NAV_LINKS: NavEntry[] = [
    { label: "SurrealDB", href: "/docs/surrealdb/" },
    { label: "SurrealQL", href: "/docs/surrealql/" },
    { label: "Surrealist", href: "/docs/surrealist/" },
    { label: "Cloud", href: "/docs/cloud/" },
    { label: "Surrealism", href: "/docs/surrealml/" },
    {
        label: "SDKs",
        items: [
            { label: "JavaScript", href: "/docs/sdk/javascript/" },
            { label: "Python", href: "/docs/sdk/python/" },
            { label: "Rust", href: "/docs/sdk/rust/" },
            { label: "Go", href: "/docs/sdk/golang/" },
            { label: "Java", href: "/docs/sdk/java/" },
            { label: "PHP", href: "/docs/sdk/php/" },
            { label: ".NET", href: "/docs/sdk/dotnet/" },
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
            { label: "Tutorials", href: "/docs/tutorials/" },
            { label: "SurrealDB University", href: "/learn" },
        ],
    },
];

function NavLink({ label, href }: NavItem) {
    return (
        <Anchor
            href={href}
            c="white"
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
                    c="white"
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
                    >
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}

export function Navigation({ opened, onToggle }: NavigationProps) {
    const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);

    useHotkeys([["mod+/", openSearch]]);

    return (
        <Box
            component="nav"
            aria-label="Main navigation"
            h="100%"
        >
            <Flex
                align="center"
                h="100%"
                px="md"
                gap="xl"
            >
                <Anchor
                    display="flex"
                    href="/"
                    underline="never"
                    aria-label="SurrealDB Docs home"
                >
                    <Text
                        c="white"
                        fw={600}
                        fz="lg"
                    >
                        Docs
                    </Text>
                </Anchor>

                <Flex
                    component="ul"
                    align="center"
                    gap="xl"
                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                    visibleFrom="lg"
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

                <Spacer />

                <SearchDocs onOpen={openSearch} />

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
                    color="white"
                    aria-label="Toggle navigation"
                />
            </Flex>

            <SearchModal
                opened={searchOpened}
                onClose={closeSearch}
            />
        </Box>
    );
}
