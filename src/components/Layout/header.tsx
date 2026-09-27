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
    Image,
    Loader,
    NavLink as MantineNavLink,
    Stack,
    Text,
} from "@mantine/core";
import { Icon, iconChevronDown, iconOpen } from "@surrealdb/ui";
import {
    type CSSProperties,
    type FocusEvent,
    Fragment,
    type KeyboardEvent,
    type MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { ClientOnly } from "vike-react/ClientOnly";
import { usePageContext } from "vike-react/usePageContext";
import { SurrealDBLogo } from "~/components/Logo";
import { SearchDocs } from "~/components/SearchDocs";
import { ColorSchemeToggle, HEADER_CONTROL_SIZE } from "../ColorSchemeToggle";
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

/**
 * Menu timing, matched to www.surrealdb.com's `--duration-normal` and
 * `--cubic-default`. The panel's height carries the motion: it grows out of the
 * header on open and resizes between menus, so switching menus changes what is
 * in the panel without replaying its entrance. The columns slide in on a stagger
 * (`.nav-section` and `.nav-footer` in the stylesheet).
 */
const NAV_PANEL_DURATION = 450;
const NAV_PANEL_EASING = "cubic-bezier(0.525, 0, 0, 1)";

/** The first column's delay and the step between columns, as on the apex site. */
const NAV_FADE_DELAY = 180;
const NAV_FADE_STEP = 60;

const NAV_PANEL_ID = "docs-nav-panel";

/** Grace period for the pointer to cross from a label into the panel. */
const NAV_CLOSE_DELAY = 120;

const SIGN_IN_URL =
    "https://studio.surrealdb.com/signin?_gl=1*6c6cw1*FPAU*MjUyNzg4NDQ3LjE3NzA3MzU0OTI.*_ga*MTUwNTkxNTcyNS4xNzcwNzM1NDky*_ga_J1NWM32T1V*czE3NzE4NDcxMTMkbzQ2JGcxJHQxNzcxODQ3MjAwJGo1NiRsMCRoNjUwODcxODU5*_fplc*dEpHdFVZdTN2eEolMkJBWkNUY1R5NUhKbmJySSUyRk56eEN6ZHlEcU52cTJzbUV0dXpOcmZhSU5MeXZFdW90bFdPZWRpbE4yTzA1dmZ1MiUyRlc5RnM3djhEZ2NVeGZhdmoyNW1rcFFsSmhwUXJzR1BoR2ZIWUdsMXYyZ0tJSXFmOW93JTNEJTNE";

function normalizeHref(href: string) {
    return href.replace(/^\/docs/, "").replace(/\/$/, "") || "/";
}

function entryHrefs(entry: NavEntry): string[] {
    if (!isMenuGroup(entry)) return [entry.href];

    // The group's own hub page is a candidate alongside its children, or landing
    // on `/docs/learn` matches nothing, falls through to the `/docs` catch-all,
    // and highlights "Get started" instead. Children still win where both match,
    // because the resolver takes the longest.
    const hrefs = flattenMenuItems(entry).map((item) => item.href);

    return entry.href ? [entry.href, ...hrefs] : hrefs;
}

/**
 * Resolves the single nav href that owns the current page.
 *
 * Each candidate href is matched against the current path and the most
 * specific (longest) match wins, so overlapping entries - e.g. a section
 * hub and one of its sub-pages - never both light up.
 *
 * The root entry (`/docs/`, normalising to `/`) is the "Start" catch-all:
 * its sub-pages are unprefixed (`/docs/what-is-surrealdb`, not `/docs/start/…`),
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
            fz={15}
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

interface NavDropdownProps {
    group: NavMenuGroup;
    activeHref: string | null;
    open: boolean;
    panelId: string;
    onOpen: () => void;
    onClose: () => void;
}

function NavDropdown({ group, activeHref, open, panelId, onOpen, onClose }: NavDropdownProps) {
    const { label, href } = group;
    const active =
        href === activeHref || flattenMenuItems(group).some((item) => item.href === activeHref);

    // The menu opens on hover, so a click is free to mean what a click on a
    // navigation item normally means: go to the section. Without a hub page to
    // point at, the label stays a button that only opens the menu.
    const target = href ? { component: "a" as const, href } : { component: "button" as const };

    return (
        <Anchor
            {...target}
            fz={15}
            py="sm"
            px="xs"
            fw={400}
            underline="never"
            className={classes.navLink}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            aria-expanded={open}
            aria-controls={panelId}
            mod={{ hover: open, active }}
            onMouseEnter={onOpen}
            onFocus={onOpen}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                if (event.key === "Escape") onClose();

                // Arrow down moves into the panel, so the menu is reachable
                // without tabbing through every label first.
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    document.querySelector<HTMLElement>(`#${panelId} a`)?.focus();
                }
            }}
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
    );
}

interface NavPanelProps {
    group: NavMenuGroup | null;
    /** Distance from the viewport edge to the first nav label's text. */
    inset: number | null;
    activeHref: string | null;
    panelId: string;
    onClose: () => void;
}

