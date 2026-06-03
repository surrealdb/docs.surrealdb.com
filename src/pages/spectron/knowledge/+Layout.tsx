import { useData } from "vike-react/useData";
import { DefaultLayout } from "~/components/Layout";
import { SPECTRON_NAV_LINKS } from "~/components/Layout/nav";
import type { PageData } from "~/utils/data";

export default function Layout({ children }: { children: React.ReactNode }) {
    const data = useData<PageData>();

    return (
        <DefaultLayout
            data={data}
            navLinks={SPECTRON_NAV_LINKS}
        >
            {children}
        </DefaultLayout>
    );
}
