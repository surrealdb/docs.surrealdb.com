import { Anchor, Box, Group, Stack, Text } from "@mantine/core";
import { Icon, iconCheck } from "@surrealdb/ui";
import { type MouseEvent, useState } from "react";
import { navigate } from "vike/client/router";
import { PRODUCT_ORDER, PRODUCTS, type ProductId } from "./products";
import classes from "./style.module.scss";

export interface ProductWordmarkProps {
    current: ProductId;
}

/**
 * Wordmark for the documentation being read. Switching products lives in
 * the sidebar, so this only links back to the product's docs home. The
 * word is set as text rather than an image so it inherits the site's
 * typeface and colour in both themes.
 */
export function ProductWordmark({ current }: ProductWordmarkProps) {
    const product = PRODUCTS[current];

    return (
        <Anchor
            href={product.homeHref}
            underline="never"
            className={classes.productWordmark}
            aria-label={`${product.label} documentation home`}
        >
            <Text
                fz="xl"
                fw={500}
                lh={1}
                className={classes.productWordmarkLabel}
            >
                Docs
            </Text>
        </Anchor>
    );
}

export interface ProductSwitcherSegmentedProps {
    current: ProductId;
}

/** How long the indicator takes to cross, and how long navigation waits for it. */
const SWITCH_DURATION = 280;

/**
 * Sidebar product switch. The fill is one indicator on the container, so
 * changing product slides it across rather than swapping two backgrounds.
 *
 * Switching products also changes page group, which remounts this component -
 * so a CSS transition alone would never be seen: the new page would simply
 * render with the indicator already moved. The click therefore moves the
 * indicator first and lets navigation follow once it has travelled. Without
 * JavaScript the anchors still navigate on their own.
 */
export function ProductSwitcherSegmented({ current }: ProductSwitcherSegmentedProps) {
    const [pending, setPending] = useState<ProductId | null>(null);
    const shown = pending ?? current;

    function handleSwitch(event: MouseEvent<HTMLAnchorElement>, id: ProductId) {
        if (id === current) return;

        event.preventDefault();
        setPending(id);
        setTimeout(() => navigate(PRODUCTS[id].homeHref), SWITCH_DURATION);
    }

    return (
        <Group
            component="nav"
            aria-label="Switch documentation"
            gap={0}
            wrap="nowrap"
            className={classes.productSwitch}
            data-active-index={PRODUCT_ORDER.indexOf(shown)}
        >
            {PRODUCT_ORDER.map((id) => {
                const product = PRODUCTS[id];
                const active = id === shown;

                return (
                    <Anchor
                        key={id}
                        href={product.homeHref}
                        onClick={(event) => handleSwitch(event, id)}
                        underline="never"
                        fz={14}
                        fw={500}
                        className={classes.productSwitchItem}
                        data-active={active || undefined}
                        aria-current={id === current ? "page" : undefined}
                    >
                        {product.shortLabel}
                    </Anchor>
                );
            })}
        </Group>
    );
}

export interface ProductListProps {
    /** Product to mark as current. Omit where no product is in scope. */
    current?: ProductId;
    label?: string;
}

/**
 * Every product as a described card. Used by the mobile navigation and by
 * the error page, where it doubles as a way out of a dead end.
 */
export function ProductList({ current, label = "Switch documentation" }: ProductListProps) {
    return (
        <Box
            component="section"
            aria-label={label}
        >
            <Stack gap="xs">
                {PRODUCT_ORDER.map((id) => {
                    const product = PRODUCTS[id];
                    const active = id === current;

                    return (
                        <Anchor
                            key={id}
                            href={product.homeHref}
                            underline="never"
                            className={classes.productListItem}
                            data-active={active || undefined}
                            aria-current={active ? "page" : undefined}
                        >
                            <Group
                                wrap="nowrap"
                                align="center"
                                gap="md"
                                p="sm"
                            >
                                <Stack
                                    gap={2}
                                    flex={1}
                                    miw={0}
                                >
                                    <Text
                                        fz="sm"
                                        fw={600}
                                        c="bright"
                                    >
                                        {product.label}
                                    </Text>
                                    <Text
                                        fz="xs"
                                        c="dimmed"
                                        lineClamp={2}
                                    >
                                        {product.description}
                                    </Text>
                                </Stack>
                                {active && (
                                    <Icon
                                        path={iconCheck}
                                        size="sm"
                                        aria-label="Current"
                                    />
                                )}
                            </Group>
                        </Anchor>
                    );
                })}
            </Stack>
        </Box>
    );
}
