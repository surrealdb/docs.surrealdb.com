import { parseMarkdown, SurrealistMini } from "@surrealdb/ui";
import { Boxes } from "~/components/Boxes";
import { ContentTabItem, ContentTabs } from "~/components/ContentTabs";
import { IconBox } from "~/components/IconBox";
import { Version } from "~/components/Version";
import { getIconScope } from "~/lib/icon-scope";
import { extractHeadings } from "~/lib/markdown";
import { resolveAstImages } from "./image-urls";

export function resolveMarkdown(markdown: string) {
    const ast = parseMarkdown(markdown);

    resolveAstImages(ast);
    const headings = extractHeadings(ast);

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
    };
}

export function getMarkdownScope(): Record<string, unknown> {
    return getIconScope();
}
