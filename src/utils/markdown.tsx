import {
    extractHeadings,
    type MarkdownComponents,
    type MediaDescriptor,
    markdownSourceFromString,
    mergeMarkdownComponents,
    parseMarkdownTree,
} from "@surrealdb/ui";
import { Boxes } from "~/components/Boxes";
import { Edition } from "~/components/Edition";
import { IconBox } from "~/components/IconBox";
import { Version } from "~/components/Version";
import { getIconScope } from "~/lib/icon-scope";
import { getImageUrl } from "./image-urls";

export type DocHeading = ReturnType<typeof extractHeadings>[number];

// Same pattern as @surrealdb/ui CodeBlock: strip leading language-test block comments.
const LANGUAGE_TEST_COMMENT =
    /^(?:[ \t]*\r?\n)*(?:\/\*\*([\s\S]*?)\*\/(?:[ \t]*\r?\n)*)?([ \t]*[^\r\n][\s\S]*)$/;

const FENCED_CODE_BLOCK = /(```[^\n]*\n)([\s\S]*?)(```)/g;

function stripLanguageTestComment(code: string): string {
    const match = code.match(LANGUAGE_TEST_COMMENT);
    if (!match) {
        return code;
    }

    return match[2] ?? code;
}

function stripLanguageTestComments(markdown: string): string {
    return markdown.replace(FENCED_CODE_BLOCK, (_match, fence, body, closing) => {
        return `${fence}${stripLanguageTestComment(body)}${closing}`;
    });
}

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

/** Quote `light` / `dark` keys inside `icon={{ … }}` so the value is valid JSON. */
function quoteIconObjectKeys(markdown: string): string {
    return markdown.replace(/icon=\{\{([\s\S]*?)\}\}/g, (_match, inner: string) => {
        const quoted = inner.replace(/\b(light|dark)\s*:/g, '"$1":');
        return `icon={{${quoted}}}`;
    });
}

/** Replace icon scope identifiers with quoted URL strings for JSX JSON attributes. */
function injectIconScope(markdown: string): string {
    const scope = getIconScope();
    let result = quoteIconObjectKeys(markdown);

    for (const [name, url] of Object.entries(scope)) {
        if (typeof url !== "string") continue;
        result = result.replace(new RegExp(`\\b${name}\\b`, "g"), JSON.stringify(url));
    }

    return result;
}

export function resolveMarkdown(markdown: string) {
    const content = injectIconScope(stripLanguageTestComments(stripLeadingH1(markdown)));
    const tree = parseMarkdownTree(content);
    const source = markdownSourceFromString(content);
    const headings = extractHeadings(tree, source);

    return { content, headings };
}

export function resolveImageDescriptor(node: MediaDescriptor): MediaDescriptor {
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
        Version: { component: Version },
    });
}
