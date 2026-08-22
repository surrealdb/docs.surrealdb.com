import {
    ActionIcon,
    Anchor,
    Badge,
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
    ThemeIcon,
} from "@mantine/core";
import { Icon, iconChevronDown, iconOpen } from "@surrealdb/ui";
import { Fragment, useState } from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { usePageContext } from "vike-react/usePageContext";
import { SurrealDBLogo } from "~/components/Logo";
import { SearchDocs } from "~/components/SearchDocs";
import { ColorSchemeToggle } from "../ColorSchemeToggle";
import {
    flattenMenuItems,
    isMenuGroup,
    type NavEntry,
    type NavItem,
    type NavMenuBadge,
    type NavMenuGroup,
} from "./nav";
import { ProductList, ProductWordmark } from "./product-switcher";
import { getProductFromPath, PRODUCTS } from "./products";
import classes from "./style.module.scss";

export type {
    NavEntry,
    NavItem,
    NavMenuBadge,
    NavMenuGroup,
    NavMenuItem,
    NavMenuSection,
} from "./nav";

/**
 * Visible text per badge kind. Screen readers announce it alongside the item
 * label, so the pill stays meaningful when the styling is not perceivable.
 */
const NAV_BADGE_LABELS: Record<NavMenuBadge, string> = {
    new: "New",
};

function NavItemBadge({ badge }: { badge: NavMenuBadge }) {
    return (
        <Badge
            size="xs"
            variant="light"
            color="violet"
            className={classes.navItemBadge}
        >
            {NAV_BADGE_LABELS[badge]}
        </Badge>
    );
}

const HEADER_INSET = 32;

const SIGN_IN_URL =
    "https://app.surrealdb.com/signin?_gl=1*6c6cw1*FPAU*MjUyNzg4NDQ3LjE3NzA3MzU0OTI.*_ga*MTUwNTkxNTcyNS4xNzcwNzM1NDky*_ga_J1NWM32T1V*czE3NzE4NDcxMTMkbzQ2JGcxJHQxNzcxODQ3MjAwJGo1NiRsMCRoNjUwODcxODU5*_fplc*dEpHdFVZdTN2eEolMkJBWkNUY1R5NUhKbmJySSUyRk56eEN6ZHlEcU52cTJzbUV0dXpOcmZhSU5MeXZFdW90bFdPZWRpbE4yTzA1dmZ1MiUyRlc5RnM3djhEZ2NVeGZhdmoyNW1rcFFsSmhwUXJzR1BoR2ZIWUdsMXYyZ0tJSXFmOW93JTNEJTNE";

function normalizeHref(href: string) {
    return href.replace(/^\/docs/, "").replace(/\/$/, "") || "/";
}

function entryHrefs(entry: NavEntry): string[] {
    return isMenuGroup(entry) ? flattenMenuItems(entry).map((item) => item.href) : [entry.href];
}

/**
 * Resolves the single nav href that owns the current page.
 *
 * Each candidate href is matched against the current path and the most
 * specific (longest) match wins, so overlapping entries - e.g. a section
 * hub and one of its sub-pages - never both light up.
 *
 * The root entry (`/docs/`, normalising to `/`) is the "Start" catch-all:
 * its sub-pages are unprefixed (`/docs/architecture`, not `/docs/start/…`),
 * so prefix matching can't claim them. Instead it acts as the fallback for
 * any docs page no other entry owns.
 */
function useActiveHref(navLinks: NavEntry[]): string | null {
    const { urlPathname } = usePageContext();
    const pathname = normalizeHref(urlPathname);

    let activeHref: string | null = null;
    let activeLength = -1;

    for (const entry of navLinks) {
        for (const href of entryHrefs(entry)) {
            const normalized = normalizeHref(href);
            const matches =
                normalized === "/"
                    ? pathname === "/"
                    : pathname === normalized || pathname.startsWith(`${normalized}/`);

            if (matches && normalized.length > activeLength) {
                activeHref = href;
                activeLength = normalized.length;
            }
        }
    }

    if (activeHref) return activeHref;

    const root = navLinks.find(
        (entry): entry is NavItem => !isMenuGroup(entry) && normalizeHref(entry.href) === "/",
    );
    return root?.href ?? null;
}

function NavLink({ label, href, activeHref }: NavItem & { activeHref: string | null }) {
    const active = href === activeHref;

    return (
        <Anchor
            href={href}
            fz={14}
            py="sm"
            px="xs"
            fw={400}
            underline="never"
            className={classes.navLink}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
        >
            {label}
        </Anchor>
    );
}

