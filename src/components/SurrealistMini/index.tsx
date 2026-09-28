import { Box, useComputedColorScheme } from "@mantine/core";
import { SurrealistMini as KitSurrealistMini, type MiniConfig } from "@surrealdb/ui";
import classes from "./style.module.scss";

type SurrealistMiniProps = Omit<MiniConfig, "transparent">;

/**
 * The kit's Surrealist embed, drawn on the card surface.
 *
 * The iframe paints its own background, which no stylesheet here can reach,
 * so the embed is asked to render transparently and the surface comes from the
 * box around it instead. Markdown attributes arrive as props and pass through
 * as the embed's config, as they do for the kit's own markdown mapping.
 *
 * The embed's `auto` theme follows the operating system rather than the site,
 * so it is handed the site's scheme unless a page sets a theme of its own.
 */
export function SurrealistMini({ theme, ...props }: SurrealistMiniProps) {
    const siteScheme = useComputedColorScheme("dark");
    const scheme = theme && theme !== "auto" ? theme : siteScheme;

    return (
        <Box
            className={classes.root}
            data-orientation={props.orientation ?? "vertical"}
        >
            {/* Square blocks behind the two panels, in the panels' own colour,
                so their rounded corners read as square. The panels are drawn
                inside the frame, where no stylesheet here reaches. */}
            <Box
                className={classes.panelBacking}
                data-panel="first"
                aria-hidden
            />
            <Box
                className={classes.panelBacking}
                data-panel="second"
                aria-hidden
            />
            <KitSurrealistMini
                config={{
                    ...props,
                    theme: scheme,
                    transparent: true,
                }}
            />
        </Box>
    );
}
