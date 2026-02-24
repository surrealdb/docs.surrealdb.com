import { DefaultLayout } from "@components/Layout";
import { useData } from "vike-react/useData";
import type { CloudPageData } from "./+data";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { sidebar, headings, contentPath } = useData<CloudPageData>();
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
