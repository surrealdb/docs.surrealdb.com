import { useData } from "vike-react/useData";
import { DefaultLayout } from "~/components/Layout";
import type { PageData } from "~/utils/data";

export default function Layout({ children }: { children: React.ReactNode }) {
    const data = useData<PageData>();

    return <DefaultLayout data={data}>{children}</DefaultLayout>;
}
