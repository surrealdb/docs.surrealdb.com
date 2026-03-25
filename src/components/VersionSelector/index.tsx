import { Box, Menu, Text, UnstyledButton } from "@mantine/core";
import { Icon, iconCheck, iconChevronDown } from "@surrealdb/ui";
import {
    getVersionLabel,
    getVersionUrl,
    type Sdk,
    type SdkVersion,
    versionedSdks,
} from "~/content/config";
import classes from "./style.module.scss";

interface VersionSelectorProps {
    sdk: Sdk;
    currentVersion: SdkVersion;
}

function sdkDisplayName(sdk: Sdk): string {
    const names: Partial<Record<Sdk, string>> = {
        javascript: "JS",
        python: "Python",
        java: "Java",
    };
    return names[sdk] ?? sdk;
}

export function VersionSelector({ sdk, currentVersion }: VersionSelectorProps) {
    const config = versionedSdks[sdk];
    if (!config) return null;

    const label = getVersionLabel(sdk, currentVersion);
    const allVersions = [config.latest, ...config.versions];

    return (
        <Box>
            <Text
                tt="uppercase"
                fz={11}
                fw={700}
                c="dimmed"
                mb={6}
            >
                {sdkDisplayName(sdk)} SDK Version
            </Text>
            <Menu
                width="target"
                position="bottom-start"
            >
                <Menu.Target>
                    <UnstyledButton className={classes.trigger}>
                        <Text
                            fw={500}
                            fz="sm"
                        >
                            {label}
                        </Text>
                        <Icon path={iconChevronDown} />
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown className={classes.dropdown}>
                    <Menu.Label>Latest</Menu.Label>
                    <Menu.Item
                        component="a"
                        href={getVersionUrl(sdk, "latest")}
                        leftSection={
                            currentVersion === "latest" ? (
                                <Icon
                                    path={iconCheck}
                                    size="sm"
                                />
                            ) : (
                                <Box w={16} />
                            )
                        }
                        className={currentVersion === "latest" ? classes.activeItem : undefined}
                    >
                        Latest
                    </Menu.Item>
                    <Menu.Label>SDK Versions</Menu.Label>
                    {allVersions.map((version) => (
                        <Menu.Item
                            key={version}
                            component="a"
                            href={getVersionUrl(sdk, version)}
                            leftSection={
                                currentVersion === version ? (
                                    <Icon
                                        path={iconCheck}
                                        size="sm"
                                    />
                                ) : (
                                    <Box w={16} />
                                )
                            }
                            className={currentVersion === version ? classes.activeItem : undefined}
                        >
                            {version}
                        </Menu.Item>
                    ))}
                </Menu.Dropdown>
            </Menu>
        </Box>
    );
}
