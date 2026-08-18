import { Box } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./style.module.scss";

interface SynopsisProps {
    /**
     * The usage line(s), as raw text. A single string may contain newlines; an array
     * is joined with newlines. Rendered verbatim — never parsed as markdown — so
     * notation such as `[NAME]`, `<TYPE>` and `...` survives intact.
     *
     * In markdown this prop is filled in by the pipeline from the block body, so
     * authors write the lines between `<Synopsis>` and `</Synopsis>`.
     */
    command?: string | string[];
    /**
     * Caption shown above the block, which also names the block for assistive
     * technology. Defaults to `Usage`; use `Signature` for SDK reference.
     */
    label?: string;
    /**
     * Fallback content used when `command` is absent. Markdown children are parsed
     * as inline markdown, so this path cannot carry synopsis notation reliably.
     */
    children?: ReactNode;
}

function resolveCommand(command: string | string[] | undefined): string | undefined {
    if (command === undefined) {
        return undefined;
    }

    const text = Array.isArray(command) ? command.join("\n") : command;
    return text.trim() === "" ? undefined : text;
}

/**
 * A usage/invocation block for command and method reference.
 *
 * Deliberately distinct from a code fence: there is no copy button, because a
 * synopsis carries metasyntax (`[optional]`, `<placeholder>`, `...`) that breaks
 * when pasted into a shell.
 */
export function Synopsis({ command, label = "Usage", children }: SynopsisProps) {
    const text = resolveCommand(command);

    return (
        <Box
            component="figure"
            className={classes.synopsis}
        >
            <Box
                component="figcaption"
                className={classes.synopsisCaption}
            >
                {label}
            </Box>
            {text === undefined ? (
                <Box className={classes.synopsisBody}>{children}</Box>
            ) : (
                <Box
                    component="pre"
                    className={classes.synopsisBody}
                >
                    <code>
                        {/*
                         * One block per authored line, so a line that wraps on a narrow
                         * viewport can carry a hanging indent and stay distinguishable
                         * from the next usage line.
                         */}
                        {text.split("\n").map((line, index) => (
                            <Box
                                key={index}
                                component="span"
                                className={classes.synopsisLine}
                            >
                                {line}
                            </Box>
                        ))}
                    </code>
                </Box>
            )}
        </Box>
    );
}
