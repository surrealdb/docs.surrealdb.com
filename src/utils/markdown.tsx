import { parseMarkdown, RailroadDiagram, SurrealistMini, visit } from "@surrealdb/ui";
import Slugger from "github-slugger";
import type { Root } from "mdast";
import { Boxes } from "~/components/Boxes";
import { ContentTabItem, ContentTabs } from "~/components/ContentTabs";
import { IconBox } from "~/components/IconBox";
import { Version } from "~/components/Version";
import { getIconScope } from "~/lib/icon-scope";
import { resolveAstImages } from "./image-urls";

interface HeadingData {
    id: string;
    text: string;
    depth: 1 | 2 | 3 | 4 | 5 | 6;
}

function extractHeadings(ast: Root): HeadingData[] {
    const slugger = new Slugger();
    const headings: HeadingData[] = [];

    visit(ast, "heading", ({ children, depth }) => {
        const parts: string[] = [];
        for (const child of children) {
            if (child.type === "text" || child.type === "inlineCode") {
                parts.push(child.value);
            }
        }
        const text = parts.join("");
        headings.push({ id: slugger.slug(text), text, depth });
    });

    return headings;
}

export function resolveMarkdown(markdown: string) {
    const ast = parseMarkdown(markdown);
    const headings = extractHeadings(ast);

    resolveAstImages(ast);

    return { ast, headings };
}

export function registerMarkdownComponents() {
    return {
        SurrealistMini: ({ query, url }: { query?: string; url?: string }) => {
            return <SurrealistMini config={{ query, url }} />;
        },
        Version: (props: { sdk?: string; prefix?: string }) => <Version {...props} />,
        IconBox,
        Boxes,
        Tabs: ContentTabs,
        TabItem: ContentTabItem,
        RailroadDiagram: (props: { ast: string }) => (
            <RailroadDiagram
                {...props}
                ast={JSON.parse(props.ast)}
            />
        ),
    };
}

export function getMarkdownScope(): Record<string, unknown> {
    return getIconScope();
}
