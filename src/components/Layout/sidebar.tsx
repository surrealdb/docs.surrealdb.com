import {
    ActionIcon,
    Anchor,
    Box,
    type BoxProps,
    Collapse,
    Group,
    NavLink,
    Stack,
    Text,
} from "@mantine/core";
import { useReducedMotion } from "@mantine/hooks";
import { Icon, iconChevronDown } from "@surrealdb/ui";
import { useEffect, useId, useRef, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import {
    docsHref,
    type NavGroup,
    type NavLink as NavLinkItem,
    type NavSection,
} from "~/utils/navigation";
import { ProductSwitcherSegmented } from "./product-switcher";
import { getProductFromPath } from "./products";
import classes from "./style.module.scss";

/**
 * Left inset shared by every sidebar block. The nav links add their own 8px
 * on top, so the label sits just inside the blocks above it rather than
 * flush with them.
 */
export const SIDEBAR_INSET = 24;

export interface SidebarPaneProps extends BoxProps {
    children: React.ReactNode;
    /** Stays above the scrolling listing, so it is in view wherever the listing is scrolled to. */
    header?: React.ReactNode;
}

/**
 * Scrollable column for a shell rail. The listing is the one scroll container,
 * and anything given as the `header` stays pinned above it. Shared by the docs
 * tree and the labs filter rail so both panes scroll and fade identically.
 */
export function SidebarPane({ children, header, ...props }: SidebarPaneProps) {
    return (
        <Stack
            pb="sm"
            gap={0}
            {...props}
        >
            {header}
            <Stack
                gap={0}
                flex={1}
                className={classes.sidebarScroll}
                data-sidebar-scroll
            >
                {children}
            </Stack>
        </Stack>
    );
}

export interface SidebarSectionHeadingProps {
    children: React.ReactNode;
    /**
     * Sets the heading as a small uppercase eyebrow, the treatment of the nav
     * dropdowns' section labels, rather than a 16px title. The labs filter
     * rail uses it.
     */
    eyebrow?: boolean;
    /** Makes the heading a link, to the page the section opens with. */
    href?: string;
    /** Whether the reader is on the page `href` names. */
    active?: boolean;
    /** A control at the end of the row, such as the button that opens a group. */
    trailing?: React.ReactNode;
    /** Closes up the space around the row, for a list of group headings. */
    compact?: boolean;
    /** Sets the title smaller, for a heading inside a group. */
    small?: boolean;
}

/**
 * Heading row for a sidebar section, shared with the labs filter rail. Text
 * only: the section headings carry no icons.
 */
export function SidebarSectionHeading({
    children,
    eyebrow = false,
    href,
    active = false,
    trailing,
    compact = false,
    small = false,
}: SidebarSectionHeadingProps) {
    const label = href ? (
        <Anchor
            className={classes.sidebarHeadingLink}
            href={href}
            aria-current={active ? "page" : undefined}
            data-active={active || undefined}
            underline="never"
            inherit
        >
            {children}
        </Anchor>
    ) : (
        children
    );

    return (
        <Group
            align="center"
            gap="sm"
            mt={compact ? 0 : "lg"}
            mb={compact ? 4 : "sm"}
            px="sm"
            wrap="nowrap"
        >
            {eyebrow ? (
                <Text
                    component="h3"
                    className={classes.navSectionLabel}
                    flex={1}
                >
                    {label}
                </Text>
            ) : (
                <Text
                    component="h3"
                    fz={small ? 14 : 16}
                    fw={500}
                    flex={1}
                >
                    {label}
                </Text>
            )}
            {trailing}
        </Group>
    );
}

function normalize(href: string) {
    return href.replace(/\/$/, "");
}

function hasActiveDescendant(urlPathname: string, links: NavLinkItem[]): boolean {
    const pathname = normalize(urlPathname);

    for (const link of links) {
        if (pathname === normalize(link.path)) return true;
        if (link.children?.length && hasActiveDescendant(urlPathname, link.children)) return true;
    }

    return false;
}

function SidebarNavLink({ link }: { link: NavLinkItem }) {
    const { urlPathname } = usePageContext();
    const active = normalize(urlPathname) === normalize(link.path);

    if (link.children?.length) {
        const expanded = active || hasActiveDescendant(urlPathname, link.children);

        return (
            <NavLink
                className={classes.sidebarNavLink}
                label={link.title}
                href={docsHref(link.path)}
                childrenOffset={16}
                opened={expanded}
                aria-expanded={expanded}
                aria-current={active ? "page" : undefined}
                active={active}
                py="xs"
            >
                {link.children.map((child) => (
                    <SidebarNavLink
                        key={child.path}
                        link={child}
                    />
                ))}
            </NavLink>
        );
    }

    return (
        <NavLink
            className={classes.sidebarNavLink}
            label={link.title}
            href={docsHref(link.path)}
            aria-current={active ? "page" : undefined}
            active={active}
            py="xs"
        />
    );
}

export function SidebarSection({ section }: { section: NavSection }) {
    const { urlPathname } = usePageContext();
    const { landing } = section;
    // Every heading opens its section. When the first page repeats the heading
    // it has no row of its own, so the heading carries that page's current
    // state; otherwise the row below already does.
    const target = landing ?? section.links[0];

    return (
        <Box component="section">
            <SidebarSectionHeading
                href={target ? docsHref(target.path) : undefined}
                active={landing ? normalize(urlPathname) === normalize(landing.path) : false}
            >
                {section.title}
            </SidebarSectionHeading>
            <Stack gap="xs">
                {section.links.map((link) => (
                    <SidebarNavLink
                        key={link.path}
                        link={link}
                    />
                ))}
            </Stack>
        </Box>
    );
}

/** The rows that a group shows when it is open: its pages and its parts. */
function groupRows(group: NavGroup): number {
    return group.links.length + group.sections.length;
}

function sectionContains(section: NavSection, urlPathname: string): boolean {
    return (
        (section.landing !== undefined &&
            normalize(urlPathname) === normalize(section.landing.path)) ||
        hasActiveDescendant(urlPathname, section.links)
    );
}

function groupContains(group: NavGroup, urlPathname: string): boolean {
    return (
        normalize(urlPathname) === normalize(group.path) ||
        (group.landing !== undefined && normalize(urlPathname) === normalize(group.landing.path)) ||
        hasActiveDescendant(urlPathname, group.links) ||
        group.sections.some((section) => sectionContains(section, urlPathname))
    );
}

/** The most rows that a group can have and still open by itself as the place to start. */
const START_OPEN_MAX_ROWS = 12;

interface SidebarDisclosureProps {
    title: string;
    /** The page the heading links to. */
    href: string;
    /** Whether the reader is on the page the heading is. */
    active: boolean;
    /** Whether the current page is inside, which opens it. */
    current: boolean;
    /** Opens it while no group holds the current page, as the place to start. */
    start?: boolean;
    /** Sets it as a part of a group, with a smaller heading and no rail. */
    small?: boolean;
    children: React.ReactNode;
}

/**
 * A heading that links to a page, with a button that opens or closes the pages
 * under it in place. It is open when the current page is inside it, and stays
 * open once the reader has opened it. The pages of a closed one are not
 * rendered, so a section with hundreds of pages sends the links of the open
 * parts only: they are mounted before it opens, and removed once it has closed.
 */
function SidebarDisclosure({
    title,
    href,
    active,
    current,
    start = false,
    small = false,
    children,
}: SidebarDisclosureProps) {
    const [opened, setOpened] = useState(current || start);
    const [mounted, setMounted] = useState(current || start);
    const touched = useRef(false);
    const bodyId = useId();
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (current) {
            setMounted(true);
            setOpened(true);
        }
    }, [current]);

    // The place to start closes again once the reader is elsewhere, unless the
    // reader opened it.
    useEffect(() => {
        if (!start && !current && !touched.current) setOpened(false);
    }, [start, current]);

    function toggle() {
        touched.current = true;
        if (!opened) setMounted(true);
        setOpened((value) => !value);
    }

    return (
        <Box component="section">
            <SidebarSectionHeading
                compact
                small={small}
                href={href}
                active={active}
                trailing={
                    <ActionIcon
                        variant="transparent"
                        className={classes.sidebarToggle}
                        size="sm"
                        onClick={toggle}
                        aria-expanded={opened}
                        aria-controls={bodyId}
                        aria-label={`${opened ? "Close" : "Open"} ${title}`}
                    >
                        <Icon
                            path={iconChevronDown}
                            size="sm"
                            className={classes.sidebarChevron}
                            data-open={opened || undefined}
                        />
                    </ActionIcon>
                }
            >
                {title}
            </SidebarSectionHeading>
            <Collapse
                expanded={opened}
                id={bodyId}
                transitionDuration={reducedMotion ? 0 : 250}
                transitionTimingFunction="cubic-bezier(0.16, 1, 0.3, 1)"
                onTransitionEnd={() => {
                    if (!opened) setMounted(false);
                }}
            >
                {mounted && (
                    <Stack
                        gap="xs"
                        className={small ? classes.sidebarSubgroupBody : classes.sidebarGroupBody}
                    >
                        {children}
                    </Stack>
                )}
            </Collapse>
        </Box>
    );
}

