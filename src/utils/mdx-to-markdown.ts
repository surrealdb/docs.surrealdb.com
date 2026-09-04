import type { SdkVersionMap } from "~/lib/versions";

/**
 * Flattens the MDX components used across docs content into plain markdown.
 *
 * A page's `.md` representation is composed from its MDX source, so every
 * component the browser renders is otherwise emitted as raw JSX. An agent
 * reading `select.md` would meet nested `<Tabs>`/`<TabItem>` wrappers, inline
 * `<Since v="v3.2.5" />` markers, and a `<RailroadDiagram ast='{...}' />` whose
 * single attribute is a couple of kilobytes of serialised diagram. None of that
 * carries meaning without the component that renders it.
 *
 * Each component is therefore rewritten to the closest plain-markdown
 * equivalent (or dropped, when it is purely visual). Anything not listed here
 * is left untouched: an unrecognised tag surviving into the output is a much
 * better failure than mangled prose.
 *
 * Code is masked before any rewriting happens - see `maskCode`.
 */

/**
 * Attribute-text pattern shared by every component matcher.
 *
 * The character class admits newlines, because content is formatted across
 * several lines (`<IconBox>` in particular), and the quoted-string branches let
 * a `>` inside an attribute value pass without ending the tag early. Attribute
 * expressions such as `icon={{ light: LightRust }}` match the plain branch:
 * they contain no `>`. A tag whose attributes *do* contain a bare `>` simply
 * fails to match and is left as-is.
 */
const ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;

/** Matches a component tag, self-closing or opening, capturing its attributes. */
function tag(name: string): RegExp {
    return new RegExp(`<${name}(${ATTRS})/?>`, "g");
}

/** Matches a wrapper component's opening and closing tags alike. */
function wrapper(name: string): RegExp {
    return new RegExp(`</?${name}(?:${ATTRS})?/?>`, "g");
}

/**
 * Unwraps a braced attribute expression down to the string it carries, so that
 * `query={`CREATE ...`}` yields the query and not a stray pair of backticks.
 */
function unwrapExpression(value: string): string {
    const match = /^([`'"])([\s\S]*)\1$/.exec(value.trim());
    return match ? match[2] : value.trim();
}

/**
 * Removes the indentation an attribute value inherited from the surrounding
 * JSX, so a multi-line query lands flush against the fence that wraps it.
 */
function dedent(text: string): string {
    const lines = text.replace(/^\n+/, "").replace(/\s+$/, "").split("\n");
    const indents = lines
        .filter((line) => line.trim())
        .map((line) => (/^[ \t]*/.exec(line)?.[0] ?? "").length);
    const common = indents.length > 0 ? Math.min(...indents) : 0;

    return lines.map((line) => line.slice(common)).join("\n");
}

/**
 * Parses the quoted and braced attributes of a tag. Keys are lower-cased so
 * that both spellings of `<Tabs synckey>` / `<Tabs syncKey>` resolve alike.
 *
 * The braced branch tracks brace pairs two levels deep, which covers the
 * expression attributes content actually uses: `icon={{ light, dark }}` and
 * `query={`...`}` holding SurrealQL object literals. A more deeply nested
 * expression stops matching, leaving the tag in place rather than truncating it.
 */
const ATTR_PATTERN =
    /([A-Za-z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\})/g;

function parseAttrs(raw: string): Record<string, string> {
    const attrs: Record<string, string> = {};

    for (const match of raw.matchAll(ATTR_PATTERN)) {
        const value = match[2] ?? match[3] ?? (match[4] ? unwrapExpression(match[4]) : "");
        attrs[match[1].toLowerCase()] = value;
    }

    return attrs;
}

/** Placeholder delimiter - a NUL byte cannot occur in docs content. */
const MASK = "\u0000";

/**
 * Replaces fenced code blocks and inline code spans with placeholders, so the
 * component rewrites can never reach example code. Docs samples are full of
 * angle brackets that look like JSX - `Vec<String>`, `<T>`, `->` traversals,
 * `<|2,COSINE|>` operators - and a single one of those rewritten inside a code
 * block is a broken example.
 */
function maskCode(markdown: string): { text: string; blocks: string[] } {
    const blocks: string[] = [];
    const out: string[] = [];
    let fence: string | null = null;
    let buffer: string[] = [];

    const store = (value: string) => {
        blocks.push(value);
        return `${MASK}${blocks.length - 1}${MASK}`;
    };

    for (const line of markdown.split("\n")) {
        const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];

        if (fence === null) {
            // A fence opens: buffer it whole, including the closing marker.
            if (marker) {
                fence = marker;
                buffer = [line];
                continue;
            }
            // Inline spans are safe to mask line by line.
            out.push(line.replace(/`+[^`\n]*`+/g, (span) => store(span)));
            continue;
        }

        buffer.push(line);

        // A fence closes on a marker of the same character, at least as long.
        if (marker && marker[0] === fence[0] && marker.length >= fence.length) {
            out.push(store(buffer.join("\n")));
            fence = null;
            buffer = [];
        }
    }

    // An unterminated fence: keep the remainder masked rather than exposing it.
    if (buffer.length > 0) {
        out.push(store(buffer.join("\n")));
    }

    return { text: out.join("\n"), blocks };
}

