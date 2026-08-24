import { Image } from "@mantine/core";
import { MarkdownViewer, type MediaDescriptor } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { PageData } from "~/utils/data";
import { registerMarkdownComponents, resolveImageDescriptor } from "~/utils/markdown";

/**
 * Content images, rendered locally instead of by the viewer for one reason:
 * the kit's image renderer drops the `alt` attribute, so every informative
 * diagram in the docs read as decorative to a screen reader even though the
 * markdown source carries proper alt text. Same themed light/dark pairing,
 * with the description kept.
 */
function MarkdownImage(node: MediaDescriptor) {
    const resolved = resolveImageDescriptor(node);
    const shared = {
        alt: resolved.alt ?? "",
        title: resolved.title,
        radius: "md",
        maw: "100%",
        my: "md",
    } as const;

    if (!resolved.darkSrc) {
        return (
            <Image
                src={resolved.src}
                {...shared}
            />
        );
    }

    return (
        <>
            <Image
                src={resolved.src}
                darkHidden
                {...shared}
            />
            <Image
                src={resolved.darkSrc}
                lightHidden
                {...shared}
            />
        </>
    );
}

export function DocMarkdown() {
    const { content } = useData<PageData>();

    return (
        <MarkdownViewer
            content={content}
            jsxMode="render"
            components={registerMarkdownComponents()}
            onResolveMedia={resolveImageDescriptor}
            renderers={{ image: MarkdownImage }}
            fz={17}
            lh={1.5}
            p={0}
        />
    );
}
