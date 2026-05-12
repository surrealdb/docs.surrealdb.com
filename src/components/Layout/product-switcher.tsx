import { Anchor, Box, Flex, Group, Menu, Stack, Text } from "@mantine/core";
import { Icon, iconCheck, iconChevronDown, ThemedImage } from "@surrealdb/ui";
import { useState } from "react";
import { PRODUCT_ORDER, PRODUCTS, type ProductConfig, type ProductId } from "./products";
import classes from "./style.module.scss";

export interface ProductSwitcherProps {
    current: ProductId;
}

export function ProductSwitcher({ current }: ProductSwitcherProps) {
    const [opened, setOpened] = useState(false);
    const product = PRODUCTS[current];

    return (
        <Menu
            opened={opened}
            onChange={setOpened}
            shadow="lg"
            offset={6}
            width={280}
            position="bottom-start"
            withinPortal
            trigger="click-hover"
            transitionProps={{ transition: "scale-y" }}
        >
            <Menu.Target>
                <Anchor
                    component="button"
                    type="button"
                    underline="never"
                    className={classes.productSwitcherTrigger}
                    aria-label={`Switch documentation. Currently viewing ${product.label}`}
                    aria-haspopup="menu"
                    aria-expanded={opened}
                    data-active={opened || undefined}
                >
                    <Flex
                        align="center"
                        gap="xs"
                    >
                        <ThemedImage
                            lightSrc={product.wordmarkLight}
                            darkSrc={product.wordmarkDark}
                            h={20}
                            w="auto"
                        />
                        <Icon
                            path={iconChevronDown}
                            size="xs"
                            className={classes.productSwitcherChevron}
                        />
                    </Flex>
                </Anchor>
            </Menu.Target>
            <Menu.Dropdown
                bdrs="xs"
                bg="obsidian.7"
                p="xs"
            >
                <Menu.Label className={classes.navLinkLabel}>Documentation</Menu.Label>
                {PRODUCT_ORDER.map((id) => (
                    <ProductMenuItem
                        key={id}
                        product={PRODUCTS[id]}
                        active={id === current}
                    />
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}

interface ProductMenuItemProps {
    product: ProductConfig;
    active: boolean;
}

function ProductMenuItem({ product, active }: ProductMenuItemProps) {
    return (
        <Menu.Item
            component="a"
            href={product.homeHref}
            className={classes.productSwitcherItem}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            bdrs="xs"
            p="sm"
            color="slate"
            leftSection={
                <Box className={classes.productSwitcherIcon}>
                    <Icon
                        path={product.icon}
                        size="lg"
                    />
                </Box>
            }
            rightSection={
                active ? (
                    <Icon
                        path={iconCheck}
                        size="sm"
                        aria-label="Current"
                    />
                ) : null
            }
        >
            <Stack gap={2}>
                <Group
                    align="center"
                    gap="xs"
                    wrap="nowrap"
                >
                    <Text
                        fz="sm"
                        fw={600}
                        c="bright"
                    >
                        {product.label}
                    </Text>
                </Group>
                <Text
                    fz="xs"
                    c="slate.3"
                    lineClamp={2}
                >
                    {product.description}
                </Text>
            </Stack>
        </Menu.Item>
    );
}

export interface ProductSwitcherMobileProps {
    current: ProductId;
}

export function ProductSwitcherMobile({ current }: ProductSwitcherMobileProps) {
    return (
        <Box
            component="section"
            aria-label="Switch documentation"
        >
            <Text
                component="div"
                className={classes.navLinkLabel}
                px="sm"
                mb="xs"
            >
                Documentation
            </Text>
            <Stack gap="xs">
                {PRODUCT_ORDER.map((id) => {
                    const product = PRODUCTS[id];
                    const active = id === current;

                    return (
                        <Anchor
                            key={id}
                            href={product.homeHref}
                            underline="never"
                            className={classes.productSwitcherMobileItem}
                            data-active={active || undefined}
                            aria-current={active ? "page" : undefined}
                        >
                            <Group
                                wrap="nowrap"
                                align="center"
                                gap="md"
                                p="sm"
                            >
                                <Box className={classes.productSwitcherIcon}>
                                    <Icon
                                        path={product.icon}
                                        size="lg"
                                    />
                                </Box>
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
                                        c="slate.3"
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