function restoreCode(text: string, blocks: string[]): string {
    return text.replace(
        new RegExp(`${MASK}(\\d+)${MASK}`, "g"),
        (match, index) => blocks[Number(index)] ?? match,
    );
}

/**
 * Rewrites `<TabItem>` panels into labelled sections and drops the `<Tabs>`
 * wrapper. Labels become bold text rather than headings: a tab sits at an
 * arbitrary depth inside a page, and injecting headings would corrupt the
 * outline that agents use to chunk a document.
 *
 * Panels are matched innermost-first (the body pattern excludes further
 * `TabItem` tags), so nested tab sets flatten from the inside out. A panel left
 * empty by an earlier rewrite - typically one that held only a railroad diagram
 * - is dropped along with its label.
 */
function flattenTabs(markdown: string): string {
    const panel = new RegExp(`<TabItem(${ATTRS})>((?:(?!</?TabItem)[\\s\\S])*)</TabItem>`, "g");
    let out = markdown;

    // Each pass unwraps one level of nesting; docs content never goes deeper
    // than two, and the loop exits as soon as a pass changes nothing.
    for (let depth = 0; depth < 5; depth++) {
        const next = out.replace(panel, (_match, raw: string, body: string) => {
            const attrs = parseAttrs(raw);
            const label = attrs.label ?? attrs.value;
            const content = body.trim();

            if (!content) return "";

            return label ? `\n\n**${label}**\n\n${content}\n` : `\n\n${content}\n`;
        });

        if (next === out) break;
        out = next;
    }

    return out.replace(wrapper("Tabs"), "");
}

/** Renders an `<IconBox>` link card as a list item. */
function iconBox(attrs: Record<string, string>): string {
    const label = attrs.title ?? attrs.subtitle;

    // Icon-only boxes are decorative and carry no text to keep.
    if (!label) return "";

    const link = attrs.href ? `[${label}](${attrs.href})` : `**${label}**`;
    const status = attrs.status ? `(${attrs.status})` : "";
    const detail = attrs.title && attrs.subtitle ? attrs.subtitle : undefined;
    const description = [detail, attrs.description].filter(Boolean).join(" - ");

    return `\n- ${[link, status].filter(Boolean).join(" ")}${description ? ` - ${description}` : ""}`;
}

/**
 * Renders a `<SurrealistMini>` playground embed as the query it runs plus a
 * link to the playground. The query is the content: in the `url` form it is a
 * `?query=` parameter, which is otherwise served to agents as an unreadable
 * percent-encoded blob.
 */
function surrealistMini(attrs: Record<string, string>): string {
    let query: string | undefined = attrs.query;

    if (!query && attrs.url) {
        try {
            query = new URL(attrs.url).searchParams.get("query") ?? undefined;
        } catch {
            // A malformed URL just means no query to extract.
        }
    }

    const parts: string[] = [];

    if (query?.trim()) {
        parts.push(`\`\`\`surql\n${dedent(query)}\n\`\`\``);
    }

    if (attrs.url) {
        parts.push(`[Run this example in SurrealDB Studio](${attrs.url})`);
    }

    return parts.length > 0 ? `\n\n${parts.join("\n\n")}\n` : "";
}

