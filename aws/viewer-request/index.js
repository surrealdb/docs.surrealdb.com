function redirect(path) {
	return {
		statusCode: 301,
		statusDescription: 'Moved Permanently',
		headers: {
			'cache-control': { value: 'public, max-age=86400' },
			location: { value: `https://surrealdb.com${path}` }
		}
	};
}

function handler(event) {
	const request = event.request;
	const host = request.headers.host.value;
	const path = request.uri.toLowerCase();

	if (host !== 'surrealdb.com') return redirect(path);
	if (path === '/docs') return redirect('/docs/');
	if (path === '/docs/') {
		request.uri += 'index.html';
		return request;
	}

	if (/^\/docs\/(_astro\/|~partytown\/)|\/docs\/llms\.txt$/.test(path)) return request;
	if (request.uri.endsWith('/')) return redirect(path.slice(0, -1));
	if (path !== request.uri) return redirect(path);

	const redirects = {
		'/docs/integration/libraries': '/docs/surrealdb/integration/sdks',
		'/docs/integration/websocket/text': '/docs/surrealdb/integration/rpc',
		'/docs/integration/websocket/binary': '/docs/surrealdb/integration/rpc',
		'/docs/surrealdb/integration/websocket': '/docs/surrealdb/integration/rpc',
		'/docs/surrealql/statements/define/login': '/docs/surrealdb/surrealql/statements/define/user',
		'/docs/integration/libraries/nodejs': '/docs/sdk/javascript',
		'/docs/surrealdb/integration/sdks/nodejs': '/docs/sdk/javascript',
		'/docs/integration/libraries/deno': '/docs/sdk/javascript',
		'/docs/surrealdb/integration/sdks/deno': '/docs/sdk/javascript',
		'/docs/sdk/javascript/core/initialization': '/docs/sdk/javascript/core/create-a-new-connection',
		'/docs/sdk/javascript/core/authentication': '/docs/sdk/javascript/core/handling-authentication',
		'/docs/sdk/javascript/core/data-querying': '/docs/sdk/javascript/core/data-maniplulation',
		'/docs/sdk/javascript/core/methods/authenticate': '/docs/sdk/javascript/methods/authenticate',
		'/docs/sdk/javascript/core/methods/invalidate': '/docs/sdk/javascript/methods/invalidate',
		'/docs/sdk/javascript/setup': '/docs/sdk/javascript/core',
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
		'/docs/surrealql/overview': '/docs/surrealdb/surrealql',
		'/docs/surrealdb/surrealql/overview': '/docs/surrealdb/surrealql',
		'/docs/surrealql/datamodel/overview': '/docs/surrealdb/surrealql/datamodel',
		'/docs/surrealdb/surrealql/datamodel/overview': '/docs/surrealdb/surrealql/datamodel',
		'/docs/surrealql/functions/overview': '/docs/surrealdb/surrealql/functions',
		'/docs/surrealdb/surrealql/functions/overview': '/docs/surrealdb/surrealql/functions',
		'/docs/surrealql/functions/script/overview': '/docs/surrealdb/surrealql/functions/script',
		'/docs/surrealdb/surrealql/functions/script/overview': '/docs/surrealdb/surrealql/functions/script',
		'/docs/surrealql/statements/overview': '/docs/surrealdb/surrealql/statements',
		'/docs/surrealdb/surrealql/statements/overview': '/docs/surrealdb/surrealql/statements',
		'/docs/surrealdb/surrealql': '/docs/surrealql',
		'/docs/surrealql/statements/define/overview': '/docs/surrealdb/surrealql/statements/define',
		'/docs/surrealdb/surrealql/statements/define/overview': '/docs/surrealdb/surrealql/statements/define',
		'/docs/surrealql/statements/remove/overview': '/docs/surrealdb/surrealql/statements/remove',
		'/docs/surrealdb/surrealql/statements/remove/overview': '/docs/surrealdb/surrealql/statements/remove',
		'/docs/surrealdb/installation/upgrading/beta': '/docs/surrealdb/installation/upgrading/migrating-data-to-2x'
	};

	if (redirects[path]) return redirect(redirects[path]);

	const versionPrefixes = [
		'/docs/nightly/',
		'/docs/surrealdb/nightly/',
		'/docs/1.0.x/', '/docs/1.0.0/',
		'/docs/1.1.x/', '/docs/1.1.0/',
		'/docs/1.2.x/', '/docs/1.2.0/',
		'/docs/1.3.x/', '/docs/1.3.0/',
		'/docs/surrealdb/2.x/',
		'/docs/surrealdb/1.0.x/', '/docs/surrealdb/1.0.0/',
		'/docs/surrealdb/1.1.x/', '/docs/surrealdb/1.1.0/',
		'/docs/surrealdb/1.2.x/', '/docs/surrealdb/1.2.0/',
		'/docs/surrealdb/1.3.x/', '/docs/surrealdb/1.3.0/'
	];

	for (const prefix of versionPrefixes) {
		if (path.startsWith(prefix)) {
			return redirect(`/docs/surrealdb/${path.slice(prefix.length)}`);
		}
	}

	if (path.startsWith('/docs/integration/libraries/')) {
		return redirect(`/docs/sdk/${path.slice(28)}`);
	}
	if (path.startsWith('/docs/surrealdb/integration/sdks/')) {
		return redirect(`/docs/sdk/${path.slice(33)}`);
	}

	if (path.startsWith('/docs/')) {
		const section = path.split('/')[2];
		const validSections = ['surrealdb', 'surrealml', 'surrealist', 'surrealism', 'surrealql', 'sdk', 'tutorials', 'cloud'];
		if (!validSections.includes(section) && path !== '/docs/llms.txt') {
			return redirect(`/docs/surrealdb/${path.slice(6)}`);
		}
	}

	request.uri += '/index.html';
	return request;
}
