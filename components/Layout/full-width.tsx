import { Footer } from "@components/Footer";
import { Container, Stack } from "@mantine/core";
import { Header } from "./header";
import classes from "./style.module.scss";

export function FullWidthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Stack
            className={classes.fullWidthLayout}
            h="100vh"
            bg="obsidian.9"
        >
            <Header />
            <Container
                component="main"
                flex={1}
                size="lg"
                w="100%"
            >
                {children}
            </Container>
            <Footer />
        </Stack>
    );
}