/** Resolves `<Version>` against the same SDK version map the pages render. */
function version(attrs: Record<string, string>, versions: SdkVersionMap): string {
    const resolved = versions[attrs.sdk ?? "surrealdb"];

    return resolved && resolved !== "unknown" ? `\`${attrs.prefix ?? ""}${resolved}\`` : "latest";
}

const EDITION_LABELS: Record<string, string> = {
    community: "Community",
    enterprise: "Enterprise",
};

export function flattenMdxComponents(markdown: string, sdkVersions: SdkVersionMap = {}): string {
    const { text, blocks } = maskCode(markdown);
    let out = text;

    // Purely visual, and its `ast` attribute is kilobytes of noise. Removed
    // before the tab pass so a diagram-only panel collapses to nothing.
    out = out.replace(tag("RailroadDiagram"), "");

    // Inline badges and markers.
    out = out.replace(tag("Since"), (_match, raw: string) => {
        const value = parseAttrs(raw).v;
        return value ? `_(since ${value})_` : "";
    });
    out = out.replace(tag("Edition"), (_match, raw: string) => {
        const value = parseAttrs(raw).value;
        return value ? `_(${EDITION_LABELS[value] ?? value})_` : "";
    });
    out = out.replace(tag("Label"), (_match, raw: string) => {
        const value = parseAttrs(raw).label;
        return value ? `_(${value})_` : "";
    });
    // Must run before the `Version` replacement below. `tag("Version")` matches
    // `<VersionBlock …>` as well, because `ATTRS` absorbs the `Block` suffix as
    // ordinary attribute text, so whichever of the two runs first wins. With the
    // order reversed, a version block is replaced by a bare version number and
    // the code fence is lost. That breaks only the raw `.md` output: the render
    // path resolves components by exact tag name, so the page still looks right.
    out = out.replace(tag("VersionBlock"), (_match, raw: string) => {
        const attrs = parseAttrs(raw);
        const code = attrs.code;
        if (!code) {
            return "";
        }
        const resolved = sdkVersions[attrs.sdk ?? "surrealdb"];
        const version = resolved && resolved !== "unknown" ? resolved : "latest";
        const body = dedent(unwrapExpression(code)).replaceAll("{{version}}", version);
        return `\n\n\`\`\`${attrs.lang ?? ""}\n${body}\n\`\`\`\n\n`;
    });
    out = out.replace(tag("Version"), (_match, raw: string) =>
        version(parseAttrs(raw), sdkVersions),
    );

    // Structural wrappers.
    out = flattenTabs(out);
    out = out.replace(wrapper("Boxes"), "");

    // Components that emit links or code, applied last so the markdown they
    // introduce is not itself a candidate for rewriting.
    out = out.replace(tag("IconBox"), (_match, raw: string) => iconBox(parseAttrs(raw)));
    out = out.replace(tag("SurrealistMini"), (_match, raw: string) =>
        surrealistMini(parseAttrs(raw)),
    );
    out = out.replace(tag("Button"), (_match, raw: string) => {
        const attrs = parseAttrs(raw);
        return attrs.href ? `[${attrs.label ?? attrs.href}](${attrs.href})` : "";
    });
    out = out.replace(tag("Image"), (_match, raw: string) => {
        const attrs = parseAttrs(raw);
        return attrs.src ? `![${attrs.alt ?? ""}](${attrs.src})` : "";
    });
    out = out.replace(tag("YouTube"), (_match, raw: string) => {
        const attrs = parseAttrs(raw);
        return attrs.code
            ? `[Watch on YouTube](https://www.youtube.com/watch?v=${attrs.code})`
            : "";
    });

    // Collapse the blank-line runs the rewrites leave behind.
    out = out.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n");

    return restoreCode(out, blocks).trim();
}
