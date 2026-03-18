import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import { getMarkdownScope, registerMarkdownComponents } from "~/utils/markdown";
import type { IntegrationsPageData } from "./+data";

export default function Page() {
    const { ast } = useData<IntegrationsPageData>();

    return (
        <Box className="flag-markdown">
            <RenderMarkdown
                ast={ast}
                components={{ ...registerMarkdownComponents() }}
                rendererProps={{ jsx: "render" }}
                scope={getMarkdownScope()}
            />
        </Box>
    );
}
