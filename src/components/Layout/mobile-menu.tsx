import { createContext, useContext, useEffect } from "react";
import type { NavSection } from "~/utils/navigation";

/**
 * Lets a page hand its sidebar to the one menu that phones and tablets use.
 *
 * Below `lg` the header's menu button is the only way into the navigation.
 * The menu belongs to the frame, which is mounted once above every page group,
 * while the sidebar belongs to the page, so the page registers its sidebar
 * here and the frame shows it at the top of the menu.
 */
const RegisterPageNavigation = createContext<(navigation: NavSection[] | null) => void>(() => {});

export const PageNavigationProvider = RegisterPageNavigation.Provider;

/** Shows this page's sidebar in the mobile menu while the page is mounted. */
export function useMobilePageNavigation(navigation: NavSection[]) {
    const register = useContext(RegisterPageNavigation);

    useEffect(() => {
        register(navigation);
        return () => register(null);
    }, [navigation, register]);
}
