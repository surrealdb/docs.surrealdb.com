/**
 * Warns when the lines a change adds break one of the mechanical writing rules
 * in `AGENTS.md`. The rules that need judgement, such as plain English, a
 * subject and a verb in every claim, or sentence shapes that read as
 * generated, stay with the reviewer. These do not:
 *
 * - **dash**: an em or en dash. The repository uses the hyphen.
 * - **spelling**: an American spelling (`-ize`, `-yze`, `color`, `center`,
 *   `catalog` and the like). The docs use British English.
 * - **idiom**: a phrase from the `AGENTS.md` table of idioms that no word of
 *   carries the meaning of, such as "under the hood" or "out of the box".
 * - **heading**: a heading in Title Case, or a heading that holds a link.
 * - **wrapped**: a paragraph or callout that continues on a second source line.
 * - **record-id**: a record ID escaped with the old `⟨ ⟩` brackets.
 * - **if-then**: an `IF ... THEN ... END` block in a SurrealQL example.
 * - **comment**: a bare `//` comment in a SurrealQL example, where `--` marks
 *   prose and `//-` marks a result.
 * - **output**: a SurrealQL example whose result fence is titled `Response`
 *   or `Result`, which are for HTTP and RPC pages.
 * - **password**: an example password of `root`.
 * - **embed**: a `<SurrealistMini>` that renders as an empty editor or leaks its
 *   query onto the page: a `url` attribute, a template literal, or a blank line
 *   inside the query.
 * - **html**: a raw `<iframe>`, which the renderer strips without an error.
 * - **callout**: a `> [!KIND]` that is not NOTE, TIP, IMPORTANT, WARNING or
 *   CAUTION in capitals.
 * - **alt**: an image with no alt text, which is all the `.md` endpoints serve.
 * - **since**: a `<Since>` badge anywhere but directly under a heading, directly
 *   under the frontmatter or in a table cell.
 * - **tabs**: a group of version tabs with the older version first, or a
 *   `surrealdb-version` group whose labels the version menu cannot match.
 * - **link-once**: a link repeated in the prose of a short page, or of one
 *   section of a long page.
 *
 * Text in code fences, inline code and link targets is not read for the prose
 * rules. By default only lines the branch added or changed are checked, so
 * existing content causes no noise. The base is `origin/<GITHUB_BASE_REF>` in a
 * pull request and `origin/main` otherwise, or the ref given with `--base`.
 *
 * It only warns, and exits 0, because a rule can have a good reason to bend
 * where a page quotes something, and the person making the change decides.
 * `--strict` exits 1 when anything is found, for the day the content is clean.
 * In GitHub Actions each warning is an annotation on the changed line.
 *
 * Usage:
 *   bun scripts/check-content.ts             lines this branch changed
 *   bun scripts/check-content.ts --base REF  the same, against REF
 *   bun scripts/check-content.ts --all       every line of every page
 *   bun scripts/check-content.ts --strict    exit 1 when anything is found
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MAJOR_VERSIONS } from "../src/utils/major-version";

const ROOT = join(import.meta.dir, "..");
const CONTENT = "src/content";

type Kind = "frontmatter" | "fence" | "prose";

interface Line {
    number: number;
    text: string;
    kind: Kind;
    /** For a line of a fence, its language and the rest of its opening line. */
    fence?: { lang: string; info: string };
    /** Part of the markup of a component, such as a multi-line tag, and not of a paragraph. */
    markup?: boolean;
}

interface Finding {
    file: string;
    line: number;
    rule: string;
    text: string;
}

/** Pages that quote or describe the old syntax on purpose. */
const HISTORICAL = /(^|\/)operate\/upgrading\//;
const RECORD_ID_PAGE =
    /(^|\/)data-types\/record-ids\.mdx$|^src\/content\/reference\/(?:golang|python|java|dotnet|php|kotlin|swift|mojo|javascript|rust)\//;
const COMMENTS_PAGE = /(^|\/)language-primitives\/comments\.mdx$/;

