import { FullWidthLayout } from "~/components/Layout/full-width";
import { SURREALDB_NAV_LINKS } from "~/components/Layout/nav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <FullWidthLayout navLinks={SURREALDB_NAV_LINKS}>{children}</FullWidthLayout>;
}
