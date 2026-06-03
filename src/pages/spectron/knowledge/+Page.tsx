import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { PageData } from "~/utils/data";
import { getMarkdownScope, registerMarkdownComponents } from "~/utils/markdown";

export default function Page() {
    const { ast } = useData<PageData>();

    return (
        <Box className="flag-markdown">
            <RenderMarkdown
                ast={ast}
                rendererProps={{ jsx: "render" }}
                components={registerMarkdownComponents()}
                scope={getMarkdownScope()}
            />
        </Box>
    );
}