/** A page that stands as a heading, at the level of the groups, with nothing to open. */
function SidebarLeaf({
    title,
    path,
    small = false,
}: {
    title: string;
    path: string;
    small?: boolean;
}) {
    const { urlPathname } = usePageContext();

    return (
        <SidebarSectionHeading
            compact
            small={small}
            href={docsHref(path)}
            active={normalize(urlPathname) === normalize(path)}
        >
            {title}
        </SidebarSectionHeading>
    );
}

/**
 * One collection of a section: a heading and its pages, and under them the
 * parts that the collection groups its pages into, each one closed until it
 * holds the current page.
 */
function SidebarGroup({ group, start = false }: { group: NavGroup; start?: boolean }) {
    const { urlPathname } = usePageContext();
    // With no part holding the current page, the first part is the place to start.
    const startPart = group.sections.some((section) => sectionContains(section, urlPathname))
        ? -1
        : 0;

    if (group.links.length === 0 && group.sections.length === 0) {
        return (
            <SidebarLeaf
                title={group.title}
                path={group.landing?.path ?? group.path}
            />
        );
    }

    return (
        <SidebarDisclosure
            title={group.title}
            href={docsHref(group.path)}
            active={
                group.landing ? normalize(urlPathname) === normalize(group.landing.path) : false
            }
            current={groupContains(group, urlPathname)}
            start={start}
        >
            {group.links.map((link) => (
                <SidebarNavLink
                    key={link.path}
                    link={link}
                />
            ))}
            {group.sections.map((section, index) => {
                const target = section.landing ?? section.links[0];

                // A part with only a landing page has nothing to open, so it is a row.
                // A part of one other page still opens, so it keeps its place when more
                // pages join it and its row is not named after a page it does not match.
                if (section.links.length === 0 && section.landing) {
                    return (
                        <SidebarLeaf
                            key={section.title}
                            small
                            title={section.title}
                            path={section.landing.path}
                        />
                    );
                }

                return (
                    <SidebarDisclosure
                        key={section.title}
                        small
                        title={section.title}
                        href={target ? docsHref(target.path) : docsHref(group.path)}
                        active={
                            section.landing
                                ? normalize(urlPathname) === normalize(section.landing.path)
                                : false
                        }
                        current={sectionContains(section, urlPathname)}
                        start={index === startPart && section.links.length <= START_OPEN_MAX_ROWS}
                    >
                        {section.links.map((link) => (
                            <SidebarNavLink
                                key={link.path}
                                link={link}
                            />
                        ))}
                    </SidebarDisclosure>
                );
            })}
        </SidebarDisclosure>
    );
}

