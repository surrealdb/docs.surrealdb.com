import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { Icon, iconMoon, iconSun } from "@surrealdb/ui";

/** The header search box's height, so the toggle beside it is a matching square. */
export const HEADER_CONTROL_SIZE = 38;

/**
 * One button that switches between dark and light. Like any button, its icon
 * names what a click does: the sun in dark mode, the moon in light, matching
 * its label. A reader whose choice is still the system's starts from whatever
 * that resolves to.
 */
export function ColorSchemeToggle() {
    const { setColorScheme } = useMantineColorScheme();
    const computedScheme = useComputedColorScheme("dark");
    const next = computedScheme === "dark" ? "light" : "dark";

    return (
        <ActionIcon
            aria-label={`Switch to ${next} mode`}
            size={HEADER_CONTROL_SIZE}
            onClick={() => setColorScheme(next)}
        >
            <Icon path={next === "light" ? iconSun : iconMoon} />
        </ActionIcon>
    );
}
