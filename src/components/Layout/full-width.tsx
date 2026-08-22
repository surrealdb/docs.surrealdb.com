import { Container, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { CSSProperties } from "react";
import { usePageContext } from "vike-react/usePageContext";
import globulesImg from "~/assets/img/globules.webp";
import { Footer } from "~/components/Footer";
import { Header, MobileNav } from "./header";
import type { NavEntry } from "./nav";
import { getProductFromPath } from "./products";
import classes from "./style.module.scss";

export interface FullWidthLayoutProps {
    children: React.ReactNode;
    /** Top navigation entries shown in the header. Defined per layout. */
    navLinks: NavEntry[];
}

export function FullWidthLayout({ children, navLinks }: FullWidthLayoutProps) {
    const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();
    const { urlPathname } = usePageContext();

    return (
        <Stack
            className={classes.fullWidthLayout}
            data-product={getProductFromPath(urlPathname)}
            gap={0}
            style={
                {
                    "--bg-image": `url(${globulesImg})`,
                    "--bg-opacity": 0.15,
                } as CSSProperties
            }
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
