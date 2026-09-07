import {
    extractHeadings,
    type MarkdownComponents,
    type MediaDescriptor,
    markdownSourceFromString,
    mergeMarkdownComponents,
    parseMarkdownTree,
} from "@surrealdb/ui";
import { AgentBanner } from "~/components/AgentBanner";
import { AgentPicker } from "~/components/AgentPicker";
import { AgentPrompt } from "~/components/AgentPrompt";
import { Boxes } from "~/components/Boxes";
import { CodeWithOutput } from "~/components/CodeWithOutput";
import { Edition } from "~/components/Edition";
import { IconBox } from "~/components/IconBox";
import { OptionsTable } from "~/components/OptionsTable";
import { Since } from "~/components/Since";
import { Synopsis } from "~/components/Synopsis";
import { Version } from "~/components/Version";
import { VersionBlock } from "~/components/VersionBlock";
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

export function stripLanguageTestComments(markdown: string): string {
    return markdown.replace(FENCED_CODE_BLOCK, (_match, fence, body, closing) => {
        return `${fence}${stripLanguageTestComment(body)}${closing}`;
    });
}

export function stripLeadingH1(markdown: string): string {
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

const SYNOPSIS_BLOCK = /<Synopsis((?:\s[^>]*)?)>([\s\S]*?)<\/Synopsis>/g;

/** Remove blank leading/trailing lines and the common indentation of a block body. */
function dedent(body: string): string {
    const lines = body.split("\n");

    while (lines.length > 0 && (lines[0] ?? "").trim() === "") {
        lines.shift();
    }

    while (lines.length > 0 && (lines[lines.length - 1] ?? "").trim() === "") {
        lines.pop();
    }

    const indents = lines
        .filter((line) => line.trim() !== "")
        .map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0);

    const indent = indents.length > 0 ? Math.min(...indents) : 0;
    return lines.map((line) => line.slice(indent).trimEnd()).join("\n");
}

/**
 * Move the body of a `<Synopsis>` block into its `command` attribute.
 *
 * Component children are parsed as inline markdown, which eats the notation a usage
 * line depends on: `[NAME]` loses its brackets and `<TYPE>` is dropped as an unknown
 * tag. Attribute values are never parsed as markdown, so the body is relocated before
 * the document is parsed and reaches the renderer verbatim.
 */
function inlineSynopsisCommands(markdown: string): string {
    return markdown.replace(SYNOPSIS_BLOCK, (match, attributes: string, body: string) => {
        if (/\bcommand\s*=/.test(attributes)) {
            return match;
        }

        const command = dedent(body);
        if (command === "") {
            return match;
        }

        return `<Synopsis${attributes} command={${JSON.stringify(command)}} />`;
    });
}

/**
 * A fence title that marks the block as the result of the block above it.
 *
 * `output` matches anywhere in the title, because a qualifier carries information a
 * bare label cannot: `Sample output` and `Possible output` say the value shown is one
 * of several the reader might see, from a generated record id, a datetime or a live
 * API. `Response` and `Result` have to be anchored, because several code blocks are
 * titled for what they do with a response - `Handle Individual Responses`,
 * `Map results onto a dataclass` - and pairing one of those would attach a second
 * example to the first as though it were its output.
 */
const OUTPUT_TITLE = /\btitle="(?:[^"]*\boutput\b[^"]*|(?:Response|Result)\b[^"]*)"/i;

