// Populates the `links` edge: one relation per internal link, from the
// page holding it to the page it points at.
//
// Run after search:index, since the edge's endpoints are `page` records
// written by the indexer.
//
// Usage: bun run search:links

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { RecordId } from "surrealdb";
import { AGENTS } from "../../src/utils/agents";
import { connectDb } from "../src/db";
import { buildSlug, buildUrl, CONTENT_DIR, discoverCollections, walkMarkdown } from "./crawler";

/**
 * Links a component renders rather than the markdown spelling out, keyed by the
 * tag that triggers them. Without these, a page whose only route in is a
 * component-rendered list looks like an island: `<AgentPicker />` links all
 * seven editor guides at runtime, and nothing in the source says so.
 *
 * Counted as cards, because that is what the reader sees.
 */
const COMPONENT_LINKS: { tag: string; targets: () => string[] }[] = [
    { tag: "<AgentPicker", targets: () => AGENTS.map((a) => `/docs/agents/${a.id}`) },
];

/** A reader sees roughly this much of a page without scrolling. */
const FIRST_SCREEN_CHARS = 2000;

/** Characters past the fold at which a link is as buried as it can get. */
const SCROLL_SATURATION = 30000;

/** Both link forms the content uses: markdown, and JSX `href` on cards and table cells. */
const LINK_PATTERNS = [/\[([^\]]*)\]\((\/docs\/[^)\s]+)\)/g, /href="(?<none>)(\/docs\/[^"]+)"/g];

type LinkKind = "prose" | "card" | "table" | "list";

/**
 * Effort to notice a link, lowest is easiest. Cards and list entries are
 * navigation the reader is already scanning. A table row is a reference entry,
 * so its vertical position says nothing - the reader came to scan the table.
 * Only a prose link depends on reaching the sentence around it, so only prose
 * pays for depth.
 */
function weigh(kind: LinkKind, offsetChars: number): number {
    if (kind === "card") return 1;
    if (kind === "list") return 2;
    if (kind === "table") return 3;
    if (offsetChars < FIRST_SCREEN_CHARS) return 3;

    // Scale by how far past the fold the link sits, not by its proportion of the
    // page: 94% of a 2,400-character page is one scroll, and 94% of a 124,000-
    // character page is a different problem. Saturates at SCROLL_SATURATION so a
    // very long page cannot dominate the ranking on length alone.
    const past = offsetChars - FIRST_SCREEN_CHARS;
    return Number((4 + Math.min(4, (past / SCROLL_SATURATION) * 4)).toFixed(3));
}

interface Extracted {
    toUrl: string;
    text: string;
    kind: LinkKind;
    offsetRatio: number;
    offsetChars: number;
    firstScreen: boolean;
    anchor?: string;
}

/**
 * Where a link sits structurally, which matters more than where it sits
 * vertically: a card and a list entry are navigation, a table row is a
 * reference entry, and only a prose link depends on the reader having read
 * the sentence around it.
 */
function classify(body: string, index: number): LinkKind {
    const lineStart = body.lastIndexOf("\n", index) + 1;
    const line = body.slice(lineStart, body.indexOf("\n", index) + 1 || undefined);

    if (/^\s*\|/.test(line)) return "table";

    // An HTML table cell often puts the link on its own line, below the `<td>`,
    // so the tag is not on the link's line. Look back for an unclosed cell
    // rather than at the line alone.
    const cellContext = body.slice(Math.max(0, index - 300), index);
    const lastOpen = cellContext.lastIndexOf("<td");
    if (lastOpen >= 0 && !cellContext.slice(lastOpen).includes("</td>")) return "table";
    if (/^\s*[-*]\s/.test(line)) return "list";

    // A line that is nothing but links and separators is navigation written as a
    // sentence - "→ [A] · [B] · [C]". Counting it as prose would penalise it for
    // sitting far down a page, when a reader scanning headings sees it at once.
    // The test is what remains once the links are removed, not how many there are:
    // a sentence that happens to carry two links is still prose.
    const linkCount = (line.match(/\]\(\/docs\//g) ?? []).length;
    const residue = line.replace(/\[[^\]]*\]\([^)]*\)/g, "").replace(/[\s·|,→>*-]/g, "");
    if (linkCount >= 2 && residue.length <= 12) return "list";

    // A card's `href` sits on its own line inside an <IconBox> block, so look back
    // for the opening tag rather than at the line itself.
    const preceding = body.slice(Math.max(0, index - 400), index);
    if (/<IconBox\b[^>]*$/s.test(preceding) || /<IconBox\b(?![\s\S]*\/>)/.test(preceding))
        return "card";

    return "prose";
}

