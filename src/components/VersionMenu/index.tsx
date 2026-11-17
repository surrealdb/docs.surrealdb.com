import { Button, Menu } from "@mantine/core";
import { Icon, iconCheck, iconChevronDown } from "@surrealdb/ui";
import { HEADER_CONTROL_SIZE } from "~/components/ColorSchemeToggle";
import { MAJOR_VERSIONS, selectMajorVersion, useMajorVersion } from "~/utils/major-version";

/**
 * Selects the SurrealDB major version the docs show. Pages keep one URL: each
 * renders the newest version on the server, and where an older one differs the
 * page holds both in tabs that this menu switches together. It also hides the
 * `<Since>` badges that the selected version makes redundant.
 */
export function VersionMenu() {
    const current = useMajorVersion();

    return (
        <Menu
            trigger="hover"
            transitionProps={{ transition: "scale-y" }}
        >
            <Menu.Target>
                <Button
                    variant="default"
                    h={HEADER_CONTROL_SIZE}
                    px="sm"
                    aria-label={`SurrealDB version: ${current.major}.x`}
                    rightSection={
                        <Icon
                            path={iconChevronDown}
                            size="sm"
                        />
                    }
                >
                    {`v${current.major}.x`}
                </Button>
            </Menu.Target>
            <Menu.Dropdown miw={170}>
                <Menu.Label>SurrealDB version</Menu.Label>
                {MAJOR_VERSIONS.map((version) => (
                    <Menu.Item
                        key={version.major}
                        onClick={() => selectMajorVersion(version)}
                        bdrs="xs"
                        leftSection={
                            <Icon
                                path={current.major === version.major ? iconCheck : ""}
                                size="sm"
                            />
                        }
                    >
                        {version.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}
