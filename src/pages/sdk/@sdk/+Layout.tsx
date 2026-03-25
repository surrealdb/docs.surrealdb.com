import type { PropsWithChildren } from "react";
import { useData } from "vike-react/useData";
import { DefaultLayout } from "~/components/Layout";
import { VersionSelector } from "~/components/VersionSelector";
import type { SDKPageData } from "./+data";

export default function Layout({ children }: PropsWithChildren) {
    const { sidebar, headings, contentPath, sdk, sdkVersion } = useData<SDKPageData>();
    return (
        <DefaultLayout
            sidebar={sidebar}
            headings={headings}
            contentPath={contentPath}
            versionSelector={
                <VersionSelector
                    sdk={sdk}
                    currentVersion={sdkVersion}
                />
            }
        >
            {children}
        </DefaultLayout>
    );
}
