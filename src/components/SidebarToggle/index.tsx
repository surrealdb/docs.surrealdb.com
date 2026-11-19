import { ActionIcon, Box } from "@mantine/core";
import { Icon, iconSidebar } from "@surrealdb/ui";
import classes from "./style.module.scss";

export interface SidebarToggleProps {
    collapsed: boolean;
    onToggle: () => void;
}

/**
 * Shows or hides the docs tree beside the reading column. It sits in the
 * left gutter of the reading column and follows the reader down the page, so
 * the tree can be opened or closed from anywhere on a long page. It stays in
 * the same place whether the tree is open or closed, and only appears where
 * the tree is beside the page: below `lg` the tree lives in the header's menu.
 */
export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
    const label = collapsed ? "Show navigation" : "Hide navigation";

    return (
        <Box
            className={classes.anchor}
            visibleFrom="lg"
        >
            <ActionIcon
                className={classes.button}
                variant="subtle"
                size={32}
                aria-label={label}
                aria-expanded={!collapsed}
                title={label}
                onClick={onToggle}
            >
                <Icon path={iconSidebar} />
            </ActionIcon>
        </Box>
    );
}