/** Opening fence marker of a line, or `null` when the line does not open a fence. */
function fenceMarker(line: string): string | null {
    return line.match(/^(`{3,}|~{3,})/)?.[1] ?? null;
}

/** Index of the closing fence line, and whether the fence closed at all. */
function readFence(
    lines: string[],
    open: number,
    marker: string,
): { end: number; unterminated: boolean } {
    const closing = new RegExp(`^${marker[0] === "`" ? "`" : "~"}{${marker.length},}\\s*$`);

    for (let i = open + 1; i < lines.length; i++) {
        if (closing.test(lines[i] ?? "")) {
            return { end: i, unterminated: false };
        }
    }

    return { end: lines.length - 1, unterminated: true };
}

/**
 * Wrap a code fence and the output fence that follows it in `<CodeWithOutput>`, so the
 * pair renders as one block with a divider rather than as two separate blocks.
 *
 * Both fences still render through the viewer's own code path - the wrapper only
 * supplies the surrounding chrome - so a paired block is highlighted and spaced like
 * every other fence on the page, and its copy button still yields the code alone.
 *
 * The pairing is deliberately confined to the render path. `composeRawMarkdown` shares
 * only the strip passes, so the `.md` endpoints and `llms-full.txt` keep the two fences
 * an agent can tell apart: runnable code in one, the result it produces in the other.
 */
export function wrapOutputPairs(markdown: string): string {
    const lines = markdown.split("\n");
    const out: string[] = [];
    let i = 0;

    while (i < lines.length) {
        const marker = fenceMarker(lines[i] ?? "");

        if (!marker) {
            out.push(lines[i] ?? "");
            i++;
            continue;
        }

        const code = readFence(lines, i, marker);
        const gap = (lines[code.end + 1] ?? "").trim() === "" ? 1 : 0;
        const outputOpen = code.end + 1 + gap;
        const outputMarker = fenceMarker(lines[outputOpen] ?? "");
        const output = outputMarker === null ? null : readFence(lines, outputOpen, outputMarker);

        const pairs =
            !code.unterminated &&
            output !== null &&
            !output.unterminated &&
            !OUTPUT_TITLE.test(lines[i] ?? "") &&
            OUTPUT_TITLE.test(lines[outputOpen] ?? "");

        if (!pairs || output === null) {
            out.push(...lines.slice(i, code.end + 1));
            i = code.end + 1;
            continue;
        }

        out.push(
            "<CodeWithOutput>",
            "",
            ...lines.slice(i, code.end + 1),
            "",
            ...lines.slice(outputOpen, output.end + 1),
            "",
            "</CodeWithOutput>",
        );
        i = output.end + 1;
    }

    return out.join("\n");
}

export function resolveMarkdown(markdown: string) {
    const content = injectIconScope(
        inlineSynopsisCommands(
            wrapOutputPairs(stripLanguageTestComments(stripLeadingH1(markdown))),
        ),
    );
    const tree = parseMarkdownTree(content);
    const source = markdownSourceFromString(content);
    const headings = alignHeadingIds(extractHeadings(tree, source));

    return { content, headings };
}

/**
 * Makes the page aside agree with the rendered DOM about heading ids.
 *
 * `extractHeadings` suffixes repeated slugs (`arguments`, `arguments-1`, ...)
 * but `MarkdownViewer` renders every repeat with the plain slug, so on a page
 * whose sections repeat (an SDK method page has one "Arguments" per variant)
 * the aside linked ids that exist nowhere - dozens of dead anchors per page.
 * Until the kit suffixes both sides, the aside uses the id the DOM actually
 * has; a repeated section's link lands on the first occurrence.
 */
function alignHeadingIds(headings: DocHeading[]): DocHeading[] {
    const ids = new Set(headings.map((h) => h.id));

    return headings.map((heading) => {
        const base = heading.id.replace(/-\d+$/, "");

        return base !== heading.id && ids.has(base) ? { ...heading, id: base } : heading;
    });
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
        AgentBanner: { component: AgentBanner, block: true },
        AgentPicker: { component: AgentPicker, block: true },
        AgentPrompt: { component: AgentPrompt, block: true },
        IconBox: { component: IconBox, block: true },
        Boxes: { component: Boxes, block: true, preserveNewlines: false },
        CodeWithOutput: { component: CodeWithOutput, block: true, preserveNewlines: false },
        Synopsis: { component: Synopsis, block: true },
        OptionsTable: { component: OptionsTable, block: true },
        Edition: { component: Edition },
        // Overrides the kit's Since: markdown puts the badge inside <p>, and
        // the kit's renders a div there, which breaks hydration site-wide.
        Since: { component: Since },
        Version: { component: Version },
        VersionBlock: { component: VersionBlock, block: true },
    });
}
