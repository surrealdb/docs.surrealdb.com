import { Box } from "@mantine/core";
import { MarkdownViewer } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { PageData } from "~/utils/data";
import { registerMarkdownComponents, resolveImageDescriptor } from "~/utils/markdown";

export function DocMarkdown() {
    const { content } = useData<PageData>();

    return (
        <Box className="flag-markdown">
            <MarkdownViewer
                content={content}
                jsxMode="render"
                components={registerMarkdownComponents()}
                onImage={resolveImageDescriptor}
                p={0}
            />
        </Box>
    );
}
