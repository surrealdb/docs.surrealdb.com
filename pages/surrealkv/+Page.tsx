import { Box } from "@mantine/core";
import { RenderMarkdown } from "@surrealdb/ui";
import { useData } from "vike-react/useData";
import type { SurrealKVPageData } from "./+data";

export default function Page() {
    const { ast } = useData<SurrealKVPageData>();
    return (
        <Box className="flag-markdown">
            <RenderMarkdown ast={ast} />
        </Box>
    );
}
