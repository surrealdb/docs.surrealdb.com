/**
 * Links to addresses that are not documentation pages, handed to the browser.
 *
 * Vike's client router takes every click on a same-origin link and renders
 * the page for its address without a page load. A file in `public/`, such as
 * a showcase map or `llms.txt`, and a route that only the server answers, such
 * as an agent guide, are not pages, so the router renders the 404 page for
 * them, while a page load of the same address answers 200. Three map links on
 * the Rome showcase and the two `llms.txt` links on the Reference hub showed
 * the 404 this way until November 2026, and only on a click: opening the
 * address directly worked, which is why the links looked correct.
 *
 * Such a link is marked `data-vike="false"` as it is clicked, before Vike's
 * own listener runs, so the browser loads the address itself.
 */

/**
 * Paths under these prefixes are not pages: the server answers `/docs/llms/`
 * itself, and the rest are folders in `public/` holding HTML files. Those are
 * linked without `.html`, the address production serves them at (`cleanUrls`
 * in vercel.ts redirects the `.html` form), so they have no extension to be
 * recognised by. `bun run check:links` fails on a link to an HTML file in
 * `public/` that this list does not cover.
 */
export const DOCUMENT_PREFIXES = [
    "/docs/llms/",
    "/docs/cli-history/",
    "/docs/engine-settings/",
    "/docs/parentheses/",
    "/docs/showcase/",
    "/docs/start-builder/",
];

/**
 * Whether `href` names an address on `origin` that is not a documentation
 * page: a path whose last segment has a file extension, or one under
 * `DOCUMENT_PREFIXES`. A page never has an extension, because a page's slug drops dots.
 */
export function isDocumentHref(href: string, origin: string): boolean {
    let url: URL;

    try {
        url = new URL(href, origin);
    } catch {
        return false;
    }

    if (url.origin !== origin) return false;

    const last = url.pathname.slice(url.pathname.lastIndexOf("/") + 1);

    return /\.[a-z0-9]+$/i.test(last) || DOCUMENT_PREFIXES.some((p) => url.pathname.startsWith(p));
}

/**
 * Listen for clicks on links to non-page addresses and keep Vike's client
 * router out of them. Vike listens on `document` in the bubble phase, so a
 * listener on `document` in the capture phase runs first. Returns a function
 * that removes the listener.
 */
export function handOverDocumentLinks(): () => void {
    const onClick = (event: MouseEvent) => {
        if (!(event.target instanceof Element)) return;

        const link = event.target.closest("a[href]");
        const href = link?.getAttribute("href");

        if (link && href && isDocumentHref(href, location.origin)) {
            link.setAttribute("data-vike", "false");
        }
    };

    document.addEventListener("click", onClick, true);

    return () => document.removeEventListener("click", onClick, true);
}
