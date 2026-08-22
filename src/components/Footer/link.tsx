import { Anchor, type AnchorProps } from "@mantine/core";
import type { PropsWithChildren } from "react";

interface FooterLinkProps extends PropsWithChildren<AnchorProps> {
    href: string;
}

/**
 * Footer link, matching the apex site exactly: 14px at weight 400 in the body
 * face, slate-4, no underline, brightening to full white on hover.
 */
export function FooterLink({ children, href, ...props }: FooterLinkProps) {
    const isExternal = href.startsWith("http");

    return (
        <Anchor
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer external" : undefined}
            fz={14}
            lh={1.55}
            c="slate.4"
            underline="never"
            {...props}
        >
            {children}
        </Anchor>
    );
}
