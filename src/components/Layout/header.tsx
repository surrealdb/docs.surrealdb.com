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
import { Icon, iconChevronDown, iconChevronRight, ThemedImage } from "@surrealdb/ui";
import { Fragment, useState } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { usePageContext } from "vike-react/usePageContext";
import { ColorSchemeToggle } from "../ColorSchemeToggle";
import {
    flattenMenuItems,
    isMenuGroup,
    type NavEntry,
    type NavItem,
    type NavMenuGroup,
} from "./nav";
import { ProductSwitcher, ProductSwitcherMobile } from "./product-switcher";
import {
    getProductFromPath,
    PRODUCTS,
    SURREALDB_LOGO_DARK,
    SURREALDB_LOGO_LIGHT,
} from "./products";
import classes from "./style.module.scss";

export type {
    NavEntry,
    NavItem,
    NavMenuGroup,
    NavMenuItem,
    NavMenuSection,
} from "./nav";

const SIGN_IN_URL =
    "https://app.surrealdb.com/signin?_gl=1*6c6cw1*FPAU*MjUyNzg4NDQ3LjE3NzA3MzU0OTI.*_ga*MTUwNTkxNTcyNS4xNzcwNzM1NDky*_ga_J1NWM32T1V*czE3NzE4NDcxMTMkbzQ2JGcxJHQxNzcxODQ3MjAwJGo1NiRsMCRoNjUwODcxODU5*_fplc*dEpHdFVZdTN2eEolMkJBWkNUY1R5NUhKbmJySSUyRk56eEN6ZHlEcU52cTJzbUV0dXpOcmZhSU5MeXZFdW90bFdPZWRpbE4yTzA1dmZ1MiUyRlc5RnM3djhEZ2NVeGZhdmoyNW1rcFFsSmhwUXJzR1BoR2ZIWUdsMXYyZ0tJSXFmOW93JTNEJTNE";

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

function useCurrentProduct() {
    const { urlPathname } = usePageContext();
    return PRODUCTS[getProductFromPath(urlPathname)];
}

export interface HeaderProps {
    navLinks: NavEntry[];
    opened?: boolean;
    onToggle?: () => void;
}

export function Header({ navLinks, opened, onToggle }: HeaderProps) {
    const product = useCurrentProduct();

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
                    <Anchor
                        href="/"
                        aria-label="SurrealDB home"
                    >
                        <ThemedImage
                            lightSrc={SURREALDB_LOGO_LIGHT}
                            darkSrc={SURREALDB_LOGO_DARK}
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
                    <ProductSwitcher current={product.id} />
                </Group>
                <Group
                    component="ul"
                    align="center"
                    gap="lg"
                    visibleFrom="lg"
                    mx="auto"
                    className={classes.navList}
                >
                    {navLinks.map((entry) => (
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

export interface MobileNavProps {
    navLinks: NavEntry[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
    const product = useCurrentProduct();

    return (
        <Stack
            component="nav"
            gap="md"
            px="sm"
            py="sm"
        >
            <ProductSwitcherMobile current={product.id} />
            <Divider />
            <Stack gap="xs">
                {navLinks.map((entry, i) => (
                    <Fragment key={entry.label}>
                        {i > 0 && <Divider />}
                        {isMenuGroup(entry) ? (
                            <MantineNavLink
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
                                label={entry.label}
                                href={entry.href}
                                component="a"
                                bdrs="xs"
                                py="sm"
                            />
                        )}
                    </Fragment>
                ))}
            </Stack>
        </Stack>
    );
}
