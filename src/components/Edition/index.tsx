import { Badge, type BadgeProps } from "@mantine/core";

export type EditionValue = "community" | "enterprise";

interface EditionProps extends Omit<BadgeProps, "color" | "children"> {
    value: EditionValue;
}

const LABELS: Record<EditionValue, string> = {
    community: "Community",
    enterprise: "Enterprise",
};

const COLOURS: Record<EditionValue, string> = {
    community: "blue",
    enterprise: "violet",
};

export function Edition({ value, variant = "light", size = "sm", ...rest }: EditionProps) {
    return (
        <Badge
            color={COLOURS[value]}
            variant={variant}
            size={size}
            {...rest}
        >
            {LABELS[value]}
        </Badge>
    );
}
