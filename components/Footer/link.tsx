import { Anchor, type AnchorProps } from "@mantine/core";
import type { PropsWithChildren } from "react";

interface FooterLinkProps extends PropsWithChildren<AnchorProps> {
    href: string;
}

export function FooterLink({ children, href, ...props }: FooterLinkProps) {
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
