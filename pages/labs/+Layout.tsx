import { FullWidthLayout } from "@components/Layout/full-width";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <FullWidthLayout>{children}</FullWidthLayout>;
}