/**
 * Brings the current page into view in the scrolling listing, so a reader who
 * arrives from a link sees where they are among the pages around it. The page
 * itself does not move.
 */
function useRevealCurrentPage(urlPathname: string) {
    const nav = useRef<HTMLDivElement>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: runs again for each page
    useEffect(() => {
        const current = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
        const scroller = nav.current?.closest<HTMLElement>("[data-sidebar-scroll]");

        if (!current || !scroller) return;

        const view = scroller.getBoundingClientRect();
        const item = current.getBoundingClientRect();

        if (item.top >= view.top && item.bottom <= view.bottom) return;

        scroller.scrollTop += item.top - view.top - view.height / 2 + item.height / 2;
    }, [urlPathname]);

    return nav;
}

export interface SidebarProps extends BoxProps {
    navigation: NavSection[];
    /** The whole section's sidebar, as groups. It is shown instead of `navigation` when given. */
    groups?: NavGroup[];
    versionSelector?: React.ReactNode;
}

export function Sidebar({ navigation, groups, versionSelector, ...props }: SidebarProps) {
    const { urlPathname } = usePageContext();
    const product = getProductFromPath(urlPathname);
    const nav = useRevealCurrentPage(urlPathname);
    // With no group holding the current page, as on a hub page, the first group
    // is the place to start.
    const startGroup = groups?.some((group) => groupContains(group, urlPathname)) ? -1 : 0;

    return (
        <SidebarPane
            {...props}
            header={
                <>
                    {/* The product switch and the version menu are controls, not
                        navigation within this product's docs, so they stay above
                        the listing. */}
                    <Box
                        px={SIDEBAR_INSET}
                        mb="md"
                    >
                        <ProductSwitcherSegmented current={product} />
                    </Box>
                    {versionSelector && (
                        <Box
                            px={SIDEBAR_INSET}
                            mt="sm"
                            mb="md"
                        >
                            {versionSelector}
                        </Box>
                    )}
                </>
            }
        >
            <Stack
                gap={groups ? 2 : "lg"}
                component="nav"
                ref={nav}
                px={SIDEBAR_INSET}
            >
                {groups
                    ? groups.map((group, index) => (
                          <SidebarGroup
                              key={group.path}
                              group={group}
                              start={
                                  index === startGroup && groupRows(group) <= START_OPEN_MAX_ROWS
                              }
                          />
                      ))
                    : navigation.map((section) => (
                          <SidebarSection
                              key={section.title}
                              section={section}
                          />
                      ))}
            </Stack>
        </SidebarPane>
    );
}
