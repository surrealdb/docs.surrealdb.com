import { Container, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Footer } from "~/components/Footer";
import { Header, MobileNav } from "./header";
import classes from "./style.module.scss";

export function FullWidthLayout({ children }: { children: React.ReactNode }) {
    const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();

    return (
        <Stack
            className={classes.fullWidthLayout}
            gap={0}
        >
            <Header
                opened={menuOpened}
                onToggle={toggleMenu}
            />
            <Drawer
                opened={menuOpened}
                onClose={closeMenu}
                size="325px"
                hiddenFrom="lg"
                withCloseButton={false}
            >
                <MobileNav />
            </Drawer>
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
