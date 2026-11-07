import vike, { type App } from "@vikejs/hono";
import { Hono } from "hono";
import type { Server } from "vike/types";
import agentInstructions from "~/lib/agent-instructions.md?raw";
import { handleFeedbackRequest } from "~/lib/api/feedback";
import { handleSearchRequest } from "~/lib/api/search";
import { type Assets, serveEdge } from "~/lib/edge-routes";
import { fetchAllSdkVersions } from "~/lib/versions";
import { agentGuidePath } from "~/utils/agent-guides";
import {
    AGENT_DISCOVERY_LINK_HEADER,
    acceptsMarkdown,
    estimateTokens,
    MARKDOWN_CACHE_CONTROL,
    MARKDOWN_CONTENT_TYPE,
} from "~/utils/agent-markdown";
import {
    composeFullCorpusMarkdown,
    composeLabsMarkdown,
    composeRawMarkdown,
    resolveCollectionEntry,
    suffixDocsLinks,
    withIndexPointer,
} from "~/utils/collections";
import { withRelated } from "~/utils/related";
import { redirectDestinationForDev, resolveRedirect } from "../../redirects";

const BASE = "/docs";

/**
 * Whether this bundle is the Cloudflare Workers build. Replaced at build time by
 * Vite's `define` (see vite.config.ts), so the Vercel bundle drops the branches.
 */
const IS_CLOUDFLARE = import.meta.env.DEPLOY_TARGET === "cloudflare";

const app = new Hono();

/**
 * The JSON endpoints. On Vercel they are functions in `api/`; the Worker serves
 * the same handlers from `src/lib/api/` here, so there is one implementation.
 * They reach SurrealDB over the SDK's HTTP engine, so `SURREAL_ENDPOINT` must be
 * an `https://` URL on Cloudflare: Workers cannot open an outbound WebSocket.
 */
if (IS_CLOUDFLARE) {
    app.all(`${BASE}/api/search`, (c) => handleSearchRequest(c.req.raw));
    app.all(`${BASE}/api/feedback`, (c) => handleFeedbackRequest(c.req.raw));
}

/**
 * Advertise the page index on every response, HTML included.
 *
 * The HTML pages carry the same relation as a `<link>` tag from `+Head.tsx`,
 * which is the form a reader's browser and most crawlers see. This covers
 * everything else the app serves - the `.md` pages, `llms-full.txt`, the agent
 * instructions - none of which has a document head to put a tag in.
 *
 * Registered before every route so the header lands on their responses too.
 */
app.use("*", async (c, next) => {
    await next();
    // Appended rather than set, so a `Link` header a route or the adapter has
    // already attached - preload hints are the usual reason - survives beside
    // this one instead of being replaced by it.
    c.res.headers.append("Link", AGENT_DISCOVERY_LINK_HEADER);
});

/**
 * The full documentation corpus as one markdown document, following the
 * llms-full.txt convention. The hand-maintained index at `/docs/llms.txt`
 * links pages individually; this endpoint serves every page in one response
 * for agents that prefer a single fetch over walking the index.
 *
 * Composed once per server instance: the content is fixed at build time, and
 * SDK versions come from the same file-backed cache the page render uses. A
 * failed compose is not memoised, so the next request retries.
 */
let fullCorpus: Promise<string> | undefined;

app.get(`${BASE}/llms-full.txt`, async (c) => {
    if (!fullCorpus) {
        fullCorpus = fetchAllSdkVersions().then(composeFullCorpusMarkdown);
        fullCorpus.catch(() => {
            fullCorpus = undefined;
        });
    }

    const markdown = await fullCorpus;

    return c.body(markdown, 200, {
        "Content-Type": MARKDOWN_CONTENT_TYPE,
        "Cache-Control": MARKDOWN_CACHE_CONTROL,
        "X-Markdown-Tokens": String(estimateTokens(markdown)),
        // One giant concatenation of pages that are all indexed at their own
        // URLs; keep it out of search results as a duplicate.
        "X-Robots-Tag": "noindex",
    });
});

