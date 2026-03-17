import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import { getMarkdownScope, registerMarkdownComponents } from "~/utils/markdown";
import type { SurrealDBPageData } from "./+data";

export default function Page() {
    const { ast } = useData<SurrealDBPageData>();
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
