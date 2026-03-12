import { Box } from "@mantine/core";
import { RenderMarkdown, type Root } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import { registerMarkdownComponents } from "~/utils/markdown";
import type { IntegrationsPageData } from "./+data";

function _Render({ ast }: { ast: Root }) {
    return (
        <RenderMarkdown
            ast={ast}
            components={{ ...registerMarkdownComponents() }}
            rendererProps={{ jsx: "render" }}
        />
    );
}

export default function Page() {
    const { ast } = useData<IntegrationsPageData>();

    return (
        <Box className="flag-markdown">
            <RenderMarkdown
                ast={ast}
                components={{ ...registerMarkdownComponents() }}
                rendererProps={{ jsx: "render" }}
            />
        </Box>
    );
}
