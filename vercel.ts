import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
	cleanUrls: true,
	trailingSlash: false,
	rewrites: [
		// Redirect /docs to the root
		{
			source: "/docs",
			destination: "/",
			statusCode: 302,
		},
		{
			source: "/docs/(.*)",
			destination: "/$1",
			statusCode: 302,
		},
	],
	headers: [
		// Cache Vite build assets for 1 year
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
				}
			],
		},
	],
};