/**
 * The agent setup instructions, served exactly as written.
 *
 * This one is not a documentation page. It is addressed to an AI coding agent
 * in the second person and read by fetching it, so it is kept out of the
 * content collections: a collection entry would render as an article for people
 * and would gain a title and a description written about the document rather
 * than to its reader.
 *
 * Its internal links still get the `.md` treatment the collections give theirs,
 * so an agent following one stays in markdown.
 *
 * The URL is quoted verbatim in the prompt the setup page and SurrealDB Studio
 * copy to the clipboard, so it is a stable address: change the document, not
 * the path.
 *
 * No index pointer on this one, unlike the `.md` pages. The document is a
 * prompt rather than a page, and it reaches an agent through a clipboard, so a
 * blockquote about the documentation index would be the first thing the agent
 * read and the last thing it needed. The `Link` header advertises the index on
 * this response anyway.
 */
const agentInstructionsBody = `${suffixDocsLinks(agentInstructions.trimEnd())}\n`;

app.get(`${BASE}/agents/instructions.md`, (c) =>
    c.body(agentInstructionsBody, 200, {
        "Content-Type": MARKDOWN_CONTENT_TYPE,
        "Cache-Control": MARKDOWN_CACHE_CONTROL,
        "X-Markdown-Tokens": String(estimateTokens(agentInstructionsBody)),
    }),
);

/**
 * A page's markdown representation, as both the `.md` URLs and the agent
 * guides serve it: the page with its related lessons and posts, below a
 * pointer to the documentation index.
 *
 * SDK versions come from the same file-backed cache the page render uses, so
 * `<Version>` markers report what the HTML reports.
 */
async function composePageMarkdown(
    entry: NonNullable<ReturnType<typeof resolveCollectionEntry>>,
    docsPath: string,
): Promise<string> {
    const sdkVersions = await fetchAllSdkVersions();

    return withIndexPointer(withRelated(composeRawMarkdown(entry, sdkVersions), docsPath));
}

/**
 * Guides for coding agents, at a stable slug that names a documentation page.
 * The map of slugs and the reason for it are in `~/utils/agent-guides`.
 *
 * Marked `noindex`, like a `.md` URL, because each guide duplicates the page
 * it names. An unknown slug is a 404 rather than a redirect, so a typo in a
 * prompt fails where it can be seen.
 */
app.get(`${BASE}/llms/guides/:slug`, async (c) => {
    const path = agentGuidePath(c.req.param("slug"));
    const entry = path === undefined ? undefined : resolveCollectionEntry(path);

    if (path === undefined || !entry) {
        return c.text("Not Found", 404);
    }

    const markdown = await composePageMarkdown(entry, `/docs${path}`);

    return c.body(markdown, 200, {
        "Content-Type": MARKDOWN_CONTENT_TYPE,
        "Cache-Control": MARKDOWN_CACHE_CONTROL,
        "X-Markdown-Tokens": String(estimateTokens(markdown)),
        "X-Robots-Tag": "noindex",
    });
});

/**
 * Serves a page's markdown representation, two ways:
 *
 *   - a `.md`-suffixed URL, e.g.
 *     `/docs/reference/query-language/statements/select.md`, and
 *   - content negotiation, when a request for the page's own URL sends
 *     `Accept: text/markdown`.
 *
 * The apex site answers negotiation in edge middleware, but that middleware
 * skips `/docs` entirely, so both entry points have to be served here.
 * Registered before Vike so it wins over Vike's catch-all route.
 *
 * The two differ only in cache and indexing metadata. A `.md` URL is a distinct
 * URL, so it is marked `noindex` to keep it out of search results as a duplicate
 * of the page it mirrors - which matters now that every page links its own `.md`
 * URL from the "View as Markdown" menu. A negotiated response is the *same* URL
 * as the HTML, so it carries `Vary: Accept` instead and stays indexable.
 */
