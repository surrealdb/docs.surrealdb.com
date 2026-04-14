// -------------------------------------------------------------
// Run `bun run prebuild` to generate the list of valid paths
// -------------------------------------------------------------

import valid from "./generated/valid-paths.json";

// The base URL for the docs project
const BASE = "https://surrealdb.com/docs";
// Set for O(1) exact lookups, sorted array for prefix scanning
const PATHS = new Set(valid);
// Prefixes that should never be redirected (checked after /docs prefix is stripped)
const PASSTHROUGH = ["/api/", "/assets/", "/_", "/favicon", "/llms"];

// Redirects unknown paths to the nearest valid page. For any request
// that doesn't match a known content page, it first checks for a
// valid child (e.g. /sdk/javascript/engines → engines/node), then
// walks up the path tree to find the nearest valid parent
// (e.g. /sdk/javascript/methods/create → /sdk/javascript). This
// eliminates the need for individual redirect rules when docs
// pages are removed or restructured.
//
// So if `/sdk/javascript/engines` is removed we will:
//    check for `/docs/sdk/javascript/engines/xxxxx`
// and if it doesn't exist we will check the following:
//    check for `/docs/sdk/javascript`
//    check for `/docs/sdk`
//    check for `/docs`

export default function middleware(request: Request) {
	const url = new URL(request.url);
	// Normalize: strip /docs prefix and trailing slash
	let pathname = url.pathname.replace(/^\/docs(?=\/|$)/, "").replace(/\/$/, "") || "/";
	// Known page — let the request through to the app
	if (PATHS.has(pathname)) return;
	// Static asset, internal route, or file request — skip redirect logic
	if (PASSTHROUGH.some((p) => pathname.startsWith(p))) return;
	// Skip Vike pageContext requests (used for client-side navigation)
	if (pathname.endsWith(".pageContext.json")) return;
	// Check if a valid child page exists under this path
	const child = valid.find((p) => p.startsWith(`${pathname}/`));
	if (child) {
		return Response.redirect(`${BASE}${child}`, 302);
	}
	// Walk up the path tree to the nearest valid parent
	while (pathname !== "/") {
		// Strip the last segment and check if the parent exists
		pathname = pathname.substring(0, pathname.lastIndexOf("/")) || "/";
		// If the parent exists, redirect to it
		if (PATHS.has(pathname)) {
			return Response.redirect(`${BASE}${pathname === "/" ? "" : pathname}`, 302);
		}
	}
	// Nothing matched — redirect to the docs root
	return Response.redirect(BASE, 302);
}

export const config = {
	matcher: "/((?!assets/|_next/|_astro/|favicon|llms|txt|xml).*)",
};
