/**
 * Shared pieces of the "markdown for agents" contract, kept identical to the
 * marketing site's implementation (`src/lib/html-to-markdown.ts` in
 * www.surrealdb.com) so that both halves of surrealdb.com answer agents the
 * same way. The apex site's edge middleware deliberately skips `/docs`, so the
 * docs app has to honour the contract itself.
 */

export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

/**
 * Markdown is derived from content the same deploy already serves as HTML, so
 * it gets the cache profile its HTML twin gets. Set explicitly here rather than
 * inherited from the apex project's fallback header, which only applies because
 * this app currently sends none.
 */
export const MARKDOWN_CACHE_CONTROL = "public, max-age=300, stale-while-revalidate=60";

/**
 * Returns true when an `Accept` header explicitly asks for `text/markdown`
 * and does not prefer HTML over it. Browsers never list `text/markdown`, so
 * regular traffic is unaffected; agents send `Accept: text/markdown` (alone
 * or alongside other types) to opt in. A client listing both types picks the
 * winner via RFC 9110 quality values, e.g. `text/markdown;q=0.5,text/html`
 * still receives HTML. HTML's effective quality also honours wildcard ranges
 * (`text/*`, `star/star`) per RFC 9110 specificity, so
 * `text/markdown;q=0.5,text/*;q=0.9` receives HTML too - but a wildcard
 * alone never opts a client into markdown.
 */
export function acceptsMarkdown(acceptHeader: string | null | undefined): boolean {
    if (!acceptHeader) return false;
    // Cheap pre-filter before parsing: the header must mention the type.
    if (!acceptHeader.toLowerCase().includes("text/markdown")) return false;

    let markdown: number | null = null;
    let html: number | null = null;
    let textWildcard: number | null = null;
    let anyWildcard: number | null = null;

    for (const part of acceptHeader.split(",")) {
        const [range, ...params] = part.split(";");
        const media = range?.trim().toLowerCase();
        if (!media) continue;

        let q = 1;
        for (const param of params) {
            const eq = param.indexOf("=");
            if (eq === -1) continue;
            if (param.slice(0, eq).trim().toLowerCase() !== "q") continue;
            const value = Number.parseFloat(param.slice(eq + 1).trim());
            if (Number.isFinite(value)) q = Math.min(Math.max(value, 0), 1);
        }

        if (media === "text/markdown") {
            markdown = Math.max(markdown ?? 0, q);
        } else if (media === "text/html" || media === "application/xhtml+xml") {
            html = Math.max(html ?? 0, q);
        } else if (media === "text/*") {
            textWildcard = Math.max(textWildcard ?? 0, q);
        } else if (media === "*/*") {
            anyWildcard = Math.max(anyWildcard ?? 0, q);
        }
    }

    // Markdown must be listed explicitly to opt in; a wildcard never counts
    // (explicit ranges are more specific, so they set markdown's quality).
    if (markdown === null || markdown <= 0) return false;
    // HTML's quality comes from its most specific matching range.
    const htmlQuality = html ?? textWildcard ?? anyWildcard;
    return htmlQuality === null || markdown >= htmlQuality;
}

/**
 * Rough token estimate (~4 characters per token for English prose), matching
 * the "estimated tokens" semantics of Cloudflare's `x-markdown-tokens`.
 */
export function estimateTokens(text: string): number {
    if (text.length === 0) return 0;
    return Math.max(1, Math.ceil(text.length / 4));
}
