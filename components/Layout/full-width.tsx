import { Footer } from "@components/Footer";
import { Container, Stack } from "@mantine/core";
import { Header } from "./header";
import classes from "./style.module.scss";

export function FullWidthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Stack
            className={classes.fullWidthLayout}
            h="100vh"
        >
            <Header />
            <Container
                component="main"
                size="lg"
            >
                {children}
            </Container>
            <Footer />
        </Stack>
    );
}
