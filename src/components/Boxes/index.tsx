import { SimpleGrid } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./style.module.scss";

interface BoxesProps {
    columns?: 2 | 3;
    wider?: boolean;
    children?: ReactNode;
    class?: string;
}

export function Boxes({ columns = 2, wider, children }: BoxesProps) {
    const cols = wider
        ? columns === 3
            ? { base: 1, sm: 2, xl: 3 }
            : { base: 1, sm: 2 }
        : columns === 3
          ? { base: 1, md: 2, xl: 3 }
          : { base: 1, md: 2, "2xl": 2 };

    return (
        <SimpleGrid
            cols={cols}
            spacing="sm"
            className={classes.boxes}
        >
            {children}
        </SimpleGrid>
    );
}
