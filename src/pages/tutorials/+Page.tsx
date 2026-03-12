import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import { registerMarkdownComponents } from "~/utils/markdown";
import type { TutorialsPageData } from "./+data";

export default function Page() {
    const { ast } = useData<TutorialsPageData>();
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
