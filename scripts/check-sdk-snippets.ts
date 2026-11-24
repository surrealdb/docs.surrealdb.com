/**
 * Checks that the language tabs on the docs home page still match the quickstarts
 * they are taken from.
 *
 * The "Connect from your language" section of `src/content/index/index.mdx`
 * shows the first connection in each SDK's language, and each tab is a copy of
 * lines from that language's quickstart, which stays the full guide. A copy can
 * drift: the quickstart changes an API call or a default, and the docs home page
 * keeps the old lines. This check reads the tabs and fails when:
 *
 * - A line of code in a tab does not appear, after trimming its indentation, in
 *   a code block of any page the tab links to. The tab links to its quickstart
 *   and to the installation page that its install command comes from, and
 *   those pages are its sources. A line that only holds a comment is skipped.
 * - A tab links to no quickstart under `/docs/languages`.
 * - A quickstart has no tab, or a tab has no quickstart. The SDKs index and the
 *   community SDKs page are not quickstarts.
 *
 * It reads the repository only, so it needs no network and gives the same
 * answer every time. A tab can show fewer lines than its source, because a line
 * only has to exist there, but it cannot show a line the sources do not have.
 * To change a snippet, change the quickstart first and copy the lines across.
 *
 * Usage: bun scripts/check-sdk-snippets.ts
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pagesFor, readCollections, SITE } from "./lib/docs-pages.mjs";

const ROOT = join(import.meta.dir, "..");
const FRONT_PAGE = join(ROOT, "src/content/index/index.mdx");
const QUICKSTARTS = join(ROOT, "src/content/index/languages");
const NOT_QUICKSTARTS = new Set(["index", "community"]);

interface Tab {
    label: string;
    code: string[];
    links: string[];
}

/** The `<TabItem>`s of the language tabs on the docs home page. */
function readTabs(source: string): Tab[] {
    const group = source.match(/<Tabs syncKey="language">([\s\S]*?)<\/Tabs>/);

    if (!group) throw new Error('index.mdx has no <Tabs syncKey="language"> group.');

    return [...group[1].matchAll(/<TabItem label="([^"]+)">([\s\S]*?)<\/TabItem>/g)].map(
        ([, label, body]) => ({
            label,
            code: codeLines(body),
            links: [...body.matchAll(/\]\((\/docs\/[^)#\s]+)/g)].map((match) => match[1]),
        }),
    );
}

/** The lines inside fenced code blocks, trimmed, without blanks or comment-only lines. */
function codeLines(markdown: string): string[] {
    const lines: string[] = [];

    for (const [, block] of markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
        for (const raw of block.split("\n")) {
            const line = raw.trim();
            if (line) lines.push(line);
        }
    }

    return lines;
}

/** A line that holds only a comment, which a tab may add or leave out. */
function isComment(line: string): boolean {
    return line.startsWith("//") || /^#(\s|$)/.test(line);
}

function pageFiles(): Map<string, string> {
    const files = new Map<string, string>();

    for (const [id, prefix] of readCollections()) {
        for (const page of pagesFor(id, prefix)) {
            files.set(page.url.replace(SITE, ""), join(ROOT, page.file));
        }
    }

    return files;
}

function main(): number {
    const tabs = readTabs(readFileSync(FRONT_PAGE, "utf8"));
    const files = pageFiles();
    const problems: string[] = [];
    let checked = 0;

    for (const tab of tabs) {
        const sources = [...new Set(tab.links)].filter((link) => files.has(link));
        const known = new Set<string>();

        for (const link of sources) {
            for (const line of codeLines(readFileSync(files.get(link) as string, "utf8"))) {
                known.add(line);
            }
        }

        if (!tab.links.some((link) => link.startsWith("/docs/languages/"))) {
            problems.push(`${tab.label}: the tab links to no quickstart under /docs/languages.`);
        }

        for (const line of tab.code) {
            if (isComment(line)) continue;

            checked += 1;

            if (!known.has(line)) {
                problems.push(
                    `${tab.label}: \`${line}\` is not in ${sources.join(", ") || "any linked page"}.`,
                );
            }
        }
    }

    const linked = new Set(tabs.flatMap((tab) => tab.links));

    for (const file of readdirSync(QUICKSTARTS)) {
        const name = file.replace(/\.mdx?$/, "");

        if (NOT_QUICKSTARTS.has(name) || name === file) continue;

        if (!linked.has(`/docs/languages/${name}`)) {
            problems.push(
                `${relative(ROOT, join(QUICKSTARTS, file))}: no language tab links to this quickstart.`,
            );
        }
    }

    for (const tab of tabs) {
        for (const link of tab.links.filter((value) => value.startsWith("/docs/languages/"))) {
            if (!files.has(link)) problems.push(`${tab.label}: ${link} is not a page.`);
        }
    }

    if (problems.length > 0) {
        for (const problem of problems) console.error(`[sdk-snippets] ${problem}`);
        console.error(
            `[sdk-snippets] ${problems.length} problem${problems.length === 1 ? "" : "s"}. ` +
                "Change the quickstart first, then copy the lines to the tab.",
        );
        return 1;
    }

    console.log(
        `[sdk-snippets] ${tabs.length} tabs, ${checked} lines of code, every one found in a linked page`,
    );
    return 0;
}

process.exit(main());
