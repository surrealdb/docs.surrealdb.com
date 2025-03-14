// These are all the various docs that we have. Previously there was just "surrealdb documentation" without a segment for that in the URL.
// Any segment in `/docs/{segment}/...` not in this list should be redirected to `/docs/surrealdb/{segment}/...`
// Therefor we keep this list of exceptions
const validSections = [
	'surrealdb',
	'surrealml',
	'surrealist',
	'surrealism',
	'surrealql',
	'sdk',
	'tutorials',
	'cloud',
];

// We previously had versioned docs. Turns out this was terrible for SEO due to duplicate content, so we reverted that after a few months. 
// This does mean that we need to extract versions from the URL, which is what this list is.
const versions = [
	'nightly',
	'1.0.x', '1.0.0',
	'1.1.x', '1.1.0',
	'1.2.x', '1.2.0',
	'1.3.x', '1.3.0',
	'2.x'
];

const prefixes = {
	'/docs/integration/libraries/': '/docs/sdk/',
	'/docs/surrealdb/integration/sdks/': '/docs/sdk/',
}

// List of static redirects from A to B
const redirects = {
	// Redirect old sdk libraries page
	'/docs/integration/libraries': '/docs/surrealdb/integration/sdks',
	// Redirect old websocket protocol page
	'/docs/integration/websocket/text': '/docs/surrealdb/integration/rpc',
	'/docs/integration/websocket/binary': '/docs/surrealdb/integration/rpc',
	'/docs/surrealdb/integration/websocket': '/docs/surrealdb/integration/rpc',
	'/docs/surrealql/statements/define/login': '/docs/surrealdb/surrealql/statements/define/user',
	// Redirect Node.js docs to JavaScript docs
	'/docs/integration/libraries/nodejs': '/docs/sdk/javascript',
	'/docs/surrealdb/integration/sdks/nodejs': '/docs/sdk/javascript',
	// Redirect Deno docs to JavaScript docs
	'/docs/integration/libraries/deno': '/docs/sdk/javascript',
	'/docs/surrealdb/integration/sdks/deno': '/docs/sdk/javascript',
	// Redirect old JavaScript SDK paths
	'/docs/sdk/javascript/setup': '/docs/sdk/javascript/core',
	'/docs/sdk/javascript/core/initialization': '/docs/sdk/javascript/core/create-a-new-connection',
	'/docs/sdk/javascript/core/authentication': '/docs/sdk/javascript/core/handling-authentication',
	'/docs/sdk/javascript/core/data-querying': '/docs/sdk/javascript/core/data-maniplulation',
	'/docs/sdk/javascript/core/methods/authenticate': '/docs/sdk/javascript/methods/authenticate',
	'/docs/sdk/javascript/core/methods/invalidate': '/docs/sdk/javascript/methods/invalidate',
	// Redirect old database function paths
	'/docs/surrealdb/surrealql/functions/array': '/docs/surrealdb/surrealql/functions/database/array',
	'/docs/surrealdb/surrealql/functions/count': '/docs/surrealdb/surrealql/functions/database/count',
	'/docs/surrealdb/surrealql/functions/crypto': '/docs/surrealdb/surrealql/functions/database/crypto',
	'/docs/surrealdb/surrealql/functions/duration': '/docs/surrealdb/surrealql/functions/database/duration',
	'/docs/surrealdb/surrealql/functions/encoding': '/docs/surrealdb/surrealql/functions/database/encoding',
	'/docs/surrealdb/surrealql/functions/geo': '/docs/surrealdb/surrealql/functions/database/geo',
	'/docs/surrealdb/surrealql/functions/http': '/docs/surrealdb/surrealql/functions/database/http',
	'/docs/surrealdb/surrealql/functions/math': '/docs/surrealdb/surrealql/functions/database/math',
	'/docs/surrealdb/surrealql/functions/meta': '/docs/surrealdb/surrealql/functions/database/meta',
	'/docs/surrealdb/surrealql/functions/object': '/docs/surrealdb/surrealql/functions/database/object',
	'/docs/surrealdb/surrealql/functions/parse': '/docs/surrealdb/surrealql/functions/database/parse',
	'/docs/surrealdb/surrealql/functions/rand': '/docs/surrealdb/surrealql/functions/database/rand',
	'/docs/surrealdb/surrealql/functions/search': '/docs/surrealdb/surrealql/functions/database/search',
	'/docs/surrealdb/surrealql/functions/session': '/docs/surrealdb/surrealql/functions/database/session',
	'/docs/surrealdb/surrealql/functions/sleep': '/docs/surrealdb/surrealql/functions/database/sleep',
	'/docs/surrealdb/surrealql/functions/string': '/docs/surrealdb/surrealql/functions/database/string',
	'/docs/surrealdb/surrealql/functions/time': '/docs/surrealdb/surrealql/functions/database/time',
	'/docs/surrealdb/surrealql/functions/type': '/docs/surrealdb/surrealql/functions/database/type',
	'/docs/surrealdb/surrealql/functions/vector': '/docs/surrealdb/surrealql/functions/database/vector',
	// Redirect old directory structure
	'/docs/intro': '/docs/surrealdb',
	'/docs/surrealdb/intro': '/docs/surrealdb',
	'/docs/cli/overview': '/docs/surrealdb/cli',
	'/docs/surrealdb/cli/overview': '/docs/surrealdb/cli',
	'/docs/deployment/overview': '/docs/surrealdb/deployment',
	'/docs/surrealdb/deployment/overview': '/docs/surrealdb/deployment',
	'/docs/embedding/overview': '/docs/surrealdb/embedding',
	'/docs/surrealdb/embedding/overview': '/docs/surrealdb/embedding',
	'/docs/faqs/overview': '/docs/surrealdb/faqs',
	'/docs/surrealdb/faqs/overview': '/docs/surrealdb/faqs',
	'/docs/how-to/overview': '/docs/tutorials',
	'/docs/surrealdb/how-to/overview': '/docs/tutorials',
	'/docs/tutorials/overview': '/docs/tutorials',
	'/docs/surrealdb/tutorials/overview': '/docs/tutorials',
	'/docs/surrealdb/tutorials': '/docs/tutorials',
	'/docs/installation/overview': '/docs/surrealdb/installation',
	'/docs/surrealdb/installation/overview': '/docs/surrealdb/installation',
	'/docs/integration/overview': '/docs/surrealdb/integration',
	'/docs/surrealdb/integration/overview': '/docs/surrealdb/integration',
	'/docs/integration/sdks/overview': '/docs/surrealdb/integration/sdks',
	'/docs/surrealdb/integration/sdks/overview': '/docs/surrealdb/integration/sdks',
	'/docs/introduction/overview': '/docs/surrealdb/introduction',
	'/docs/surrealdb/introduction/overview': '/docs/surrealdb/introduction',
	'/docs/surrealql/overview': '/docs/surrealql',
	'/docs/surrealdb/surrealql/overview': '/docs/surrealql',
	'/docs/surrealql/datamodel/overview': '/docs/surrealql/datamodel',
	'/docs/surrealdb/surrealql/datamodel/overview': '/docs/surrealql/datamodel',
	'/docs/surrealql/functions/overview': '/docs/surrealql/functions',
	'/docs/surrealdb/surrealql/functions/overview': '/docs/surrealql/functions',
	'/docs/surrealql/functions/script/overview': '/docs/surrealql/functions/script',
	'/docs/surrealdb/surrealql/functions/script/overview': '/docs/surrealql/functions/script',
	'/docs/surrealql/statements/overview': '/docs/surrealql/statements',
	'/docs/surrealdb/surrealql/statements/overview': '/docs/surrealql/statements',
	'/docs/surrealdb/surrealql': '/docs/surrealql',
	'/docs/surrealql/statements/define/overview': '/docs/surrealql/statements/define',
	'/docs/surrealdb/surrealql/statements/define/overview': '/docs/surrealql/statements/define',
	'/docs/surrealql/statements/remove/overview': '/docs/surrealql/statements/remove',
	'/docs/surrealdb/surrealql/statements/remove/overview': '/docs/surrealql/statements/remove',
	'/docs/surrealdb/installation/upgrading/beta': '/docs/installation/upgrading/migrating-data-to-2x',
};