/** Words an `-ize` or `-yze` rule must leave alone. */
const KEEP_IZE =
    /^(?:\w*size[sd]?|\w*sizing|prize[sd]?|seiz\w*|capsiz\w*|maize|citizen\w*|assize\w*|resiz\w*|bizarre|Authorization|Unauthorized)$/i;

/**
 * Technical terms spelled with a z in SurrealQL, SQL or a tool's own name: the
 * `TOKENIZERS` clause, serializable isolation, Surqlize, Wizer and Authorizer.
 */
const TECHNICAL_Z = /^(?:tokeni[sz]\w*|(?:de)?serializ\w*|surqlize\w*|wizer|authorizer)$/i;

const SPELLINGS: [RegExp, string][] = [
    [/\bcolor(?:s|ed|ing|ful)?\b/gi, "colour"],
    [/\bbehavior(?:s|al|ally)?\b/gi, "behaviour"],
    [/\bfavorite(?:s)?\b/gi, "favourite"],
    [/\b(?:neighbor|honor|flavor|labor|harbor|humor|rumor)(?:s|ed|ing|able)?\b/gi, "-our"],
    [/\bcenter(?:s|ed|ing)?\b/gi, "centre"],
    [/\b(?:fiber|liter|theater|caliber)s?\b/gi, "-re"],
    [/\b(?:defense|offense)s?\b/gi, "-ce"],
    [/\bgray\b/gi, "grey"],
    [/\b(?:cancel|travel|label|model|signal|total|fuel|level|channel)(?:ed|ing)\b/gi, "doubled l"],
    [/\b(?:analy|paraly|catalys)ze[sd]?\b|\b(?:analy|paraly|catalys)zing\b/gi, "-yse"],
];

const IDIOMS: [RegExp, string][] = [
    [/\breach(?:es|ed|ing)? for\b/i, "use"],
    [/\bearns? its keep\b/i, "is worth the cost"],
    [/\bworth (?:a look|keeping in mind)\b/i, "look at, remember"],
    [/\bdoes the heavy lifting\b/i, "does most of the work"],
    [/\bpulls? its weight\b/i, "is worth including"],
    [/\bunder the hood\b/i, "internally"],
    [/\bout of the box\b/i, "by default"],
    [/\bin the wild\b/i, "in production"],
    [/\bmoving parts\b/i, "components"],
    [/\blet'?s dive in\b/i, "start with the content"],
];

/** Words that are capitalised in a heading because they are names, not because of Title Case. */
const NAMES = new Set([
    "Agent",
    "Memory",
    "Cloud",
    "Studio",
    "Earth",
    "Enterprise",
    "Start",
    "Scale",
    "Free",
    "Labs",
    "Skills",
    "Surrealist",
    // Part of the names "VS Code" and "Claude Code".
    "Code",
    "Server",
    "Context",
    "Rollouts",
    "Surreal",
    "Sync",
    "Go",
]);

function git(...args: string[]): string {
    return execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        maxBuffer: 256 * 1024 * 1024,
    });
}

const args = process.argv.slice(2);
const all = args.includes("--all");
const strict = args.includes("--strict");
const baseArg = args[args.indexOf("--base") + 1];
const base =
    args.includes("--base") && baseArg
        ? baseArg
        : `origin/${process.env.GITHUB_BASE_REF || "main"}`;

const files = (readdirSync(join(ROOT, CONTENT), { recursive: true }) as string[])
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => join(CONTENT, f));

/** The lines of each page the branch added or changed, or every line with `--all`. */
const changed = new Map<string, Set<number> | "all">();
if (all) {
    for (const file of files) changed.set(file, "all");
} else {
    try {
        const mergeBase = git("merge-base", base, "HEAD").trim();
        const diff = git("diff", "-U0", "--diff-filter=AMR", mergeBase, "--", CONTENT);
        let current: string | undefined;
        for (const line of diff.split("\n")) {
            const file = line.match(/^\+\+\+ b\/(.*)$/);
            if (file) {
                current = /\.mdx?$/.test(file[1]) ? file[1] : undefined;
                if (current) changed.set(current, new Set());
                continue;
            }
            const hunk = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/);
            if (hunk && current) {
                const [start, count] = [
                    Number(hunk[1]),
                    hunk[2] === undefined ? 1 : Number(hunk[2]),
                ];
                const lines = changed.get(current);
                if (lines instanceof Set) for (let n = start; n < start + count; n++) lines.add(n);
            }
        }
    } catch {
        console.log(`[content] ${base} is not available here, so nothing was checked`);
        process.exit(0);
    }
}

