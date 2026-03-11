import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { registerMarkdownComponents } from "@util/markdown";
import { useData } from "vike-react/useData";
import type { CloudPageData } from "./+data";

export default function Page() {
    const { ast } = useData<CloudPageData>();
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
