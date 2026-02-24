import { DefaultLayout } from "@components/Layout";
import type { PropsWithChildren } from "react";
import { useData } from "vike-react/useData";
import type { SDKPageData } from "./+data";

export default function Layout({ children }: PropsWithChildren) {
    const { sidebar, headings, contentPath } = useData<SDKPageData>();
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
