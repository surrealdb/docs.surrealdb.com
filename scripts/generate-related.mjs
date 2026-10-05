/**
 * Builds `src/data/related.json`: for each documentation page, the SurrealDB
 * University lessons and blog posts that cover the same subject.
 *
 * The file is committed rather than built on every deploy. A new pairing then
 * shows up in a pull request diff, where a reviewer can judge it, and a wrong
 * one can be removed in `src/data/related-overrides.json` without changing the
 * scoring.
 *
 * A pairing is the TF-IDF cosine similarity between the docs page and the best
 * matching section of the lesson or post, at or above `MIN_SIMILARITY`. Scoring
 * whole items paired pages with long book chapters that only shared vocabulary;
 * scoring sections pairs `BEGIN` with the chapter section on transactions. The
 * matched section's heading is kept in the output, so a reviewer can see why a
 * pair was made and the page can show it. Lexical scoring still makes mistakes,
 * which is what the committed file and the overrides are for.
 *
 * Blog posts published before 3.0.0 are left out unless listed in the
 * overrides, because most of them show syntax that has since changed, and a
 * link from a current page lends them an authority they no longer have.
 *
 * Every source is read from a public URL, so the script runs anywhere:
 *
 *   - lessons from the University's markdown endpoints (`/learn/<course>.md`)
 *   - posts from the website API
 *   - docs pages from this repository, through the same URL rules as llms.txt
 *
 * Embeddings would score meaning rather than shared words, but need an API key
 * that this repository does not hold, and the public docs search that has one
 * is rate-limited too tightly to query once per lesson and post.
 *
 * Usage: bun run generate:related
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

import GithubSlugger from "github-slugger";

import { pagesFor, readCollections, SITE } from "./lib/docs-pages.mjs";

const OUTPUT_FILE = "src/data/related.json";
const OVERRIDES_FILE = "src/data/related-overrides.json";

const BLOG_API = "https://api.surrealdb.com/api/website/v1/blogs";

/**
 * Set by reading sampled pairs in each score band. Below 0.25 they were mixed,
 * between 0.25 and 0.28 mostly right with a few that shared vocabulary rather
 * than a subject, and above 0.28 nearly all right.
 */
const MIN_SIMILARITY = 0.28;

/** Fetched lessons and posts, so that tuning runs do not refetch them. Gitignored. */
const SOURCE_CACHE_DIR = "generated/related-sources";

/** Pause after each page fetched, to stay inside the website's rate limit. */
const FETCH_INTERVAL_MS = 1000;

/** Shorter sections are merged into the one before them. */
const MIN_SECTION_WORDS = 150;

/** At most this many related items are shown on one page. */
const MAX_PER_PAGE = 3;

/** The release date of 3.0.0. Posts before it are excluded by default. */
const CURRENT_MAJOR_SINCE = "2026-02-17";

/**
 * The first line of the website footer that every University page's markdown
 * carries after the lesson itself. Everything from here on is site chrome.
 */
const FOOTER_MARKERS = ["Everything an application and its agents know", '```json\n{"@context"'];

const SKIP_COLLECTIONS = new Set(["labs-items"]);

const STOPWORDS = new Set(
    (
        "a about above after again against all also am an and any are as at be because been before being below " +
        "between both but by can could did do does doing down during each few for from further had has have having " +
        "he her here hers him his how i if in into is it its itself just let me more most my no nor not now of off " +
        "on once only or other our ours out over own same she should so some such than that the their theirs them " +
        "then there these they this those through to too under until up us use used uses using very was we were what " +
        "when where which while who whom why will with would you your yours"
    ).split(" "),
);

// ── Text ──────────────────────────────────────────────────────────

function stripFrontmatter(text) {
    return text.replace(/^---\n[\s\S]*?\n---\n/, "");
}

/** The words of a markdown document: no code, no tags, no link targets. */
function prose(markdown) {
    return stripFrontmatter(markdown)
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/<[^>\n]+>/g, " ")
        .replace(/\]\([^)]*\)/g, "]");
}

function tokens(text) {
    return (text.toLowerCase().match(/[a-z][a-z0-9_:]{2,}/g) ?? []).filter(
        (t) => !STOPWORDS.has(t),
    );
}

/**
 * A document split at its `##` headings into sections of at least
 * `MIN_SECTION_WORDS`, each section absorbing short ones that follow it.
 *
 * A long lesson or post covers several subjects, and its vector as a whole is a
 * blend that overlaps a little with almost everything. Scoring a docs page
 * against each section and keeping the best one pairs the page with the part
 * of the item that is actually about the same thing.
 */
