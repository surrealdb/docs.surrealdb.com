// https://vike.dev/Layout

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { MANTINE_THEME } from "@surrealdb/ui";
import "@assets/styles/global.scss";
import "@assets/styles/markdown.scss";
import "@surrealdb/ui/styles.css";
import "@mantine/spotlight/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <MantineProvider theme={MANTINE_THEME}>{children}</MantineProvider>;
}
