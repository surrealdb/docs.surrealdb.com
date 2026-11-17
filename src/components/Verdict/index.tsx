import { Badge, type BadgeProps } from "@mantine/core";
import classes from "./style.module.scss";

export type VerdictValue =
    | "supported"
    | "partial"
    | "differs"
    | "refused"
    | "not-supported"
    | "not-documented"
    | "not-applicable";

interface VerdictProps extends Omit<BadgeProps, "color" | "children"> {
    value: VerdictValue;
}

export const VERDICT_LABELS: Record<VerdictValue, string> = {
    supported: "Supported",
    partial: "Partial",
    differs: "Differs",
    refused: "Refused",
    "not-supported": "Not supported",
    "not-documented": "Not documented",
    "not-applicable": "Not applicable",
};

const COLOURS: Record<VerdictValue, string> = {
    supported: "green",
    partial: "yellow",
    differs: "orange",
    refused: "red",
    "not-supported": "red",
    "not-documented": "gray",
    "not-applicable": "gray",
};

/**
 * Compatibility verdict chip for matrix tables, coloured so a reader can scan
 * a column for what runs. It sits on its own line above the cell's detail.
 * Renders as a `span` for the same reason as `Since`: markdown places it
 * inside a `<p>` or a table cell.
 */
export function Verdict({ value, variant = "light", size = "md", ...rest }: VerdictProps) {
    return (
        <Badge
            component="span"
            color={COLOURS[value]}
            variant={variant}
            size={size}
            tt="none"
            className={classes.verdict}
            {...rest}
        >
            {VERDICT_LABELS[value] ?? value}
        </Badge>
    );
}
