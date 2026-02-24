import { ActionIcon, Anchor, type AnchorProps, Container, Flex } from "@mantine/core";
import {
    Icon,
    iconBrandBluesky,
    iconBrandDiscord,
    iconBrandGitHub,
    iconBrandX,
    iconBrandYouTube,
    Spacer,
} from "@surrealdb/ui";
import type { PropsWithChildren } from "react";

interface FooterLinkProps extends PropsWithChildren<AnchorProps> {
    href: string;
}

function FooterLink({ children, href, ...props }: FooterLinkProps) {
    const isExternal = href.startsWith("http");
    return (
        <Anchor
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer external" : undefined}
            c="white"
            fz={12}
            {...props}
        >
            {children}
        </Anchor>
    );
}

export function Footer() {
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

    return (
        <Flex
            component="footer"
            role="contentinfo"
            p="lg"
            align="center"
            justify="flex-start"
            gap={6}
            wrap="wrap"
            c="obsidian.4"
            fz="sm"
            fs="normal"
            mt="auto"
            w="100%"
        >
            <FooterLink
                href="https://github.com/surrealdb"
                c="obsidian.4"
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
                <Icon
                    path={iconBrandYouTube}
                    style={{ fill: "white" }}
                />
            </ActionIcon>
            <ActionIcon
                component="a"
                rel="noopener noreferrer"
                href="https://x.com/surrealdb"
                target="_blank"
                aria-label="Twitter"
            >
                <Icon
                    path={iconBrandX}
                    style={{ fill: "white" }}
                />
            </ActionIcon>
            <ActionIcon
                component="a"
                rel="noopener noreferrer"
                href="https://github.com/surrealdb"
                target="_blank"
                aria-label="Github"
            >
                <Icon
                    path={iconBrandGitHub}
                    style={{ fill: "white" }}
                />
            </ActionIcon>
            <ActionIcon
                component="a"
                rel="noopener noreferrer"
                href="https://discord.gg/surrealdb"
                target="_blank"
                aria-label="Discord"
            >
                <Icon
                    path={iconBrandDiscord}
                    style={{ fill: "white" }}
                />
            </ActionIcon>
            <ActionIcon
                component="a"
                rel="noopener noreferrer"
                href="https://bsky.app/profile/surrealdb.com"
                target="_blank"
                aria-label="Bluesky"
            >
                <Icon
                    path={iconBrandBluesky}
                    style={{ fill: "white" }}
                />
            </ActionIcon>
        </Flex>
    );
}
