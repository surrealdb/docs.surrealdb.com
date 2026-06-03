import { Container, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Footer } from "~/components/Footer";
import { Header, MobileNav } from "./header";
import type { NavEntry } from "./nav";
import classes from "./style.module.scss";

export interface FullWidthLayoutProps {
    children: React.ReactNode;
    /** Top navigation entries shown in the header. Defined per layout. */
    navLinks: NavEntry[];
}

export function FullWidthLayout({ children, navLinks }: FullWidthLayoutProps) {
    const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();

    return (
        <Stack
            className={classes.fullWidthLayout}
            gap={0}
        >
            <Header
                navLinks={navLinks}
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
                <MobileNav navLinks={navLinks} />
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