const isChanged = (file: string, line: number) => {
    const lines = changed.get(file);
    return lines === "all" || (lines?.has(line) ?? false);
};

/** Split a page into lines, marking frontmatter, fences and component markup. */
function parse(source: string): Line[] {
    const out: Line[] = [];
    const rows = source.split("\n");
    let i = 0;
    if (rows[0]?.trim() === "---") {
        const end = rows.findIndex((r, n) => n > 0 && r.trim() === "---");
        if (end > 0) {
            for (; i <= end; i++) out.push({ number: i + 1, text: rows[i], kind: "frontmatter" });
        }
    }
    let fence: { mark: string; lang: string; info: string } | undefined;
    let tag = false;
    let synopsis = false;
    for (; i < rows.length; i++) {
        const text = rows[i];
        const number = i + 1;
        if (fence) {
            const close = text.match(/^\s*(`{3,}|~{3,})\s*$/);
            out.push({ number, text, kind: "fence", fence: fence });
            if (close && close[1][0] === fence.mark[0] && close[1].length >= fence.mark.length) {
                fence = undefined;
            }
            continue;
        }
        const open = text.match(/^\s*(`{3,}|~{3,})(\S*)(.*)$/);
        if (open) {
            fence = { mark: open[1], lang: open[2], info: open[3] };
            out.push({ number, text, kind: "fence", fence });
            continue;
        }
        let markup = tag || synopsis;
        if (/^\s*<Synopsis\b/.test(text)) synopsis = true;
        if (/^\s*<\/Synopsis>/.test(text)) synopsis = false;
        if (!tag && /^\s*<[A-Za-z]/.test(text)) {
            markup = true;
            // A tag that does not close on its own line goes on to the next
            const opens = (text.match(/</g) ?? []).length;
            const closes = (text.match(/>/g) ?? []).length;
            if (closes < opens || !/>\s*$/.test(text)) tag = true;
        } else if (tag) {
            if (/>\s*$/.test(text)) tag = false;
        }
        if (/^\s*[A-Za-z-]+=/.test(text) || /^\s*\{\/\*/.test(text)) markup = true;
        out.push({ number, text, kind: "prose", markup });
    }
    return out;
}

/** A line with inline code, HTML code, link targets and bare URLs blanked out. */
function mask(text: string): string {
    return text
        .replace(/`[^`]*`/g, (m) => " ".repeat(m.length))
        .replace(/<code>[\s\S]*?<\/code>/g, (m) => " ".repeat(m.length))
        .replace(/\]\([^)]*\)/g, (m) => "]" + " ".repeat(m.length - 1))
        .replace(/\b(?:href|src|darkSrc)="[^"]*"/g, (m) => " ".repeat(m.length))
        .replace(/https?:\/\/\S+/g, (m) => " ".repeat(m.length))
        .replace(/(?<![\w-])--[a-z][\w-]*/g, (m) => " ".repeat(m.length));
}

const pages = new Map<string, Line[]>();
for (const file of files) pages.set(file, parse(readFileSync(join(ROOT, file), "utf8")));

/** Words that start with a capital in the middle of a sentence far more often than not. */
const proper = (() => {
    const upper = new Map<string, number>();
    const lower = new Map<string, number>();
    for (const lines of pages.values()) {
        for (const l of lines) {
            if (l.kind !== "prose" || l.markup || /^\s*#/.test(l.text)) continue;
            const text = mask(l.text);
            for (const m of text.matchAll(/[A-Za-z][A-Za-z0-9]*/g)) {
                const word = m[0];
                const before = text.slice(0, m.index).trimEnd();
                const start = before === "" || /[.!?:|>*\-\d]$/.test(before);
                if (/^[A-Z]/.test(word)) {
                    if (!start) upper.set(word, (upper.get(word) ?? 0) + 1);
                } else {
                    const key = word[0].toUpperCase() + word.slice(1);
                    lower.set(key, (lower.get(key) ?? 0) + 1);
                }
            }
        }
    }
    const names = new Set(NAMES);
    for (const [word, n] of upper) if (n >= 3 && n > 3 * (lower.get(word) ?? 0)) names.add(word);
    return names;
})();

const findings: Finding[] = [];
const report = (file: string, line: number, rule: string, text: string) => {
    if (isChanged(file, line)) findings.push({ file, line, rule, text });
};

function checkProse(file: string, l: Line) {
    const text = mask(l.text);
    const { number } = l;

    if (/[—–]/.test(text)) {
        report(
            file,
            number,
            "dash",
            "Use a spaced hyphen ( - ) for a pause, and a hyphen with no spaces for a range such as 2-3. A comma, a colon or a full stop often reads better.",
        );
    }

    for (const [pattern, suggestion] of SPELLINGS) {
        for (const m of text.matchAll(pattern)) {
            report(
                file,
                number,
                "spelling",
                `"${m[0]}" is an American spelling. The docs use British English (${suggestion}).`,
            );
        }
    }
    for (const m of text.matchAll(
        /\b[A-Za-z]+(?:ize[sd]?|izing|ization[s]?|izer[s]?|izable)\b/gi,
    )) {
        if (KEEP_IZE.test(m[0]) || TECHNICAL_Z.test(m[0])) continue;
        report(
            file,
            number,
            "spelling",
            `"${m[0]}" is an American spelling. The docs use -ise (British English).`,
        );
    }

    for (const [pattern, use] of IDIOMS) {
        const m = text.match(pattern);
        if (m) {
            report(
                file,
                number,
                "idiom",
                `"${m[0]}" is an idiom no word of which carries the meaning. Write: ${use}.`,
            );
        }
    }

    const heading = l.text.match(/^(#{1,6})\s+(.*?)(?:\s+\{#[\w-]+\})?\s*$/);
    if (heading) {
        if (/\]\(/.test(heading[2])) {
            report(
                file,
                number,
                "heading",
                "A heading never holds a link: the renderer already links each heading to its own anchor.",
            );
        }
        // An HTTP status such as "404 Not Found" is a name, not a heading to rewrite
        if (heading[1].length >= 2 && !/^\d{3}\s/.test(heading[2])) {
            // A heading is in sentence case from the word that starts it, and
            // again after a number, a colon or a spaced hyphen
            const clauses = mask(heading[2])
                .replace(/\([^)]*\)/g, " ")
                .split(/:\s+|\s+-\s+/)
                .map((c) => c.replace(/^(?:step\s+\d+[.):]?|\d+[.):])\s*/i, ""));
            const clauseWords = clauses.map((c) =>
                c.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)),
            );
            const words = clauseWords.flat();
            const segments = clauseWords.flatMap((ws) =>
                ws.flatMap((w, n) =>
                    w
                        .replace(/[,:;?!)]+$/, "")
                        .split("-")
                        .filter((s, k) => !(n === 0 && k === 0) && s),
                ),
            );
            const cased = segments.filter((s) => /^[A-Z][a-z]+$/.test(s) && !proper.has(s));
            if (words.length >= 2 && cased.length > 0) {
                report(
                    file,
                    number,
                    "heading",
                    `Use sentence case for a heading, so "${cased[0]}" is lowercase unless it is a name.`,
                );
            }
        }
    }

    if (RECORD_ID_PAGE.test(file) || HISTORICAL.test(file)) return;
    if (/[⟨⟩]/.test(l.text)) {
        report(
            file,
            number,
            "record-id",
            "Write a record ID part that needs escaping between backticks, as in user:`john-doe`. The brackets are only for pages about 2.x or the compatibility itself.",
        );
    }
}

/** Whether a line is a plain line of a paragraph, as opposed to a list item, table row or tag. */
function plain(l: Line | undefined): l is Line {
    if (!l || l.kind !== "prose" || l.markup) return false;
    const t = l.text;
    if (t.trim() === "" || /^\s/.test(t)) return false;
    return !/^(?:#|[-*+]\s|\d+[.)]\s|\||>|<|!\[|\[!|\{|import\s|export\s|:::|---|\*\*\*|\\)/.test(
        t,
    );
}

function quoted(l: Line | undefined): l is Line {
    return (
        !!l &&
        l.kind === "prose" &&
        /^>\s?(?!\[!)(?!(?:[-*+]\s|\d+[.)]\s|\||`{3}|#))\S/.test(l.text)
    );
}

function checkWrapping(file: string, lines: Line[]) {
    let paragraph = false;
    for (let n = 1; n < lines.length; n++) {
        const [prev, cur] = [lines[n - 1], lines[n]];
        const wrapped = (plain(prev) && plain(cur)) || (quoted(prev) && quoted(cur));
        if (wrapped && !paragraph) {
            report(
                file,
                cur.number,
                "wrapped",
                "This paragraph continues on a second source line. Write each paragraph, list item and callout body as one line, because the renderer keeps a single newline as a visible break.",
            );
        }
        paragraph = wrapped;
    }
}

const SURREALQL = /^(surql|surrealql|sql)$/i;

function checkFence(file: string, lines: Line[]) {
    let n = 0;
    while (n < lines.length) {
        const first = lines[n];
        if (first.kind !== "fence" || !first.fence) {
            n++;
            continue;
        }
        const block: Line[] = [];
        const fence = first.fence;
        let end = n;
        while (end < lines.length && lines[end].kind === "fence" && lines[end].fence === fence) {
            block.push(lines[end]);
            end++;
        }
        n = end;
        const body = block.slice(
            1,
            /^\s*(`{3,}|~{3,})\s*$/.test(block[block.length - 1].text) ? -1 : undefined,
        );

        for (const l of body) {
            if (/[⟨⟩]/.test(l.text) && !RECORD_ID_PAGE.test(file) && !HISTORICAL.test(file)) {
                report(
                    file,
                    l.number,
                    "record-id",
                    "Write a record ID part that needs escaping between backticks, as in user:`john-doe`.",
                );
            }
            if (
                /(?:--pass(?:word)?[ =]+|\bpass(?:word)?["']?\s*[:=]\s*|\s-p\s+)["']?root["']?(?![\w-])/i.test(
                    l.text,
                )
            ) {
                report(
                    file,
                    l.number,
                    "password",
                    "A password in an example should look like a password. The default is `secret`; `root` is the user name.",
                );
            }
        }

        if (!SURREALQL.test(fence.lang)) continue;

        if (/title="(?:Response|Result)"/i.test(fence.info)) {
            report(
                file,
                first.number,
                "output",
                'Title the result of a SurrealQL example `Output`, or qualify it ("Example output", "Possible output"). `Response` is for HTTP and RPC pages.',
            );
        }

        const code = body.map((l) => l.text).join("\n");
        if (!HISTORICAL.test(file)) {
            for (const m of code.matchAll(/\bIF\b(?!\s+(?:NOT\s+)?EXISTS)[^{;]*?\bTHEN\b/g)) {
                const line = body[code.slice(0, m.index).split("\n").length - 1];
                if (line) {
                    report(
                        file,
                        line.number,
                        "if-then",
                        "Write a conditional as IF @condition { ... } with ELSE IF and ELSE blocks. The THEN ... END form is kept for compatibility and is not taught.",
                    );
                }
            }
        }
        if (!COMMENTS_PAGE.test(file) && !/function\s*\(/.test(code)) {
            for (const l of body) {
                if (/^\s*\/\/(?!-)(?!\s*highlight-)/.test(l.text)) {
                    report(
                        file,
                        l.number,
                        "comment",
                        "Use `--` for a comment about the statement and `//-` for a result. A bare `//` means one of them was missed.",
                    );
                }
            }
        }
    }
}

