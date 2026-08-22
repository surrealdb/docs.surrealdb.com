import { MarkdownViewer } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { PageData } from "~/utils/data";
import { registerMarkdownComponents, resolveImageDescriptor } from "~/utils/markdown";

export function DocMarkdown() {
    const { content } = useData<PageData>();

    return (
        <MarkdownViewer
            content={content}
            jsxMode="render"
            components={registerMarkdownComponents()}
            onResolveMedia={resolveImageDescriptor}
            fz={17}
            lh={1.5}
            p={0}
        />
    );
}
