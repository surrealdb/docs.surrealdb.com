import { Anchor, Badge, Box, Group, Image, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { getImageUrl } from "~/utils/image-urls";
import classes from "./style.module.scss";

type StatusString =
    | "future"
    | "in development"
    | "coming soon"
    | "beta"
    | "complete"
    | "available"
    | `planned ${string}`;

interface IconBoxProps {
    title?: string;
    subtitle?: string;
    description?: string;
    status?: StatusString;
    href?: string;
    icon?: { light: string; dark: string } | string;
    children?: ReactNode;
}

const STATUS_COLORS: Record<string, string> = {
    complete: "green",
    available: "green",
    beta: "yellow",
    "coming soon": "orange",
    "in development": "orange",
    future: "gray",
};

function getStatusColor(status: string): string {
    return STATUS_COLORS[status] ?? (status.startsWith("planned") ? "blue" : "gray");
}

export function IconBox({
    title,
    subtitle,
    description,
    status,
    href,
    icon,
    children,
}: IconBoxProps) {
    const onlyIcon = icon && !title && !description && !status;

    const lightSrc = typeof icon === "string" ? icon : icon?.light;
    const darkSrc = typeof icon === "string" ? icon : icon?.dark;

    const resolvedLightSrc = (lightSrc && getImageUrl(lightSrc)) || lightSrc;
    const resolvedDarkSrc = (darkSrc && getImageUrl(darkSrc)) || darkSrc;

    const content = (
        <>
            <Group
                justify="space-between"
                align="center"
                wrap="nowrap"
            >
                <Group
                    gap="md"
                    align="center"
                    wrap="nowrap"
                >
                    {resolvedLightSrc && (
                        <Image
                            src={resolvedLightSrc}
                            alt={title ?? "Icon"}
                            w={24}
                            className={classes.lightIcon}
                            data-only-icon={onlyIcon || undefined}
                        />
                    )}
                    {resolvedDarkSrc && (
                        <Image
                            src={resolvedDarkSrc}
                            alt={title ?? "Icon"}
                            w={24}
                            className={classes.darkIcon}
                            data-only-icon={onlyIcon || undefined}
                        />
                    )}
                    {(title || subtitle) && (
                        <Stack gap={0}>
                            {title && (
                                <Text
                                    fw={500}
                                    fz="lg"
                                    c="bright"
                                >
                                    {title}
                                </Text>
                            )}
                            {subtitle && <Text fz="sm">{subtitle}</Text>}
                        </Stack>
                    )}
                </Group>
                {status && (
                    <Badge
                        variant="light"
                        color={getStatusColor(status)}
                        size="sm"
                        className={classes.status}
                    >
                        {status}
                    </Badge>
                )}
            </Group>
            {description && (
                <Text
                    mt="md"
                    className={classes.description}
                    opacity={0.8}
                >
                    {description}
                </Text>
            )}
            {children}
        </>
    );

    const Component = href ? Anchor : Box;

    return (
        <Component
            {...(href ? { href, underline: "never" as const } : {})}
            className={classes.iconBox}
            data-only-icon={onlyIcon || undefined}
            data-has-href={!!href || undefined}
        >
            {content}
        </Component>
    );
}