/** The callout kinds the docs use. */
const CALLOUTS = new Set(["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"]);

/** An `<iframe>` is stripped without an error, and its contents stay in the page source. */
const RAW_HTML = /<iframe\b/i;

/** Pages shorter than this link a target once. Longer pages may link it again in a later section. */
const LONG_PAGE_WORDS = 1700;

/** The text of a tag that starts on line `from`, up to its closing `>` or `limit` lines. */
function tagText(lines: Line[], from: number, limit = 40): string {
    let text = "";
    for (let n = from; n < Math.min(lines.length, from + limit); n++) {
        text += `${lines[n].text}\n`;
        if (/>\s*$/.test(lines[n].text)) break;
    }
    return text;
}

/** Numbers in a tab label such as "SurrealDB 3.1 and later", lower for "Before SurrealDB 3.1". */
function tabVersion(label: string): number[] | undefined {
    const m = label.match(/(\d+(?:\.\d+)*)/);
    if (!m || !/surrealdb/i.test(label)) return undefined;
    const parts = m[1].split(".").map(Number);
    if (/\b(?:before|older|earlier|prior)\b/i.test(label)) parts.push(-1);
    else parts.push(0);
    return parts;
}

function compareVersions(a: number[], b: number[]): number {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const [x, y] = [a[i] ?? 0, b[i] ?? 0];
        if (x !== y) return x - y;
    }
    return 0;
}

