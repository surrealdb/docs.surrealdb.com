import { ActionIcon, Menu, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { Icon, iconCheck, iconMoon, iconSun } from "@surrealdb/ui";

/** The header search box's height, so the toggle beside it is a matching square. */
export const HEADER_CONTROL_SIZE = 38;

export function ColorSchemeToggle() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const computedScheme = useComputedColorScheme();

    return (
        <Menu
            trigger="hover"
            transitionProps={{ transition: "scale-y" }}
        >
            <Menu.Target>
                <ActionIcon
                    aria-label="Toggle color scheme"
                    size={HEADER_CONTROL_SIZE}
                >
                    <Icon path={computedScheme === "dark" ? iconMoon : iconSun} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown miw={150}>
                <Menu.Label>Color scheme</Menu.Label>
                <Menu.Item
                    onClick={() => setColorScheme("auto")}
                    bdrs="xs"
                    leftSection={
                        <Icon
                            path={colorScheme === "auto" ? iconCheck : ""}
                            size="xs"
                        />
                    }
                >
                    System
                </Menu.Item>
                <Menu.Item
                    onClick={() => setColorScheme("light")}
                    bdrs="xs"
                    leftSection={
                        <Icon
                            path={colorScheme === "light" ? iconCheck : ""}
                            size="sm"
                        />
                    }
                >
                    Light
                </Menu.Item>
                <Menu.Item
                    onClick={() => setColorScheme("dark")}
                    bdrs="xs"
                    leftSection={
                        <Icon
                            path={colorScheme === "dark" ? iconCheck : ""}
                            size="sm"
                        />
                    }
                >
                    Dark
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
