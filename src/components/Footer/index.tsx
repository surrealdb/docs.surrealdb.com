import { ActionIcon, Box, Flex } from "@mantine/core";
import {
    Icon,
    iconBrandBluesky,
    iconBrandDiscord,
    iconBrandGitHub,
    iconBrandX,
    iconBrandYouTube,
} from "@surrealdb/ui";
import { FooterLink } from "./link";
import classes from "./style.module.scss";

const links = [
    {
        label: "Contributing",
        href: "https://github.com/surrealdb/docs.surrealdb.com/blob/main/README.md#contributing-to-the-documentation",
    },
    {
        label: "Open Source",
        href: "/opensource",
    },
];

export function Footer() {
    return (
        <Box
            component="footer"
            role="contentinfo"
            py="lg"
            className={classes.root}
        >
            <Box className={classes.inner}>
                <FooterLink href="https://github.com/surrealdb">© SurrealDB 2026</FooterLink>
                <Box
                    component="span"
                    className={classes.separator}
                >
                    {" | "}
                </Box>
                <Flex
                    component="nav"
                    aria-label="SurrealDB footer links"
                    align="center"
                    gap={16}
                    flex={1}
                >
                    {links.map((link) => (
                        <FooterLink
                            key={link.label}
                            href={link.href}
                        >
                            {link.label}
                        </FooterLink>
                    ))}
                </Flex>
                <Box className={classes.socials}>
                    <ActionIcon
                        component="a"
                        rel="noopener noreferrer"
                        href="https://www.youtube.com/@surrealdb"
                        target="_blank"
                        aria-label="YouTube"
                    >
                        <Icon path={iconBrandYouTube} />
                    </ActionIcon>
                    <ActionIcon
                        component="a"
                        rel="noopener noreferrer"
                        href="https://x.com/surrealdb"
                        target="_blank"
                        aria-label="Twitter"
                    >
                        <Icon path={iconBrandX} />
                    </ActionIcon>
                    <ActionIcon
                        component="a"
                        rel="noopener noreferrer"
                        href="https://github.com/surrealdb"
                        target="_blank"
                        aria-label="Github"
                    >
                        <Icon path={iconBrandGitHub} />
                    </ActionIcon>
                    <ActionIcon
                        component="a"
                        rel="noopener noreferrer"
                        href="https://discord.gg/surrealdb"
                        target="_blank"
                        aria-label="Discord"
                    >
                        <Icon path={iconBrandDiscord} />
                    </ActionIcon>
                    <ActionIcon
                        component="a"
                        rel="noopener noreferrer"
                        href="https://bsky.app/profile/surrealdb.com"
                        target="_blank"
                        aria-label="Bluesky"
                    >
                        <Icon path={iconBrandBluesky} />
                    </ActionIcon>
                </Box>
            </Box>
        </Box>
    );
}
