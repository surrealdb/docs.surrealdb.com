import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { registerMarkdownComponents } from "@util/markdown";
import { useData } from "vike-react/useData";
import type { SurrealistPageData } from "./+data";

export default function Page() {
    const { ast } = useData<SurrealistPageData>();
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
