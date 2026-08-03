import { Anchor, Box, Group, Image, SegmentedControl, Stack, Text } from "@mantine/core";
import { Icon, iconCheck, ThemedImage } from "@surrealdb/ui";
import { useMemo } from "react";
import { navigate } from "vike/client/router";
import { PRODUCT_ORDER, PRODUCTS, type ProductId } from "./products";
import classes from "./style.module.scss";

export interface ProductWordmarkProps {
	current: ProductId;
}

/**
 * Wordmark for the documentation being read. Switching products lives in
 * the sidebar, so this only links back to the product's docs home.
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
			<ThemedImage
				lightSrc={product.wordmarkLight}
				darkSrc={product.wordmarkDark}
				h={20}
				w="auto"
			/>
		</Anchor>
	);
}

export interface ProductSwitcherSegmentedProps {
	current: ProductId;
}

/**
 * Sidebar product switch. The header dropdown only reveals itself on
 * hover, so the sidebar states both products up front and keeps the
 * current one visibly selected.
 */
export function ProductSwitcherSegmented({ current }: ProductSwitcherSegmentedProps) {
	const data = useMemo(
		() =>
			PRODUCT_ORDER.map((id) => {
				const product = PRODUCTS[id];

				return {
					value: id,
					label: (
						<Group
							wrap="nowrap"
							gap="xs"
							h={30}
						>
							<Image
								src={product.picto}
								w={20}
								className={classes.productSegmentPicto}
								data-active={id === current || undefined}
							/>
							<Text
								fz="sm"
								fw={500}
							>
								{product.shortLabel}
							</Text>
						</Group>
					),
				};
			}),
		[current],
	);

	return (
		<SegmentedControl
			data={data}
			value={current}
			onChange={(id) => navigate(PRODUCTS[id].homeHref)}
			aria-label="Switch documentation"
			orientation="vertical"
			size="md"
			fullWidth
			bdrs={18}
			bg="obsidian.9"
		/>
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
								<Image
									src={product.picto}
									w={32}
								/>
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
