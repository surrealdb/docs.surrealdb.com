import { ActionIcon, Flex } from "@mantine/core";
import {
    Icon,
    iconBrandBluesky,
    iconBrandDiscord,
    iconBrandGitHub,
    iconBrandX,
    iconBrandYouTube,
} from "@surrealdb/ui";
import { FooterLink } from "./link";

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
        <Flex
            component="footer"
            role="contentinfo"
            py="lg"
            align="center"
            justify="flex-start"
            gap={6}
            wrap="wrap"
            c="dimmed"
            fz="sm"
            fs="normal"
        >
            <FooterLink
                href="https://github.com/surrealdb"
                c="dimmed"
            >
                © SurrealDB 2026
            </FooterLink>
            {" | "}
            <Flex
                component="nav"
                aria-label="SurrealDB footer links"
                align="center"
                gap={16}
                wrap="wrap"
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
        </Flex>
    );
}
