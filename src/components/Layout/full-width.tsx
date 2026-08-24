import { Box, Container } from "@mantine/core";
import classes from "./style.module.scss";

export interface FullWidthLayoutProps {
    children: React.ReactNode;
}

/**
 * A page with no documentation tree beside it - the labs index and the error
 * page. Header, backdrop and footer come from the frame around it, so this
 * paints the same reading surface the shell gives the docs and centres a
 * column matching the shell's overall content width.
 */
export function FullWidthLayout({ children }: FullWidthLayoutProps) {
    return (
        <Box className={classes.fullShell}>
            <Container
                component="main"
                size={1300}
                px={32}
                w="100%"
                flex={1}
            >
                {children}
            </Container>
        </Box>
    );
}