function extract(body: string): Extracted[] {
    const found: Extracted[] = [];
    const length = Math.max(body.length, 1);

    for (const { tag, targets } of COMPONENT_LINKS) {
        const at = body.indexOf(tag);
        if (at < 0) continue;
        for (const target of targets()) {
            found.push({
                toUrl: target,
                text: "",
                kind: "card",
                offsetRatio: Number((at / length).toFixed(4)),
                offsetChars: at,
                firstScreen: at < FIRST_SCREEN_CHARS,
            });
        }
    }

    for (const pattern of LINK_PATTERNS) {
        pattern.lastIndex = 0;
        let match = pattern.exec(body);
        while (match !== null) {
            const isMarkdown = match[0].startsWith("[");
            const text = isMarkdown ? (match[1] ?? "").trim() : "";
            const raw = (isMarkdown ? match[2] : match[2]) ?? "";
            const [path, anchor] = raw.split("#");
            found.push({
                toUrl: (path ?? "").replace(/\/$/, ""),
                text,
                kind: classify(body, match.index),
                offsetRatio: Number((match.index / length).toFixed(4)),
                offsetChars: match.index,
                firstScreen: match.index < FIRST_SCREEN_CHARS,
                anchor: anchor || undefined,
            });
            match = pattern.exec(body);
        }
    }

    return found;
}

async function main() {
    // Pass one: every page's URL and the record id the indexer gave it.
    const idByUrl = new Map<string, string>();
    const bodies: { pageId: string; body: string }[] = [];

    for (const collection of await discoverCollections()) {
        const collectionDir = join(CONTENT_DIR, collection);
        for await (const filePath of walkMarkdown(collectionDir)) {
            const slug = buildSlug(filePath, collectionDir);
            const pageId = `${collection}:${slug || "index"}`;
            idByUrl.set(buildUrl(collection, slug).replace(/\/$/, ""), pageId);
            const { content } = matter(await readFile(filePath, "utf-8"));
            bodies.push({ pageId, body: content });
        }
    }
    console.log(`[LK] ${idByUrl.size} pages`);

    // Pass two: resolve each link against those URLs.
    const db = await connectDb({ logging: true });
    await db.query("DELETE links").collect();

    let related = 0;
    const unresolved = new Map<string, number>();

    for (const { pageId, body } of bodies) {
        for (const link of extract(body)) {
            const toId = idByUrl.get(link.toUrl);
            if (!toId) {
                unresolved.set(link.toUrl, (unresolved.get(link.toUrl) ?? 0) + 1);
                continue;
            }
            // An `option<string>` field is `none | string`, and a JS null reaches the
            // server as NULL, so the coalesce keeps an absent anchor as NONE.
            await db
                .query(
                    `RELATE $from->links->$to SET
                        text = $text, kind = $kind,
                        offset_ratio = $ratio, offset_chars = $chars, first_screen = $screen, weight = $weight,
                        anchor = $anchor ?? NONE`,
                    {
                        from: new RecordId("page", pageId),
                        to: new RecordId("page", toId),
                        text: link.text,
                        kind: link.kind,
                        ratio: link.offsetRatio,
                        chars: link.offsetChars,
                        screen: link.firstScreen,
                        weight: weigh(link.kind, link.offsetChars),
                        anchor: link.anchor ?? null,
                    },
                )
                .collect();
            related += 1;
        }
    }

    console.log(`[LK] ${related} links related`);
    if (unresolved.size > 0) {
        console.log(`[LK] ${unresolved.size} link targets matched no page:`);
        for (const [url, count] of [...unresolved].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
            console.log(`       ${count}x ${url}`);
        }
    }

    await db.close();
}

main().catch((err) => {
    console.error("[FATAL]", err);
    process.exit(1);
});
