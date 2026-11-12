// https://vike.dev/onPageTransitionEnd

export async function onPageTransitionEnd() {
    if (typeof document === "undefined") return;
    reportPageView();
}

type TrackingWindow = Window & {
    _hsq?: unknown[][];
    twq?: (command: string, event: string) => void;
};

/**
 * Tell the tracking vendors about a client-side navigation.
 *
 * The page loads `/analytics.js` from the apex site (see `+Head.tsx`), which
 * records the first page view for each vendor. After that Vike routes in the
 * browser, so without this call HubSpot and X see one page view per visit no
 * matter how many docs pages a reader opens.
 *
 * `analytics.js` defines a queue stub for each vendor straight away, and each
 * vendor's script replays its queue when it loads. Each call checks its own
 * global, so on a host where `/analytics.js` does not exist, such as a preview
 * deployment or `bun run dev`, nothing is sent.
 *
 * Google is not called here. The Google tag and the Tag Manager container
 * both record a client-side navigation through their own browser-history
 * trigger, so a `page_view` sent from here would count each one twice.
 * LinkedIn's Insight Tag has no page-view call: `lintrk("track")` records a
 * conversion.
 *
 * This mirrors `+onPageTransitionEnd.ts` in www.surrealdb.com, which does the
 * same for the rest of the site.
 */
let lastPath = typeof window === "undefined" ? "" : window.location.pathname;

function reportPageView() {
    const w = window as TrackingWindow;

    // A change to the query string or the hash alone stays on the same page.
    if (window.location.pathname === lastPath) return;
    lastPath = window.location.pathname;

    if (w._hsq) {
        w._hsq.push(["setPath", window.location.pathname + window.location.search]);
        w._hsq.push(["trackPageView"]);
    }

    // The same event `analytics.js` sends to X on the first page load.
    w.twq?.("event", "PageView");
}
