/** Parameters of an analytics event. Values must not hold personal data. */
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

/**
 * Sends an event to Google Analytics.
 *
 * The docs load the website's `/analytics.js` from the apex domain (see
 * `+Head.tsx`), which defines `window.gtag` and, where it exists,
 * `window.sdbTrack`. Each is optional: during `bun run dev` and on preview
 * deployments `/analytics.js` does not exist, and before the deferred script
 * runs neither global is defined, so the event is dropped instead of
 * throwing.
 *
 * An event sent with `dataLayer.push({ event })` reaches only a Tag Manager
 * trigger written for it, so events go through the Google tag instead, which
 * sends them to Google Analytics directly.
 */
export function trackEvent(name: string, params: AnalyticsParams = {}): void {
    if (typeof window === "undefined") return;

    if (typeof window.sdbTrack === "function") {
        window.sdbTrack(name, params);
        return;
    }

    window.gtag?.("event", name, params);
}

/**
 * Reports a copy of the setup prompt, from whichever place it was copied: the
 * page menu, the home page panel, or an `<AgentPrompt />` without its own text.
 * Each place also sends `cta_click` with an ID of its own.
 */
export function trackSetupPromptCopy(): void {
    trackEvent("copy_setup_prompt", { page_path: window.location.pathname });
}

/**
 * A link's address as analytics reports it: the origin and the path, without
 * the query string or the fragment. A relative `href` resolves against the
 * current page.
 */
export function linkUrl(href: string): string {
    const url = new URL(href, window.location.origin);
    return url.origin + url.pathname;
}

/**
 * A search term as analytics reports it. Readers paste error messages and
 * connection strings into search, so any word holding an `@` (an email
 * address, or the credentials in `user:pass@host`) becomes `[email]`. Google
 * Analytics keeps only the first 100 characters of a value, so the term is cut
 * there too.
 */
export function searchTerm(term: string): string {
    return term.replace(/\S+@\S+/g, "[email]").slice(0, 100);
}
