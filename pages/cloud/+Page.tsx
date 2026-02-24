import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { CloudPageData } from "./+data";

export default function Page() {
    const { ast } = useData<CloudPageData>();
    return (
        <Box className="flag-markdown">
            <RenderMarkdown ast={ast} />
        </Box>
    );
}
