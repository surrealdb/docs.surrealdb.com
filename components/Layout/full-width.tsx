import { Footer } from "@components/Footer";
import { Container, Stack } from "@mantine/core";
import { Header } from "./header";
import classes from "./style.module.scss";

export function FullWidthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Stack
            className={classes.fullWidthLayout}
            gap={0}
        >
            <Header />
            <Container
                component="main"
                size="lg"
                flex={1}
            >
                {children}
            </Container>
            <Footer />
        </Stack>
    );
}
