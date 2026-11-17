import { Image } from "@mantine/core";
import { MarkdownViewer, type MediaDescriptor } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { PageData } from "~/utils/data";
import { registerMarkdownComponents, resolveImageDescriptor } from "~/utils/markdown";
import classes from "./style.module.scss";

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
        radius: 0,
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

/**
 * Inline code holding an escaped pipe, rendered locally for one reason: the kit
 * takes inline code verbatim from the source, so a table cell's `\|`, which GFM
 * reads as a pipe even inside a code span, shows its backslash. Every escaped pipe
 * in inline code sits in a table row, where the escape is the only way to write
 * one. Any other code span returns `undefined` and keeps the kit's own renderer.
 * Remove this once @surrealdb/ui unescapes the pipe itself.
 */
function MarkdownInlineCode({ value }: { value: string }) {
    if (!value.includes("\\|")) return undefined;

    return <code className={classes.codeInline}>{value.replaceAll("\\|", "|")}</code>;
}

export function DocMarkdown() {
    const { content } = useData<PageData>();

    return (
        <MarkdownViewer
            className={classes.markdown}
            content={content}
            jsxMode="render"
            components={registerMarkdownComponents()}
            onResolveMedia={resolveImageDescriptor}
            renderers={{ image: MarkdownImage, inlineCode: MarkdownInlineCode }}
            fz={16}
            lh={1.5}
            p={0}
        />
    );
}
