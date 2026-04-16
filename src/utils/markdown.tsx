import { extractHeaders, parseMarkdown, RailroadDiagram, SurrealistMini } from "@surrealdb/ui";
import { Boxes } from "~/components/Boxes";
import { ContentTabItem, ContentTabs } from "~/components/ContentTabs";
import { IconBox } from "~/components/IconBox";
import { Version } from "~/components/Version";
import { getIconScope } from "~/lib/icon-scope";
import { resolveAstImages } from "./image-urls";

export function resolveMarkdown(markdown: string) {
    const ast = parseMarkdown(markdown);

    if (ast.children[0]?.type === "heading" && ast.children[0].depth === 1) {
        ast.children.shift();
    }

    const headings = extractHeaders(ast);

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
    return {
        ...getIconScope(),
    };
}
