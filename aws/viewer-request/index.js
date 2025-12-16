const validDocs = ['surrealdb', 'surrealml', 'surrealist', 'surrealkv', 'surrealism', 'surrealql', 'sdk', 'tutorials', 'cloud', 'integrations', 'labs'];
const versions = ['nightly', '1.0.x', '1.0.0', '1.1.x', '1.1.0', '1.2.x', '1.2.0', '1.3.x', '1.3.0', '2.x'];
const prefixes = {
	'/docs/integration/libraries/': '/docs/sdk/',
	'/docs/surrealdb/integration/sdks/': '/docs/sdk/',
	'/docs/cloud/advanced-topics/': '/docs/cloud/operate-and-manage/',
}
const prefixExceptions = {
	'/docs/cloud/advanced-topics/configure-an-instance': '/docs/cloud/getting-started/create-an-instance',
	'/docs/cloud/advanced-topics/manage-organisation-permissions': '/docs/cloud/getting-started/create-an-organisation',
	'/docs/cloud/advanced-topics/search-and-shortcuts': '/docs/cloud/tooling/search-and-shortcuts',
	'/docs/cloud/advanced-topics/surrealql-editors': '/docs/cloud/tooling/search-and-shortcuts',
}
const redirects = {
	'/docs': '/docs/surrealdb',
	'/docs/': '/docs/surrealdb',
	'/docs/index.html': '/docs/surrealdb',
	'/docs/integration/libraries': '/docs/surrealdb/integration/sdks',
	'/docs/integration/websocket/text': '/docs/surrealdb/integration/rpc',
	'/docs/integration/websocket/binary': '/docs/surrealdb/integration/rpc',
	'/docs/surrealdb/integration/websocket': '/docs/surrealdb/integration/rpc',
	'/docs/surrealql/statements/define/login': '/docs/surrealdb/surrealql/statements/define/user',
	'/docs/integration/libraries/nodejs': '/docs/sdk/javascript',
	'/docs/surrealdb/integration/sdks/nodejs': '/docs/sdk/javascript',
	'/docs/integration/libraries/deno': '/docs/sdk/javascript',
	'/docs/surrealdb/integration/sdks/deno': '/docs/sdk/javascript',
	'/docs/sdk/javascript/setup': '/docs/sdk/javascript/core',
	'/docs/sdk/javascript/core/initialization': '/docs/sdk/javascript/core/create-a-new-connection',
	'/docs/sdk/javascript/core/authentication': '/docs/sdk/javascript/core/handling-authentication',
	'/docs/sdk/javascript/core/data-querying': '/docs/sdk/javascript/core/data-maniplulation',
	'/docs/sdk/javascript/core/methods/authenticate': '/docs/sdk/javascript/methods/authenticate',
	'/docs/sdk/javascript/core/methods/invalidate': '/docs/sdk/javascript/methods/invalidate',
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
	'/docs/surrealdb/deployment/heroku': '/docs/surrealdb/deployment',
	'/docs/surrealdb/deployment/railway': '/docs/surrealdb/deployment',
	'/docs/surrealdb/deployment/digitalocean': '/docs/surrealdb/deployment',
	'/docs/surrealdb/deployment/fly': '/docs/surrealdb/deployment',
	'/docs/integrations/data-mangaement': '/docs/integrations/data-management',
	'/docs/surrealdb/reference-guide/graph-relations': '/docs/surrealdb/models/graph',
	'/docs/surrealdb/reference-guide/vector-search': '/docs/surrealdb/models/vector',
	'/docs/surrealdb/reference-guide/full-text-search': '/docs/surrealdb/models/full-text-search',
	'/docs/surrealdb/reference-guide/full_text_search': '/docs/surrealdb/models/full-text-search',
	'/docs/surrealdb/reference-guide/security-best-practices': '/docs/surrealdb/security/security-best-practices',
	'/docs/surrealdb/reference-guide/security_best_practices': '/docs/surrealdb/security/security-best-practices',
};
function compute(input) {
	let path = input.toLowerCase();
	if (path === '/docs' || path === '/docs/' || path === '/docs/index.html') {
		return { path: '/docs/surrealdb', raw: false };
	}
	if (path === '/docs/llms.txt') return { path, raw: true };
	if (path.startsWith('/docs/_astro/')) return { path: input, raw: true };
	const match = path.match(/^\/docs\/(?:surrealdb\/)?([^\/]+)(\/.*)?$/);
	if (match && versions.includes(match[1])) {
		path = `/docs/surrealdb${match[2] || ''}`;
	}
	if (path.endsWith('/')) path = path.slice(0, -1);
	if (prefixExceptions[path]) {
		path = prefixExceptions[path];
	} else {
		for (const prefix in prefixes) {
			if (path.startsWith(prefix)) {
				path = `${prefixes[prefix]}${path.slice(prefix.length)}`;
				break;
			}
		}
	}
	if (path.includes('_')) {
		path = path.replace(/_/g, '-');
	}
	let redirectCount = 0;
	const maxRedirects = 10;
	while (redirects[path] && redirectCount < maxRedirects) {
		path = redirects[path];
		redirectCount++;
	}
	if (path.startsWith('/docs/')) {
		const doc = path.split('/')[2];
		if (!validDocs.includes(doc)) {
			path = `/docs/surrealdb/${path.slice(6)}`;
		}
	}
	return { path };
}
function handler(event) {
	const request = event.request;
	const host = request.headers.host.value;
	const computed = compute(request.uri);
	if (host !== 'surrealdb.com' || computed.path !== request.uri) {
		return {
			statusCode: 301,
			statusDescription: 'Moved Permanently',
			headers: {
				'cache-control': { value: 'public, max-age=86400' },
				location: { value: `https://surrealdb.com${computed.path}` }
			}
		}
	}
	request.uri = computed.raw ? computed.path : `${computed.path}/index.html`;
	return request;
}
