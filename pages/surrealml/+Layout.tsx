import { DefaultLayout } from "@components/Layout";
import { useData } from "vike-react/useData";
import type { SurrealMLPageData } from "./+data";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { sidebar, headings, contentPath } = useData<SurrealMLPageData>();
    return (
        <DefaultLayout
            sidebar={sidebar}
            headings={headings}
            contentPath={contentPath}
        >
            {children}
        </DefaultLayout>
    );
}
