import { Box, Container, Drawer, Group, Stack } from "@mantine/core";
import classes from "./style.module.scss";

export interface ShellDrawerProps {
    opened: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

/** Mobile drawer for a shell's sidebar pane, shown below `lg`. */
export function ShellDrawer({ opened, onClose, children }: ShellDrawerProps) {
    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            size="325px"
            hiddenFrom="lg"
            withCloseButton={false}
            classNames={{ content: classes.drawerContent }}
        >
            {children}
        </Drawer>
    );
}

export interface ShellProps {
    children: React.ReactNode;
}

/**
 * The sidebar-and-reading-column grid shared by the docs tree pages and the
 * labs index, so both put their rail in the exact same place. The rail child
 * must render a `nav` somewhere inside it (the stylesheet finds the column
 * through `:has(nav)`) and carries `visibleFrom="lg"` itself; the content
 * child wraps its page in `ShellContent`.
 */
export function Shell({ children }: ShellProps) {
    return <Box className={classes.shell}>{children}</Box>;
}

export interface ShellContentProps {
    children: React.ReactNode;
    /**
     * Give the body the same inset on both edges. For pages without a page
     * aside, which otherwise inherit the smaller right inset the docs keep
     * for theirs.
     */
    symmetric?: boolean;
}

/** The reading surface beside the rail, capped and inset like the docs body. */
export function ShellContent({ children, symmetric }: ShellContentProps) {
    const containerClass = symmetric
        ? `${classes.contentContainer} ${classes.contentContainerSymmetric}`
        : classes.contentContainer;

    return (
        <Stack gap={0}>
            <Group
                justify="center"
                align="flex-start"
                flex={1}
            >
                <Container
                    size="md"
                    flex={1}
                    miw={0}
                    className={containerClass}
                >
                    {children}
                </Container>
            </Group>
        </Stack>
    );
}
