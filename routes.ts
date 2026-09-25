/**
 * The documentation's routing tables: the URL-shape flags and the response
 * headers. The redirects themselves live in `redirects.ts`.
 *
 * Platform-neutral on purpose. These rules outlive any one host, and both
 * deploy targets read them from here:
 *
 *   - Vercel, via `vercel.ts`, which wraps them in a `VercelConfig` and lets
 *     the platform serve them from its own edge.
 *   - Cloudflare, via `scripts/generate-edge-routes.ts`, which compiles them
 *     into a table `src/lib/edge-routes.ts` matches inside the Worker, because
 *     Cloudflare has no layer in front of the Worker to serve them.
 *
 * Nothing here names a host or a platform, so retiring `vercel.ts` takes that
 * file's contents with it to no effect.
 */

/** A redirect. `statusCode` defaults to 302 where a rule omits it. */
export type Redirect = {
    source: string;
    destination: string;
    statusCode?: number;
};

/** Response headers applied to every request matching `source`. */
export type Header = {
    source: string;
    headers: { key: string; value: string }[];
};

/** Serve `/x.html` and `/x/index.html` at `/x`, and redirect the long forms there. */
export const cleanUrls = true;

/** Strip a trailing slash rather than adding one. */
export const trailingSlash = false;

/**
 * Written against the path this deployment sees, which has `/docs` stripped by
 * the apex project - on Vercel by its rewrite, on Cloudflare by the apex
 * Worker's proxy. Same path either way.
 */
export const headers: Header[] = [
    // Cache Vite build assets for 1 year.
    {
        source: "/assets/(.*)",
        headers: [
            {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
            },
            {
                key: "Content-Security-Policy",
                value: "default-src 'self' cdn.surrealdb.com *.intercom.io *.intercomcdn.com *.surreal.cloud; script-src 'self' cdn.surrealdb.com 'unsafe-eval' 'wasm-unsafe-eval' 'sha256-7PO9Sf8E8Z6CI+XugBIVArS8kyVNIn7bMXYo4t7CPBk=' 'sha256-emqBgr3x/toLEoCAcqjyBbyaxxFuxwPI9L1RlbodxwU=' tag.unifyintent.com *.intercom.io *.intercomcdn.com cdn.cr-relay.com js.hsforms.net static.ads-twitter.com snap.licdn.com *.vimeo.com embed.sequel.io *.youtube.com youtube.com static.reo.dev *.googletagmanager.com; script-src-elem 'self' cdn.surrealdb.com 'sha256-KDbxcgtFUNQqWpoQ3iz+nWCd2kv0gZmIfB/Bmo2Xcvs=' 'sha256-emqBgr3x/toLEoCAcqjyBbyaxxFuxwPI9L1RlbodxwU=' tag.unifyintent.com *.intercom.io *.intercomcdn.com cdn.cr-relay.com js.hsforms.net static.ads-twitter.com snap.licdn.com *.vimeo.com embed.sequel.io *.youtube.com youtube.com static.reo.dev *.googletagmanager.com; style-src 'self' cdn.surrealdb.com 'unsafe-inline' fonts.googleapis.com *.intercomcdn.com embed.sequel.io; img-src 'self' cdn.surrealdb.com blob: data: images.ctfassets.net *.intercomcdn.com *.intercomassets.com *.intercom.io *.intercomusercontent.com *.intercom-attachments.com cdn.brandsafe.io *.evbuc.com *.hsforms.com t.co *.linkedin.com i.ytimg.com *.sequel.io analytics.twitter.com *.google-analytics.com *.analytics.google.com; connect-src 'self' cdn.surrealdb.com https://surrealdb.com api.unifyintent.com px.ads.linkedin.com *.intercom.io wss: *.intercomcdn.com *.intercomusercontent.com api.cr-relay.com auth.surrealdb.com *.surreal.cloud wss: app.surrealdb.com version.surrealdb.com *.hsforms.com i.ytimg.com pokeapi.co *.sequel.io api.reo.dev *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.googleadservices.com *.google.com *.doubleclick.net *.google.nl *.google.co.uk *.google.de *.google.fr *.google.es *.google.it *.google.ca *.google.com.au *.google.co.in *.google.co.jp *.google.com.br; frame-src 'self' https://surrealdb.com https://*.surrealdb.com https://app.surrealdb.com https://*.hsforms.com https://*.vimeo.com https://googleusercontent.com https://youtube.com https://*.youtube.com https://intercom-sheets.com https://*.intercom-reporting.com https://embed.sequel.io; font-src 'self' cdn.surrealdb.com fonts.gstatic.com *.intercomcdn.com *.sequel.io; media-src 'self' cdn.surrealdb.com cdn.brandsafe.io i.ytimg.com surrealdb.s3.amazonaws.com *.intercomcdn.com *.sequel.io; object-src 'none'; form-action 'self' *.hsforms.com *.intercom.io intercom.help; frame-ancestors 'self'; base-uri 'self'; upgrade-insecure-requests",
            },
        ],
    },
];