app.get("*", async (c, next) => {
    const { pathname } = new URL(c.req.url);
    const suffixed = pathname.endsWith(".md");
    const negotiated = !suffixed && acceptsMarkdown(c.req.header("accept"));

    if (!suffixed && !negotiated) {
        return next();
    }

    const path = (suffixed ? pathname.slice(0, -".md".length) : pathname).replace(
        new RegExp(`^${BASE}`),
        "",
    );
    // Labs is a React listing over `getLabItems()`, not a documentation
    // collection, so the resolver below cannot see it. It is listed in
    // `llms.txt` all the same, and the index promises `.md` on any entry, so
    // it is answered here - by both entry points, like every other page.
    if (path === "/labs") {
        // Wrapped like every other page: an agent that reaches this listing
        // from a search result learns the index exists the same way.
        const labs = withIndexPointer(composeLabsMarkdown());

        return c.body(labs, 200, {
            "Content-Type": MARKDOWN_CONTENT_TYPE,
            "Cache-Control": MARKDOWN_CACHE_CONTROL,
            "X-Markdown-Tokens": String(estimateTokens(labs)),
            ...(suffixed ? { "X-Robots-Tag": "noindex" } : { Vary: "Accept" }),
        });
    }

    // The docs root cannot carry the suffix on its own path, so `/docs/index.md`
    // addresses it - the same convention the apex site uses for its homepage.
    const entry = resolveCollectionEntry(path.replace(/^\/?index$/, ""));

    if (!entry) {
        // A negotiated request is for the page's own URL, which the redirect
        // layer has already had its chance at, and may be for an asset or a
        // non-content route - so let Vike answer it.
        if (negotiated) {
            return next();
        }

        // A moved page keeps its markdown form. Redirect sources are authored
        // without the suffix, so the lookup goes on the stripped path and the
        // suffix is put back on the destination.
        //
        // A wildcard rule carries a `.md` through on its own, because the
        // suffix is just more path, but an exact rule is a literal string that
        // the suffixed path never equals. That is why `/docs/self-hosted/
        // overview.md` resolved while every renamed page's markdown form
        // answered 404 - a difference no author would predict from the rules.
        // Handled once here rather than by pairing each exact rule with a
        // `.md` twin, which would double the table to fix one case at a time.
        const moved = resolveRedirect(path);

        if (moved) {
            // `destination` should already carry `/docs`, but a handful of
            // older rules omit it, and this response is the same
            // browser-facing `Location` those rules get elsewhere.
            // The table holds 301s for content moves and 302s for everything
            // else; `statusCode` is a plain `number` there, and Hono wants one
            // of its redirect codes.
            return c.redirect(
                `${redirectDestinationForDev(moved.destination)}.md`,
                moved.statusCode === 301 ? 301 : 302,
            );
        }

        // A `.md` URL naming a page that never existed.
        return c.text("Not Found", 404);
    }

    const docsPath = `/docs/${path.replace(/^\/?index$/, "").replace(/^\/+|\/+$/g, "")}`.replace(
        /\/$/,
        "",
    );
    const markdown = await composePageMarkdown(entry, docsPath);

    return c.body(markdown, 200, {
        "Content-Type": MARKDOWN_CONTENT_TYPE,
        "Cache-Control": MARKDOWN_CACHE_CONTROL,
        "X-Markdown-Tokens": String(estimateTokens(markdown)),
        ...(suffixed ? { "X-Robots-Tag": "noindex" } : { Vary: "Accept" }),
    });
});

vike(app as unknown as App);

const honoFetch = app.fetch.bind(app);

// The docs Vercel function deploys at `/`, but Vike is configured with
// `base: "/docs"`. In production the surrealdb.com CDN strips the prefix
// before forwarding, and on Vercel preview/direct access the prefix is
// absent altogether. Re-attach `/docs` here so Vike's `checkBaseUrl`
// accepts the request.
const vikeFetch = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    if (!url.pathname.startsWith(BASE)) {
        url.pathname = url.pathname === "/" ? BASE : `${BASE}${url.pathname}`;
        request = new Request(url.toString(), request);
    }
    return honoFetch(request);
};

// On Cloudflare the Worker is also the edge: `serveEdge` applies the
// `vercel.ts` redirects, static files and headers first, against the path as
// it arrived (before `/docs` is re-attached), which is where Vercel applies
// them. The Workers runtime passes `env` as the second argument; Vercel never
// does.
const fetch: Server["fetch"] = (request: Request, env?: { ASSETS?: Assets }) =>
    IS_CLOUDFLARE ? serveEdge(request, env?.ASSETS, vikeFetch) : vikeFetch(request);

export default { fetch } satisfies Server;
