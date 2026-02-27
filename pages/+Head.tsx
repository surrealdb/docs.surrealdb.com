// https://vike.dev/Head

import "@mantine/core/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@surrealdb/ui/styles.css";
import "@surrealdb/ui/fonts.css";
import "@assets/styles/global.scss";
import "@assets/styles/markdown.scss";

import { ColorSchemeScript } from "@mantine/core";
import FavIcon from "@assets/img/favicon.svg";

export function Head() {
	return (
		<>
			<ColorSchemeScript defaultColorScheme="dark" />
			<link rel="icon" href={FavIcon} />
			<meta name="robots" content="index, follow" />
		</>
	);
}
