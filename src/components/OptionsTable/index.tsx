import { Box, Table, Text, VisuallyHidden } from "@mantine/core";
import { Label } from "@surrealdb/ui";
import { type ReactNode, useId } from "react";
import classes from "./style.module.scss";

/**
 * One documented input in a reference table: a CLI flag, a positional argument, or
 * an SDK parameter. Only `name` and `description` are required — every other field
 * is optional, and a column is rendered only when at least one row in the table
 * uses it.
 */
export interface ReferenceOption {
    /**
     * Primary identifier, rendered monospace: `--type`, `[NAME]`, `options.timeout`.
     */
    name: string;
    /**
     * Short alias, merged into the name cell as `--type, -t`. CLI reference only.
     */
    short?: string;
    /**
     * Value placeholder shown beside the name: `<TYPE>`, `<DURATION>`. Use this for
     * CLI flags that take a value; use `type` for SDK parameters instead.
     */
    value?: string;
    /**
     * Data type, rendered in its own column: `string`, `Duration`, `RecordId`. Use
     * this for SDK reference; use `value` for CLI placeholders.
     */
    type?: string;
    /**
     * Default applied when the option is omitted. Omit for booleans that default to
     * false — an absent default is the silent, common case.
     */
    default?: string | number | boolean;
    /**
     * Environment variable that supplies the same value: `SURREALCTL_TYPE`.
     */
    env?: string;
    /**
     * Whether the option must be supplied. `true` renders a `required` badge in the
     * name cell; anything else renders nothing, so optional stays silent.
     */
    required?: boolean;
    /**
     * What the option does. Plain text; backtick spans are rendered as inline code.
     */
    description: string;
}

interface OptionsTableProps {
    /**
     * Caption rendered above the table, which also names the table for assistive
     * technology: `Options`, `Arguments`, `Parameters`.
     */
    title?: string;
    /** The rows to render, in the order they should appear. */
    options?: ReferenceOption[];
}

/** Minimum width, in pixels, each column needs before the table starts scrolling. */
const COLUMN_WIDTHS = {
    name: 200,
    type: 110,
    default: 110,
    env: 170,
    description: 220,
} as const;

const INLINE_CODE = /`([^`]+)`/g;

/** Render backtick spans in a plain-text description as inline code. */
function renderDescription(description: string): ReactNode {
    const parts = description.split(INLINE_CODE);

    if (parts.length === 1) {
        return description;
    }

    return parts.map((part, index) =>
        index % 2 === 1 ? (
            <Box
                key={index}
                component="code"
                className={classes.mono}
            >
                {part}
            </Box>
        ) : (
            part
        ),
    );
}

/** Placeholder for a cell this row does not use. */
function EmptyCell() {
    return (
        <>
            <Box
                component="span"
                aria-hidden="true"
                className={classes.empty}
            >
                &mdash;
            </Box>
            <VisuallyHidden>None</VisuallyHidden>
        </>
    );
}

function MonoCell({ children }: { children?: ReactNode }) {
    if (children === undefined || children === "") {
        return <EmptyCell />;
    }

    return (
        <Box
            component="code"
            className={classes.mono}
        >
            {children}
        </Box>
    );
}

interface OptionRowProps {
    option: ReferenceOption;
    /** Which optional columns this table renders, so every row stays aligned. */
    columns: { type: boolean; default: boolean; env: boolean };
}

function OptionRow({ option, columns }: OptionRowProps) {
    const identity = option.short ? `${option.name}, ${option.short}` : option.name;

    return (
        <Table.Tr>
            <Table.Th
                scope="row"
                className={classes.identityCell}
            >
                <Box className={classes.identity}>
                    <Box
                        component="code"
                        className={classes.identityName}
                    >
                        {identity}
                    </Box>
                    {option.value && (
                        <Box
                            component="code"
                            className={classes.identityValue}
                        >
                            {option.value}
                        </Box>
                    )}
                    {option.required === true && (
                        <Label
                            label="required"
                            size="xs"
                            className={classes.requiredLabel}
                        />
                    )}
                </Box>
            </Table.Th>
            {columns.type && (
                <Table.Td>
                    <MonoCell>{option.type}</MonoCell>
                </Table.Td>
            )}
            {columns.default && (
                <Table.Td>
                    <MonoCell>
                        {option.default === undefined ? undefined : String(option.default)}
                    </MonoCell>
                </Table.Td>
            )}
            {columns.env && (
                <Table.Td>
                    <MonoCell>{option.env}</MonoCell>
                </Table.Td>
            )}
            <Table.Td className={classes.description}>
                {renderDescription(option.description ?? "")}
            </Table.Td>
        </Table.Tr>
    );
}

/**
 * A reference table for CLI options and SDK parameters.
 *
 * Columns adapt to the data: `Type`, `Default` and `Environment variable` appear
 * only when a row uses them, so a table never carries a column of em-dashes.
 */
export function OptionsTable({ title, options }: OptionsTableProps) {
    const captionId = useId();
    const rows = Array.isArray(options) ? options : [];

    if (rows.length === 0) {
        return null;
    }

    const columns = {
        type: rows.some((option) => !!option.type),
        default: rows.some((option) => option.default !== undefined),
        env: rows.some((option) => !!option.env),
    };

    const minWidth =
        COLUMN_WIDTHS.name +
        COLUMN_WIDTHS.description +
        (columns.type ? COLUMN_WIDTHS.type : 0) +
        (columns.default ? COLUMN_WIDTHS.default : 0) +
        (columns.env ? COLUMN_WIDTHS.env : 0);

    return (
        <Box className={classes.optionsTable}>
            {title && (
                <Text
                    component="p"
                    id={captionId}
                    className={classes.caption}
                >
                    {title}
                </Text>
            )}
            <Table.ScrollContainer
                minWidth={minWidth}
                type="native"
            >
                <Table
                    className={classes.table}
                    aria-labelledby={title ? captionId : undefined}
                    horizontalSpacing="sm"
                    verticalSpacing="sm"
                    withTableBorder
                    withColumnBorders
                    highlightOnHover
                    tabularNums
                >
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th scope="col">Name</Table.Th>
                            {columns.type && <Table.Th scope="col">Type</Table.Th>}
                            {columns.default && <Table.Th scope="col">Default</Table.Th>}
                            {columns.env && <Table.Th scope="col">Environment variable</Table.Th>}
                            <Table.Th scope="col">Description</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {rows.map((option, index) => (
                            <OptionRow
                                key={`${option.name}-${index}`}
                                option={option}
                                columns={columns}
                            />
                        ))}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Box>
    );
}
