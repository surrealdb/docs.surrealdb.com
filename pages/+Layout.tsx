// https://vike.dev/Layout

import { MantineProvider } from "@mantine/core";
import { MANTINE_THEME } from "@surrealdb/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
	return <MantineProvider theme={MANTINE_THEME}>{children}</MantineProvider>;
}
