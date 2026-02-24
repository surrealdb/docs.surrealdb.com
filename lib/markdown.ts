// lib/markdown.ts

import { type Root, visit } from "@surrealdb/ui";
import { slug } from "github-slugger";

export interface HeadingData {
    id: string;
    text: string;
    depth: 1 | 2 | 3 | 4 | 5 | 6;
}

export function extractHeadings(ast: Root): HeadingData[] {
    const headings: HeadingData[] = [];

    visit(ast, "heading", ({ children, depth }) => {
        const parts: string[] = [];

        for (const child of children) {
            if (child.type === "text") {
                parts.push(child.value);
            } else if (child.type === "inlineCode") {
                parts.push(child.value);
            }
        }

        const text = parts.join("");
        const id = slug(text);

        headings.push({
            id,
            text,
            depth,
        });
    });

    return headings;
}
