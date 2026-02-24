import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { SurrealistPageData } from "./+data";

export default function Page() {
    const { ast } = useData<SurrealistPageData>();
    return (
        <Box className="flag-markdown">
            <RenderMarkdown ast={ast} />
        </Box>
    );
}