function checkComponents(file: string, lines: Line[]) {
    const prose = lines.filter((l) => l.kind === "prose");
    const at = (l: Line) => lines.indexOf(l);

    const tabs: { line: number; sync: string; labels: string[] }[] = [];
    let words = 0;
    let section = 0;
    const seen = new Map<string, number>();
    const sections: { line: Line; targets: string[] }[] = [];

    for (const l of prose) {
        const text = mask(l.text);
        const n = l.number;

        const callout = l.text.match(/^\s*>\s*\[!([A-Za-z]+)\]/);
        if (callout && !CALLOUTS.has(callout[1])) {
            report(
                file,
                n,
                "callout",
                `"${callout[1]}" is not a callout kind. Use NOTE, TIP, IMPORTANT, WARNING or CAUTION, in capitals.`,
            );
        }

        if (RAW_HTML.test(text)) {
            report(
                file,
                n,
                "html",
                'An <iframe> is stripped without an error. Use <YouTube code="..." /> for a video or <DemoEmbed> for a page.',
            );
        }

        if (/<img\b/.test(text) && !/\balt=/.test(tagText(lines, at(l), 12))) {
            report(
                file,
                n,
                "alt",
                "An image needs alt text, which is all the raw .md endpoints serve.",
            );
        }
        if (/!\[\]\(/.test(text)) {
            report(
                file,
                n,
                "alt",
                "An image needs alt text, which is all the raw .md endpoints serve.",
            );
        }

        if (/<SurrealistMini\b/.test(text)) {
            let tag = "";
            let blank: number | undefined;
            for (let k = at(l); k < lines.length; k++) {
                if (lines[k].kind !== "prose") break;
                if (k > at(l) && lines[k].text.trim() === "" && !tag.includes("/>")) {
                    blank = lines[k].number;
                    break;
                }
                tag += `${lines[k].text}\n`;
                if (lines[k].text.includes("/>")) break;
            }
            const why =
                blank !== undefined
                    ? "a blank line inside the query ends the element early, so the rest of the query and the closing /> appear as text. Separate sections with -- comments"
                    : /\burl=/.test(tag)
                      ? "a url attribute is dropped and the editor renders empty. Pass the SurrealQL as query"
                      : /query=\{\s*`/.test(tag)
                        ? "a braced value must be JSON, so a template literal is dropped and the editor renders empty. Use a quoted string"
                        : undefined;
            if (why) report(file, n, "embed", `This <SurrealistMini> renders wrongly: ${why}.`);
        }

        if (/<Since\b/.test(text) && !/^\s*\|/.test(l.text) && !l.markup) {
            let ok = false;
            if (/^\s*<Since\b/.test(l.text)) {
                const i = at(l);
                let k = i - 1;
                while (k >= 0 && lines[k].text.trim() === "") k--;
                const prev = lines[k];
                ok =
                    !prev ||
                    prev.kind === "frontmatter" ||
                    /^#{1,6}\s/.test(prev.text) ||
                    /^\s*<Since\b/.test(prev.text);
            }
            if (!ok) {
                report(
                    file,
                    n,
                    "since",
                    "Put <Since> on its own line directly under the heading it dates, or directly under the frontmatter. Where only part of a section is new, write the version into the sentence.",
                );
            }
        }

        const open = text.match(/<Tabs\b/);
        if (open) {
            const tag = tagText(lines, at(l), 6);
            tabs.push({ line: n, sync: tag.match(/syncKey="([^"]*)"/)?.[1] ?? "", labels: [] });
        }
        if (/<TabItem\b/.test(text) && tabs.length > 0) {
            const label = tagText(lines, at(l), 6).match(/label=(?:"([^"]*)"|'([^']*)')/);
            if (label) tabs[tabs.length - 1].labels.push(label[1] ?? label[2]);
        }
        if (/<\/Tabs>/.test(text)) {
            const group = tabs.pop();
            if (group) checkTabs(file, group);
        }

        if (/^#{1,2}\s/.test(l.text)) {
            section++;
            continue;
        }
        if (l.markup || /^\s*(?:#|\||[-*+]\s|\d+[.)]\s)/.test(l.text)) continue;
        words += text.split(/\s+/).filter(Boolean).length;
        const targets = [
            ...l.text.replace(/`[^`]*`/g, "").matchAll(/\[[^\]]*\]\(([^)\s]+)[^)]*\)/g),
        ].map((m) => m[1].replace(/\/$/, "").toLowerCase());
        if (targets.length > 0) {
            sections.push({ line: l, targets: targets.map((t) => `${section}\t${t}`) });
        }
    }

    const short = words < LONG_PAGE_WORDS;
    for (const { line, targets } of sections) {
        for (const key of targets) {
            const [sectionId, target] = key.split("\t");
            const scope = short ? target : `${sectionId}\t${target}`;
            if (seen.has(scope)) {
                report(
                    file,
                    line.number,
                    "link-once",
                    `${target} is already linked ${short ? "earlier on this page" : "earlier in this section"}. Link a page at its first mention only.`,
                );
            }
            seen.set(scope, line.number);
        }
    }
}

