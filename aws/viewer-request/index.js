// // These are all the various docs that we have. Previously there was just "surrealdb documentation" without a segment for that in the URL.
// Any segment in `/docs/{segment}/...` not in this list should be redirected to `/docs/surrealdb/{segment}/...`
// Therefor we keep this list of exceptions
const validDocs = [
	'surrealdb',
	'surrealml',
	'surrealist',
	'surrealkv',
	'surrealism',
	'surrealql',
	'sdk',
	'tutorials',
	'cloud',
	'integrations',
	'examples',
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
	// Redirect root to SurrealDB docs
	'/docs': '/docs/surrealdb',
	'/docs/': '/docs/surrealdb',
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
	// Redirect removed deployment guides to main deployment page
	'/docs/surrealdb/deployment/heroku': '/docs/surrealdb/deployment',
	'/docs/surrealdb/deployment/railway': '/docs/surrealdb/deployment',
	'/docs/surrealdb/deployment/digitalocean': '/docs/surrealdb/deployment',
	'/docs/surrealdb/deployment/fly': '/docs/surrealdb/deployment',
	'/docs/integrations/data-mangaement': '/docs/integrations/data-managaement',
};

function compute(input) {
	// Path should be lowercase
	let path = input.toLowerCase();

	// Handle /docs and /docs/ cases
	if (path === '/docs' || path === '/docs/') {
		return {
			path: '/docs/surrealdb',
			raw: true
		};
	}

	// Basic URLs
	if (path === '/docs/llms.txt') return { path, raw: true };
	if (path.startsWith('/docs/_astro/')) return { path: input, raw: true };

	// Version removal
	const match = path.match(/^\/docs\/(?:surrealdb\/)?([^\/]+)(\/.*)?$/);
	if (match && versions.includes(match[1])) {
		path = `/docs/surrealdb${match[2] || ''}`;
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

	// Convert underscores to hyphens in any path
	if (path.includes('_')) {
		const newPath = path.replace(/_/g, '-');
		if (newPath !== path) {
			path = newPath;
		}
	}

	// Check that the URL points to a valid document
	// See top of file for more information
	if (path.startsWith('/docs/')) {
		const doc = path.split('/')[2];
		if (!validDocs.includes(doc)) {
			path = `/docs/surrealdb/${path.slice(6)}`;
		}
	}

	// Return the computed path
	return { path };
}

function handler(event) {
	const request = event.request;
	const host = request.headers.host.value;
	const computed = compute(request.uri);

	// Do we redirect to fix the URL first?
	if (
		host !== 'surrealdb.com' ||
		(!computed.raw && (computed.path !== request.uri))
	) {
		return {
			statusCode: 301,
			statusDescription: 'Moved Permanently',
			headers: {
				'cache-control': { value: 'public, max-age=86400' },
				location: { value: `https://surrealdb.com${computed.path}` }
			}
		}
	}

	// Update the request URI
	request.uri = computed.raw
		? computed.path 
		: `${computed.path}/index.html`;

	// Return the updated request
	return request;
}