function NavDropdown({
    label,
    sections,
    activeHref,
}: NavMenuGroup & { activeHref: string | null }) {
    const active = flattenMenuItems({ label, sections }).some((item) => item.href === activeHref);
    const [hover, setHover] = useState(false);

    return (
        <Menu
            opened={hover}
            onChange={setHover}
            shadow="lg"
            offset={18}
            position="bottom-start"
            withinPortal
            trigger="click-hover"
            transitionProps={{
                transition: "pop-top-left",
            }}
        >
            <Menu.Target>
                <Anchor
                    component="button"
                    fz={14}
                    py="sm"
                    px="xs"
                    fw={400}
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
                bdrs={4}
                className={classes.navDropdown}
            >
                <Flex className={classes.navSections}>
                    {sections.map((section) => {
                        const wide = section.items.length > 5;

                        return (
                            <Box
                                key={section.heading}
                                className={classes.navSection}
                                data-wide={wide || undefined}
                            >
                                {section.heading && (
                                    <Text
                                        component="div"
                                        className={classes.navSectionLabel}
                                        ff="monospace"
                                        fz="sm"
                                    >
                                        {section.heading}
                                    </Text>
                                )}
                                <Box
                                    className={classes.navSectionItems}
                                    data-wide={wide || undefined}
                                >
                                    {section.items.map((item) => {
                                        const itemActive = item.href === activeHref;
                                        return (
                                            <Menu.Item
                                                key={item.href}
                                                component="a"
                                                href={item.href}
                                                className={classes.navItem}
                                                data-active={itemActive || undefined}
                                                aria-current={itemActive ? "page" : undefined}
                                                leftSection={
                                                    <ThemeIcon
                                                        variant={itemActive ? "gradient" : "light"}
                                                    >
                                                        {/* The tint belongs to the
                                                            glyph, not the chip, so
                                                            every chip stays uniform.
                                                            The active gradient owns
                                                            its own glyph colour. */}
                                                        <Icon
                                                            path={item.icon}
                                                            size="lg"
                                                            color={
                                                                itemActive
                                                                    ? undefined
                                                                    : item.iconColor
                                                            }
                                                        />
                                                    </ThemeIcon>
                                                }
                                                rightSection={
                                                    item.external ? (
                                                        <Icon path={iconOpen} />
                                                    ) : undefined
                                                }
                                            >
                                                {/* `.mantine-Menu-itemLabel` stacks its children
                                                    in a column, so the badge needs its own row
                                                    to sit beside the label. */}
                                                <Group
                                                    gap="xs"
                                                    wrap="nowrap"
                                                >
                                                    <Text
                                                        component="span"
                                                        className={classes.navItemLabel}
                                                    >
                                                        {item.label}
                                                    </Text>
                                                    {item.badge && (
                                                        <NavItemBadge badge={item.badge} />
                                                    )}
                                                </Group>
                                                {item.description && (
                                                    <Text
                                                        component="span"
                                                        className={classes.navItemDescription}
                                                    >
                                                        {item.description}
                                                    </Text>
                                                )}
                                            </Menu.Item>
                                        );
                                    })}
                                </Box>
                            </Box>
                        );
                    })}
                </Flex>
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
    const activeHref = useActiveHref(navLinks);

    return (
        <Box
            component="header"
            aria-label="Main navigation"
            h="var(--docs-header-height)"
        >
            <Group
                align="center"
                h="100%"
                px={HEADER_INSET}
                gap="md"
            >
                {/* Width comes from the stylesheet so it can track the tree's
                    column; a `flex` prop here would render inline and win. */}
                <Group className={classes.headerIdentity}>
                    <Anchor
                        href="/"
                        aria-label="SurrealDB home"
                    >
                        <SurrealDBLogo
                            height={27}
                            className={classes.logo}
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
                    <ProductWordmark current={product.id} />
                </Group>
                <Group
                    component="ul"
                    align="center"
                    gap="lg"
                    visibleFrom="lg"
                    className={classes.navList}
                >
                    {navLinks.map((entry) => (
                        <Box
                            component="li"
                            key={entry.label}
                        >
                            {isMenuGroup(entry) ? (
                                <NavDropdown
                                    {...entry}
                                    activeHref={activeHref}
                                />
                            ) : (
                                <NavLink
                                    {...entry}
                                    activeHref={activeHref}
                                />
                            )}
                        </Box>
                    ))}
                </Group>
                <Group
                    flex={1}
                    justify="flex-end"
                    wrap="nowrap"
                >
                    <SearchDocs
                        w={220}
                        mb={0}
                        visibleFrom="sm"
                    />
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
    const activeHref = useActiveHref(navLinks);

    return (
        <Stack
            component="nav"
            gap="md"
            px="sm"
            py="sm"
        >
            {/* The header search only has room from `sm` up, so phones reach
                it from here instead. */}
            <SearchDocs
                mb={0}
                hiddenFrom="sm"
            />
            <ProductList current={product.id} />
            <Divider />
            <Stack gap="xs">
                {navLinks.map((entry, i) => {
                    const groupActive =
                        isMenuGroup(entry) &&
                        flattenMenuItems(entry).some((item) => item.href === activeHref);

                    return (
                        <Fragment key={entry.label}>
                            {i > 0 && <Divider />}
                            {isMenuGroup(entry) ? (
                                <MantineNavLink
                                    label={entry.label}
                                    childrenOffset={16}
                                    bdrs="xs"
                                    py="sm"
                                    active={groupActive}
                                    defaultOpened={groupActive}
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
                                                    label={
                                                        item.badge ? (
                                                            <Group
                                                                gap="xs"
                                                                wrap="nowrap"
                                                            >
                                                                {item.label}
                                                                <NavItemBadge badge={item.badge} />
                                                            </Group>
                                                        ) : (
                                                            item.label
                                                        )
                                                    }
                                                    description={item.description}
                                                    href={item.href}
                                                    component="a"
                                                    py="sm"
                                                    bdrs="xs"
                                                    active={item.href === activeHref}
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
                                    active={entry.href === activeHref}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </Stack>
        </Stack>
    );
}