/**
 * The one menu panel the header owns, laid out like the www.surrealdb.com
 * menus: a column per section under a small uppercase heading, text-only
 * items, and a row at the foot that leads to the section's hub page.
 *
 * There is a single panel for every menu rather than one per label, so moving
 * between labels swaps the columns and eases the height to fit, instead of
 * closing one panel and opening another from nothing.
 */
function NavPanel({ group, inset, activeHref, panelId, onClose }: NavPanelProps) {
    const innerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    // The last group stays rendered while the panel closes, so its contents
    // do not vanish before the height has eased back into the header.
    const [shown, setShown] = useState<NavMenuGroup | null>(group);
    if (group && group !== shown) setShown(group);

    useEffect(() => {
        const inner = innerRef.current;
        if (!inner) return;

        const observer = new ResizeObserver(() => setHeight(inner.offsetHeight));
        observer.observe(inner);
        return () => observer.disconnect();
    }, []);

    const open = group !== null;

    return (
        <Box
            id={panelId}
            className={classes.navDropdown}
            data-open={open || undefined}
            inert={!open}
            onClick={(event: MouseEvent<HTMLElement>) => {
                // A link in the panel navigates without a page load, so the
                // header stays mounted: close the menu and drop the link's
                // focus, or the panel would sit over the page it just opened.
                const link = (event.target as HTMLElement).closest("a");
                if (!link) return;
                link.blur();
                onClose();
            }}
            style={{
                height: open ? height : 0,
                transition: `height ${NAV_PANEL_DURATION}ms ${NAV_PANEL_EASING}`,
            }}
            onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
                if (event.key === "Escape") onClose();
            }}
        >
            <Box
                ref={innerRef}
                className={classes.navPanel}
                style={inset === null ? undefined : { paddingLeft: inset }}
            >
                {shown && (
                    // Keyed on the menu, so its columns slide in afresh when
                    // the pointer moves to another label.
                    <Fragment key={shown.label}>
                        <Box className={classes.navColumns}>
                            {shown.sections.map((section, index) => {
                                const wide = section.items.length > 5;

                                return (
                                    <Box
                                        key={section.heading}
                                        className={classes.navSection}
                                        data-wide={wide || undefined}
                                        style={
                                            {
                                                "--nav-fade-delay": `${NAV_FADE_DELAY + index * NAV_FADE_STEP}ms`,
                                            } as CSSProperties
                                        }
                                    >
                                        {section.heading && (
                                            <Text
                                                component="div"
                                                className={classes.navSectionLabel}
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
                                                    <Anchor
                                                        key={item.href}
                                                        href={item.href}
                                                        underline="never"
                                                        className={
                                                            item.image || item.icon
                                                                ? `${classes.navItem} ${classes.navItemWithIcon}`
                                                                : classes.navItem
                                                        }
                                                        data-active={itemActive || undefined}
                                                        aria-current={
                                                            itemActive ? "page" : undefined
                                                        }
                                                    >
                                                        {(item.image || item.icon) && (
                                                            <Box className={classes.navItemTile}>
                                                                {item.image ? (
                                                                    <Image
                                                                        src={item.image}
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <Icon
                                                                        path={item.icon as string}
                                                                        color={item.iconColor}
                                                                    />
                                                                )}
                                                            </Box>
                                                        )}
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
                                                            {item.external && (
                                                                <Icon
                                                                    path={iconOpen}
                                                                    size="sm"
                                                                    className={
                                                                        classes.navItemExternal
                                                                    }
                                                                />
                                                            )}
                                                        </Group>
                                                        {item.description && (
                                                            <Text
                                                                component="span"
                                                                className={
                                                                    classes.navItemDescription
                                                                }
                                                            >
                                                                {item.description}
                                                            </Text>
                                                        )}
                                                    </Anchor>
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                        {shown.href && (
                            <Box
                                className={classes.navFooter}
                                style={
                                    {
                                        "--nav-fade-delay": `${NAV_FADE_DELAY}ms`,
                                    } as CSSProperties
                                }
                            >
                                <Anchor
                                    href={shown.href}
                                    underline="never"
                                    className={classes.navItem}
                                >
                                    <Text
                                        component="span"
                                        className={classes.navItemLabel}
                                    >
                                        {shown.label} overview
                                    </Text>
                                </Anchor>
                            </Box>
                        )}
                    </Fragment>
                )}
            </Box>
        </Box>
    );
}

/**
 * Where the first nav label's text starts, measured rather than derived, so
 * the panel's columns line up under "Get started" at every width.
 */
function useNavInset() {
    const listRef = useRef<HTMLDivElement>(null);
    const [inset, setInset] = useState<number | null>(null);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const measure = () => {
            const label = list.querySelector("a");
            if (!label) return;
            const padding = Number.parseFloat(getComputedStyle(label).paddingLeft) || 0;
            setInset(label.getBoundingClientRect().left + padding);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(document.documentElement);
        return () => observer.disconnect();
    }, []);

    return { listRef, inset };
}

/**
 * Which menu is open, with a short grace period on close so the pointer can
 * cross the gap between a label and the panel.
 */
function useOpenMenu() {
    const [openLabel, setOpenLabel] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const cancel = useCallback(() => clearTimeout(timer.current), []);

    const open = useCallback(
        (label: string) => {
            cancel();
            setOpenLabel(label);
        },
        [cancel],
    );

    const close = useCallback(() => {
        cancel();
        setOpenLabel(null);
    }, [cancel]);

    const scheduleClose = useCallback(() => {
        cancel();
        timer.current = setTimeout(() => setOpenLabel(null), NAV_CLOSE_DELAY);
    }, [cancel]);

    useEffect(() => cancel, [cancel]);

    return { openLabel, open, close, scheduleClose, cancel };
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
    const menu = useOpenMenu();
    const nav = useNavInset();
    const { urlPathname } = usePageContext();

    // Any navigation closes the menu, including one started from a label.
    // biome-ignore lint/correctness/useExhaustiveDependencies: runs on each path change
    useEffect(() => {
        menu.close();
    }, [urlPathname, menu.close]);
    const openGroup =
        navLinks.find(
            (entry): entry is NavMenuGroup => isMenuGroup(entry) && entry.label === menu.openLabel,
        ) ?? null;

    return (
        <Box
            component="header"
            aria-label="Main navigation"
            h="var(--docs-header-height)"
            onMouseEnter={menu.cancel}
            onMouseLeave={menu.scheduleClose}
            onBlur={(event: FocusEvent<HTMLElement>) => {
                // Close once focus leaves the header and its panel entirely.
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    menu.close();
                }
            }}
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
                    ref={nav.listRef}
                >
                    {navLinks.map((entry) => (
                        <Box
                            component="li"
                            key={entry.label}
                        >
                            {isMenuGroup(entry) ? (
                                <NavDropdown
                                    group={entry}
                                    activeHref={activeHref}
                                    open={menu.openLabel === entry.label}
                                    panelId={NAV_PANEL_ID}
                                    onOpen={() => menu.open(entry.label)}
                                    onClose={menu.close}
                                />
                            ) : (
                                <Box onMouseEnter={menu.close}>
                                    <NavLink
                                        {...entry}
                                        activeHref={activeHref}
                                    />
                                </Box>
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
                            <ActionIcon
                                aria-label="Toggle color scheme"
                                size={HEADER_CONTROL_SIZE}
                            >
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
            <Box
                className={classes.navBackdrop}
                data-visible={openGroup !== null || undefined}
                aria-hidden
                onMouseEnter={menu.scheduleClose}
                onClick={menu.close}
            />
            <NavPanel
                group={openGroup}
                inset={nav.inset}
                activeHref={activeHref}
                panelId={NAV_PANEL_ID}
                onClose={menu.close}
            />
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
                        (entry.href === activeHref ||
                            flattenMenuItems(entry).some((item) => item.href === activeHref));

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
                                    {/* Tapping the group label expands it here
                                        rather than navigating, so the hub page
                                        the desktop label links to needs its own
                                        row to be reachable at all. */}
                                    {entry.href && (
                                        <MantineNavLink
                                            label={`${entry.label} overview`}
                                            href={entry.href}
                                            bdrs="xs"
                                            active={entry.href === activeHref}
                                        />
                                    )}
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
