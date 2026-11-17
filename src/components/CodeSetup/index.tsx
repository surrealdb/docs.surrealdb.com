import { Box, UnstyledButton } from "@mantine/core";
import { type MouseEvent, type ReactNode, useId, useState } from "react";
import classes from "./style.module.scss";

export interface CodeSetupProps {
    /** The line of the `-- Setup` label, 1-based within the fence's code. */
    from?: string | number;
    /** The last line of the setup statements. */
    to?: string | number;
    /** The fence, as the viewer renders it. */
    children?: ReactNode;
}

/**
 * A SurrealQL fence whose setup statements stay collapsed under their `-- Setup`
 * label until a reader opens them.
 *
 * `wrapSetupSections` inserts this around a fence while parsing, so no page writes it
 * by hand. The fence still renders through the viewer's own code path, so the copy
 * button yields the whole example, setup included, and a pasted copy runs.
 *
 * The lines are hidden with a rule scoped to this block rather than removed, because
 * the viewer renders the fence: the rule reaches into its markup structurally, one
 * `span` per line, as `CodeWithOutput` does. Being CSS, the block is already
 * collapsed in the server-rendered page. A click on the label line toggles it, and a
 * button that appears when focused does the same from the keyboard.
 */
export function CodeSetup({ from, to, children }: CodeSetupProps) {
    const label = Number(from);
    const last = Number(to);
    const [open, setOpen] = useState(false);
    const scope = useId();
    const count = last - label;
    const lines = count === 1 ? "1 setup line" : `${count} setup lines`;

    const line = `[data-code-setup="${scope}"] pre code > span`;
    const rules = [
        `${line}:nth-child(${label}) { cursor: pointer; }`,
        open
            ? ""
            : `${line}:nth-child(n+${label + 1}):nth-child(-n+${last}) { display: none; }` +
              `${line}:nth-child(${label})::after { content: "\\25B8  ${lines}"; }`,
    ].join("");

    const onClick = (event: MouseEvent<HTMLDivElement>) => {
        const span = (event.target as HTMLElement).closest("pre code > span");
        if (span?.parentElement && [...span.parentElement.children].indexOf(span) === label - 1) {
            setOpen((value) => !value);
        }
    };

    return (
        <Box
            className={classes.root}
            data-code-setup={scope}
            data-open={open || undefined}
            onClick={onClick}
        >
            <style>{rules}</style>
            <UnstyledButton
                className={classes.toggle}
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
            >
                {open ? "Hide setup" : `Show ${lines}`}
            </UnstyledButton>
            {children}
        </Box>
    );
}
