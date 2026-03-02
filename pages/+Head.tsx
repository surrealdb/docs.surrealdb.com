// https://vike.dev/Head

import "@mantine/core/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "@surrealdb/ui/styles.css";
import "@surrealdb/ui/fonts.css";
import "@assets/styles/global.scss";
import "@assets/styles/markdown.scss";

import FavIcon from "@assets/img/favicon.svg";
import { ColorSchemeScript } from "@mantine/core";

export function Head() {
    const fontUrl =
        "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap";
    return (
        <>
            <link
                rel="icon"
                href={FavIcon}
            />
            <ColorSchemeScript defaultColorScheme="auto" />
            <meta
                name="robots"
                content="index, follow"
            />
            <link
                rel="preconnect"
                href="https://fonts.googleapis.com"
            />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                rel="stylesheet"
                href={fontUrl}
            />
        </>
    );
}
