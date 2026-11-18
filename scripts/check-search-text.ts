/**
 * Checks that the search crawler extracts the text of the docs, so that search
 * matches what a page says and not only its title and description.
 *
 * The crawler reads text out of the markdown syntax tree, and the parser gives
 * plain text no node of its own: it is the source between a node's children.
 * Code that collects text nodes therefore collects nothing, and every page is
 * indexed with no content and no sections, while the index still builds and
 * search still answers. This check fails on that:
 *
 * - a fixed markdown sample must extract to the exact text below, which covers
 *   emphasis, inline code, a link, a list, an inline tag and a JSX block;
 * - every page `crawl` yields must have some text.
 *
 * It reads the repository only.
 *
 * Usage: bun scripts/check-search-text.ts
 */

import { crawl, markdownToPlainText } from "../search/scripts/crawler";

const SAMPLE = `## Heading

Some *emphasised* text with \`inline code\` and a [link](/docs/learn).

- First item
- Second<br/>item

<Tabs>
<TabItem label="Hidden">

Text inside a tab.

</TabItem>
</Tabs>
`;

const EXPECTED = [
    "Heading",
    "Some emphasised text with inline code and a link.",
    "First item Second item",
    "Text inside a tab.",
].join("\n\n");

const problems: string[] = [];

const actual = markdownToPlainText(SAMPLE);
if (actual !== EXPECTED) {
    problems.push(
        `The sample extracts to:\n${JSON.stringify(actual)}\nbut should extract to:\n${JSON.stringify(EXPECTED)}`,
    );
}

let pages = 0;
let sections = 0;
for await (const entry of crawl()) {
    if (entry.kind === "page") {
        pages++;
        if (!entry.content.trim()) problems.push(`${entry.url} has no text in the index`);
    } else {
        sections++;
    }
}

for (const problem of problems) console.error(problem);
console.log(
    `[search] ${pages} pages and ${sections} sections crawled, ${problems.length} problems`,
);

if (problems.length > 0) process.exit(1);
