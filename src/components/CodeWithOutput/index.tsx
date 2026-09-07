import { Box } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./style.module.scss";

interface CodeWithOutputProps {
    /** The code fence followed by its output fence, in that order. */
    children?: ReactNode;
}

/**
 * A code fence and the output fence beneath it, joined into a single block.
 *
 * `wrapOutputPairs` inserts this around an adjacent pair while parsing, so no page
 * writes it by hand: content keeps two fences, which is the form the `.md` endpoints
 * serve and the form that tells an agent which half is runnable. The wrapper supplies
 * only the surrounding chrome, leaving both panes to the viewer's own code renderer,
 * so highlighting matches every other fence and each pane copies on its own.
 */
export function CodeWithOutput({ children }: CodeWithOutputProps) {
    return <Box className={classes.pair}>{children}</Box>;
}
