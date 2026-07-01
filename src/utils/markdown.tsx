import {
    extractHeadings,
    type ImageDescriptor,
    type MarkdownComponents,
    markdownSourceFromString,
    mergeMarkdownComponents,
    parseMarkdownTree,
} from "@surrealdb/ui";
import { Boxes } from "~/components/Boxes";
import { Edition } from "~/components/Edition";
import { IconBox } from "~/components/IconBox";
import { getIconScope } from "~/lib/icon-scope";
import { getImageUrl } from "./image-urls";

export type DocHeading = ReturnType<typeof extractHeadings>[number];

function stripLeadingH1(markdown: string): string {
    const tree = parseMarkdownTree(markdown);
    const source = markdownSourceFromString(markdown);
    const first = tree.topNode.firstChild;

    if (!first?.name.startsWith("ATXHeading")) {
        return markdown;
    }

    const level = Number.parseInt(first.name.slice("ATXHeading".length), 10);
    if (level !== 1) {
        return markdown;
    }

    const line = source.lineAt(first.from);
    return source.slice(line.to, source.length).replace(/^\n+/, "");
}

/** Replace icon scope identifiers with quoted URL strings for JSX JSON attributes. */
function injectIconScope(markdown: string): string {
    const scope = getIconScope();
    let result = markdown;

    for (const [name, url] of Object.entries(scope)) {
        if (typeof url !== "string") continue;
        result = result.replace(new RegExp(`\\b${name}\\b`, "g"), JSON.stringify(url));
    }

    return result;
}

export function resolveMarkdown(markdown: string) {
    const content = injectIconScope(stripLeadingH1(markdown));
    const tree = parseMarkdownTree(content);
    const source = markdownSourceFromString(content);
    const headings = extractHeadings(tree, source);

    return { content, headings };
}

export function resolveImageDescriptor(node: ImageDescriptor): ImageDescriptor {
    if (node.src.startsWith("@ui/")) {
        const resolved = getImageUrl(node.src);

        return {
            ...node,
            src: resolved ?? node.src,
            darkSrc: undefined,
        };
    }

    return {
        ...node,
        src: getImageUrl(node.src) ?? node.src,
        darkSrc: node.darkSrc ? (getImageUrl(node.darkSrc) ?? node.darkSrc) : node.darkSrc,
    };
}

export function registerMarkdownComponents(): MarkdownComponents {
    return mergeMarkdownComponents({
        IconBox: { component: IconBox, block: true },
        Boxes: { component: Boxes, block: true, preserveNewlines: false },
        Edition: { component: Edition },
    });
}
