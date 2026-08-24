import { Anchor, Box, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type CSSProperties, useEffect } from "react";
import { usePageContext } from "vike-react/usePageContext";
import globulesImg from "~/assets/img/globules.webp";
import { Footer } from "~/components/Footer";
import { Header, MobileNav } from "./header";
import { navLinksForPath } from "./nav";
import { getProductFromPath } from "./products";
import classes from "./style.module.scss";

/**
 * The page frame: backdrop, header, mobile navigation and footer.
 *
 * This sits in the root layout rather than in each page group's, and that
 * placement is the point. Every group has its own `+Layout.tsx` in its own
 * lazily loaded chunk, so moving between two groups - switching product, most
 * visibly - unmounts one layout and mounts another. Rebuilding the header as
 * part of that swap made the wordmark blink on every product switch, waiting on
 * a chunk that had nothing to do with it. Mounted once above the groups, the
 * header is untouched by the transition and the switch is just a repaint.
 *
 * Nothing here depends on a group: the header's links follow from the path, and
 * the footer is the same everywhere.
 */
export function PageFrame({ children }: { children: React.ReactNode }) {
    const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure();
    const { urlPathname } = usePageContext();

    const product = getProductFromPath(urlPathname);
    const navLinks = navLinksForPath(urlPathname);

    // Mantine portals its drawers and menus to `document.body`, outside this
    // element, so the accent tokens have to be reachable from the root too.
    useEffect(() => {
        document.documentElement.dataset.product = product;
    }, [product]);

    // The drawer used to be discarded along with the layout on every
    // navigation, which closed it as a side effect. It now outlives the page,
    // so following one of its own links has to close it.
    // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on route change
    useEffect(() => {
        closeMenu();
    }, [urlPathname]);

    return (
        <Box
            className={classes.layout}
            data-product={product}
            style={
                {
                    "--bg-image": `url(${globulesImg})`,
                    "--bg-opacity": 0.15,
                } as CSSProperties
            }
        >
            {/* First tab stop on every page: keyboard and screen-reader users
                jump past the header and the whole sidebar tree (WCAG 2.4.1). */}
            <Anchor
                href="#main-content"
                className={classes.skipLink}
            >
                Skip to content
            </Anchor>
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
                classNames={{ content: classes.drawerContent }}
            >
                <MobileNav navLinks={navLinks} />
            </Drawer>
            {children}
            <Footer />
        </Box>
    );
}
