import { extractHeadings } from "@lib/markdown";
import { parseMarkdown } from "@surrealdb/ui";
import { resolveAstImages } from "./image-urls";

export function resolveMarkdown(markdown: string) {
    const ast = parseMarkdown(markdown);
    resolveAstImages(ast);

    const headings = extractHeadings(ast);

    if (ast.children[0]?.type === "heading" && ast.children[0].depth === 1) {
        ast.children = ast.children.slice(1);
    }

    return { ast, headings };
}