function checkTabs(file: string, group: { line: number; sync: string; labels: string[] }) {
    if (group.sync === "surrealdb-version") {
        const known = MAJOR_VERSIONS.map((v) => v.label);
        const bad = group.labels.find((label) => !known.includes(label));
        if (bad) {
            report(
                file,
                group.line,
                "tabs",
                `The label "${bad}" is not one the version menu selects. Use ${known.join(" and ")}, exactly as written.`,
            );
            return;
        }
        const order = group.labels.map((label) => known.indexOf(label));
        if (order.some((v, i) => i > 0 && v < order[i - 1])) {
            report(file, group.line, "tabs", "Put the newest version's tab first.");
        }
        return;
    }
    const versions = group.labels.map(tabVersion);
    if (group.labels.length < 2 || versions.some((v) => v === undefined)) return;
    const list = versions as number[][];
    if (list.some((v, i) => i > 0 && compareVersions(v, list[i - 1]) > 0)) {
        report(
            file,
            group.line,
            "tabs",
            "Put the newest version's tab first, because it is the one a reader sees and the one they download.",
        );
    }
}

for (const file of files) {
    if (!changed.has(file)) continue;
    const lines = pages.get(file) ?? [];
    for (const l of lines) if (l.kind === "prose") checkProse(file, l);
    checkWrapping(file, lines);
    checkFence(file, lines);
    checkComponents(file, lines);
}

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

for (const f of findings) {
    if (process.env.GITHUB_ACTIONS) {
        console.log(`::warning file=${f.file},line=${f.line},title=${f.rule}::${f.text}`);
    } else {
        console.log(`${f.file}:${f.line} [${f.rule}]\n    ${f.text}`);
    }
}

const byRule = new Map<string, number>();
for (const f of findings) byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);
const summary = [...byRule].map(([rule, n]) => `${n} ${rule}`).join(", ");
console.log(
    `[content] ${all ? "every page" : `${changed.size} changed pages against ${base}`}: ${findings.length} warnings${summary ? ` (${summary})` : ""}`,
);

if (strict && findings.length > 0) process.exit(1);
