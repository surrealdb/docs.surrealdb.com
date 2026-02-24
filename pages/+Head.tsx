// https://vike.dev/Head

import { ColorSchemeScript } from "@mantine/core";
import logoUrl from "../assets/logo.svg";

export function Head() {
    const fontUrl =
        "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap";
    return (
        <>
            <link
                rel="icon"
                href={logoUrl}
            />
            <ColorSchemeScript
                forceColorScheme="dark"
                defaultColorScheme="dark"
            />
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