function redirect(input) {
	// Redirect paths which have trailing slashes
	const path = input !== '/docs/' && input.endsWith('/') ? input.slice(0, -1) : input;
	// Redirect the user's browser permanently
	return {
		statusCode: 301,
		statusDescription: 'Moved Permanently',
		headers: {
			'cache-control': { value: 'public, max-age=86400' },
			location: { value: `https://surrealdb.com${path}` }
		}
	};
}

function compute(input) {
	let path = input;

	// Basic URLs
	if (path === '/docs') return { path: '/docs/' };
	if (path === '/docs/') return { path };
	if (path === '/docs/llms.txt') return { path, raw: true };
	if (path.startsWith('/docs/_astro/')) return { path, raw: true };

	// Version removal
	const match = path.match(/^\/docs\/(?:surrealdb\/)?([^\/]+)(\/.*)?$/);
	if (match) {
		const [,, section, rest] = match;
		if (versions.includes(section)) {
			path = `/docs/surrealdb${rest || ''}`;
		}
	}

	// Prefixed redirects
	for (const prefix in prefixes) {
		if (path.startsWith(prefix)) {
			path = `${prefixes[prefix]}${path.slice(prefix.length)}`;
			break;
		}
	}

	// Slash removal
	if (path.endsWith('/')) path = path.slice(0, -1);

	// Fixed redirects
	if (redirects[path]) path = redirects[path];

	// Return the computed path
	return { path };
}

function handler(event) {
	const request = event.request;
	const host = request.headers.host.value;
	const computed = compute(request.uri.toLowerCase());

	// Do we redirect to fix the URL first?
	if (
		host !== 'surrealdb.com' ||
		(!computed.raw && computed.path !== request.uri)
	) {
		return redirect(computed.path);
	}

	// Update the request URI
	request.uri = computed.raw
		? computed.path 
		: `${computed.path}/index.html`;

	// Return the updated request
	return request;
}
