import { Details as KitDetails, MarkdownContent } from "@surrealdb/ui";
import type { ReactNode } from "react";

export interface DetailsProps {
    /** The line a reader clicks to open the block. */
    summary?: string;
    /** The markdown inside, such as a long code fence. */
    children?: ReactNode;
}

/**
 * The kit's collapsible block, with its summary taken from an attribute so that
 * a page can write `<Details summary="…">` around a code fence. It renders a
 * native `<details>` element, so it opens without JavaScript, and its content is
 * in the page while closed for search and the browser's find.
 */
export function Details({ summary = "Show details", children }: DetailsProps) {
    return (
        <KitDetails my="md">
            <KitDetails.Summary>{summary}</KitDetails.Summary>
            <MarkdownContent>{children}</MarkdownContent>
        </KitDetails>
    );
}