function sections(markdown) {
    const parts = markdown.split(/^(?=## )/m);
    const merged = [];

    for (const part of parts) {
        const last = merged.at(-1);

        if (last && last.split(/\s+/).length < MIN_SECTION_WORDS) {
            merged[merged.length - 1] = `${last}\n${part}`;
        } else {
            merged.push(part);
        }
    }

    return merged;
}

// ── TF-IDF ────────────────────────────────────────────────────────

/**
 * Sublinear TF-IDF vectors, L2-normalised, as sparse maps.
 *
 * Terms in fewer than two documents carry no signal for pairing, and terms in
 * more than half of them ("surrealdb", "record") describe the whole corpus
 * rather than any one subject, so both are dropped.
 */
function vectorise(documents) {
    const counts = documents.map((doc) => {
        const tf = new Map();
        for (const t of tokens(doc)) tf.set(t, (tf.get(t) ?? 0) + 1);
        return tf;
    });

    const df = new Map();
    for (const tf of counts) for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);

    const n = documents.length;

    return counts.map((tf) => {
        const vec = new Map();
        let norm = 0;

        for (const [t, c] of tf) {
            const d = df.get(t);
            if (d < 2 || d > n / 2) continue;

            const w = (1 + Math.log(c)) * (Math.log((1 + n) / (1 + d)) + 1);
            vec.set(t, w);
            norm += w * w;
        }

        norm = Math.sqrt(norm) || 1;
        for (const [t, w] of vec) vec.set(t, w / norm);

        return vec;
    });
}

function cosine(a, b) {
    const [small, large] = a.size < b.size ? [a, b] : [b, a];
    let sum = 0;
    for (const [t, w] of small) sum += w * (large.get(t) ?? 0);
    return sum;
}

// ── Sources ───────────────────────────────────────────────────────

/**
 * Fetch a URL, through a local cache in `SOURCE_CACHE_DIR`.
 *
 * Lessons are read one page at a time, and the website rate-limits a client
 * that fetches its 190 pages several times while the scoring is being tuned.
 * Set RELATED_REFRESH=1 to fetch everything again, which a real update of the
 * committed file should do so that it reflects what is published.
 */
async function fetchText(url) {
    const file = `${SOURCE_CACHE_DIR}/${createHash("sha256").update(url).digest("hex")}`;

    if (!process.env.RELATED_REFRESH && existsSync(file)) return readFileSync(file, "utf8");

    for (let attempt = 0; attempt < 6; attempt++) {
        const res = await fetch(url);

        if (res.status === 429) {
            const wait = Number(res.headers.get("Retry-After")) || Math.min(60, 5 * 2 ** attempt);
            console.log(`[related] rate limited on ${url}, waiting ${wait}s`);
            await Bun.sleep(wait * 1000);
            continue;
        }

        if (!res.ok) throw new Error(`${url} answered ${res.status}`);

        const text = await res.text();
        mkdirSync(SOURCE_CACHE_DIR, { recursive: true });
        writeFileSync(file, text);
        await Bun.sleep(FETCH_INTERVAL_MS);
        return text;
    }

    throw new Error(`${url} kept answering 429`);
}

function docsPages() {
    const pages = [];

    for (const [id, prefix] of readCollections()) {
        if (SKIP_COLLECTIONS.has(id)) continue;

        for (const page of pagesFor(id, prefix)) {
            pages.push({
                path: page.url.slice(SITE.length),
                title: page.title,
                text: prose(readFileSync(page.file, "utf8")),
            });
        }
    }

    return pages;
}

/**
 * Every lesson of every course, found through the course pages' own navigation.
 *
 * A course page lists its lessons as links under the course path, so the
 * course structure is read from the published site rather than restated here.
 */
async function lessons() {
    const index = await fetchText(`${SITE}/learn.md`);
    const courses = [
        ...new Set(index.match(/https:\/\/surrealdb\.com\/learn\/[a-z0-9-]+(?=\))/g) ?? []),
    ];

    const found = [];

    for (const course of courses) {
        const page = await fetchText(`${course}.md`);
        const urls = [
            course,
            ...new Set(page.match(new RegExp(`${course}/[a-z0-9/-]+(?=\\))`, "g")) ?? []),
        ];

        for (const url of new Set(urls)) {
            const markdown = url === course ? page : await fetchText(`${url}.md`);
            const title = (
                markdown.match(/^title: "?(.*?)(?: \| SurrealDB University)?"?$/m)?.[1] ?? url
            ).trim();

            // Everything before the first heading is the course navigation,
            // and everything after the footer marker is the website footer.
            // Every lesson repeats both, and neither says anything about it.
            const start = Math.max(0, markdown.search(/^# /m));
            const ends = FOOTER_MARKERS.map((m) => markdown.indexOf(m, start)).filter((i) => i > 0);
            const body = markdown.slice(start, ends.length ? Math.min(...ends) : undefined);

            found.push({
                kind: "lesson",
                id: url.slice(SITE.length),
                url: url.slice(SITE.length),
                title,
                sections: sections(body).map(prose),
            });
        }
    }

    return found;
}

async function posts() {
    const all = JSON.parse(await fetchText(BLOG_API));

    return all.map((post) => {
        const body = post.content?.live ?? post.content?.draft ?? "";

        return {
            kind: "post",
            id: post.slug,
            url: post.blog_url ?? `/blog/${post.slug}`,
            title: post.title,
            published: (post.publish_date ?? "").slice(0, 10),
            sections: sections(body).map(prose),
        };
    });
}

// ── Main ──────────────────────────────────────────────────────────

const overrides = existsSync(OVERRIDES_FILE)
    ? JSON.parse(readFileSync(OVERRIDES_FILE, "utf8"))
    : { includePosts: [], exclude: [] };

const excluded = new Set(overrides.exclude.map(([page, item]) => `${page} ${item}`));
const includedPosts = new Set(overrides.includePosts);

const docs = docsPages();
const items = [...(await lessons()), ...(await posts())].filter(
    (item) =>
        item.kind !== "post" || item.published >= CURRENT_MAJOR_SINCE || includedPosts.has(item.id),
);

// One vector per docs page, and one per section of every lesson and post.
const sectionOwner = items.flatMap((item, j) => item.sections.map(() => j));
const vectors = vectorise([
    ...docs.map((d) => `${d.title} ${d.text}`),
    ...items.flatMap((item) => item.sections.map((text) => `${item.title} ${text}`)),
]);
const docVectors = vectors.slice(0, docs.length);
const sectionVectors = vectors.slice(docs.length);

/** The best-scoring section of item `j` against docs page `i`. */
function bestSection(i, j) {
    let best = { score: 0, section: -1 };
    for (const [k, owner] of sectionOwner.entries()) {
        if (owner !== j) continue;
        const score = cosine(docVectors[i], sectionVectors[k]);
        if (score > best.score) best = { score, section: k };
    }
    return best;
}

/**
 * The anchor of each section on the website, as `github-slugger` derives it from
 * the heading. A slugger is created per item and fed every `##` heading in
 * order, because the slugger numbers a repeated heading (`setup`, `setup-1`) by
 * what it has seen before.
 */
const sectionAnchors = items.flatMap((item) => {
    const slugger = new GithubSlugger();

    return item.sections.map((text) => {
        const first = text.trim().split("\n")[0];
        return first.startsWith("## ")
            ? slugger.slug(first.replace(/^## /, "").replace(/[*_`]/g, ""))
            : undefined;
    });
});

const sectionHeadings = items.flatMap((item) =>
    item.sections.map((text) => {
        const first = text.trim().split("\n")[0];

        // The opening of an item, before its first `##`, has no heading of its
        // own: its first line is the title or a sentence of prose.
        if (!first.startsWith("## ")) return undefined;

        return (
            first
                .replace(/^#+ /, "")
                // Markdown emphasis and code marks, and a leading emoji or number
                // label, which read as noise once shown as plain text.
                .replace(/[*_`]/g, "")
                .replace(/^[^\p{L}\p{N}]+/u, "")
                .trim()
        );
    }),
);

const related = new Map();

// Every pair at or above half the threshold, with its score, for calibrating
// `MIN_SIMILARITY`. Written only when RELATED_DEBUG names a file.
const candidates = [];

for (const [i, doc] of docs.entries()) {
    for (const [j, item] of items.entries()) {
        if (excluded.has(`${doc.path} ${item.url}`)) continue;

        const { score, section } = bestSection(i, j);
        if (score >= MIN_SIMILARITY / 2) {
            candidates.push({
                page: doc.path,
                item: item.url,
                title: item.title,
                section: sectionHeadings[section],
                score,
            });
        }
        if (score < MIN_SIMILARITY) continue;

        if (!related.has(doc.path)) related.set(doc.path, []);
        related.get(doc.path).push({
            kind: item.kind,
            title: item.title,
            section: sectionHeadings[section],
            anchor: sectionAnchors[section],
            url: item.url,
            score,
        });
    }
}

/**
 * The anchor of a section, if the published page has an element with that id.
 * A heading the slugger and the website turn into different ids, such as one
 * starting with an emoji, then links to the top of the item instead of to a
 * position that does not exist.
 */
async function verifiedAnchor(url, anchor) {
    if (!anchor) return undefined;

    const html = await fetchText(`${SITE}${url}`);
    return html.includes(`id="${anchor}"`) ? anchor : undefined;
}

const output = {};

for (const path of [...related.keys()].sort()) {
    const best = related
        .get(path)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_PER_PAGE);

    output[path] = [];

    for (const { kind, title, section, anchor, url } of best) {
        const id = await verifiedAnchor(url, anchor);
        output[path].push({ kind, title, section, url: id ? `${url}#${id}` : url });
    }
}

if (process.env.RELATED_DEBUG) {
    writeFileSync(process.env.RELATED_DEBUG, JSON.stringify(candidates, null, 1));
}

writeFileSync(OUTPUT_FILE, `${JSON.stringify(output, null, 4)}\n`);

const counts = Object.values(output).flat();
console.log(
    `[related] ${Object.keys(output).length} of ${docs.length} pages, ` +
        `${counts.filter((c) => c.kind === "lesson").length} lesson and ` +
        `${counts.filter((c) => c.kind === "post").length} post links, ` +
        `from ${items.length} lessons and current posts`,
);
