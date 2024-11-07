function redirect(location) {
	return {
		statusCode: 301,
		statusDescription: 'Moved Permanently',
		headers: {
			'cache-control': {
				value: 'public, max-age=86400',
			},
			location: {
				value: location,
			},
		},
	};
}

function handler(event) {

	const request = event.request;
	const host = request.headers.host.value;
	let path = request.uri.toLowerCase();

	// Only use the base domain, not subdomains
	if (host !== 'surrealdb.com') {
		return redirect(`https://surrealdb.com${path}`);
	}

	// Docusaurus base path always has a trailing slash
	if (path === '/docs') {
		return redirect('https://surrealdb.com/docs/');
	}

	// Display the content for the documentation path
	if (path === '/docs/') {
		request.uri = request.uri.concat('index.html');
		return request;
	}

	// Display any documentation assets and image files
	if (path.startsWith('/docs/_astro/') || path.startsWith('/docs/~partytown/')) {
		return request;
	}

	// Redirect any paths which have trailing slashes
	if (request.uri.endsWith('/')) {
		return redirect(`https://surrealdb.com${path.slice(0, -1)}`);
	}

	// Redirect any capitalised paths to lowercase
	if (path !== request.uri) {
		return redirect(`https://surrealdb.com${path}`);
	}

	if (path.endsWith('/')) {
		path = path.slice(0, -1);
	}

	switch (path) {
		// Redirect old sdk libraries page
		case '/docs/integration/libraries':
			return redirect('https://surrealdb.com/docs/surrealdb/integration/sdks');
		// Redirect old websocket protocol page
		case '/docs/integration/websocket/text':
		case '/docs/integration/websocket/binary':
		case '/docs/surrealdb/integration/websocket':
				return redirect('https://surrealdb.com/docs/surrealdb/integration/rpc');
		// Redirect old DEFINE LOGIN statement page
		case '/docs/surrealql/statements/define/login':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql/statements/define/user');
		// Redirect NodeJS docs to JavaScript docs
		case '/docs/integration/libraries/nodejs':
		case '/docs/surrealdb/integration/sdks/nodejs':
			return redirect('https://surrealdb.com/docs/sdk/javascript');
		// Redirect Deno docs to JavaScript docs
		case '/docs/integration/libraries/deno':
		case '/docs/surrealdb/integration/sdks/deno':
			return redirect('https://surrealdb.com/docs/sdk/javascript');
		// Redirect broken JS SDK doc urls
		case '/docs/sdk/javascript/core/initialization':
			return redirect('/docs/sdk/javascript/core/create-a-new-connection');
		case '/docs/sdk/javascript/core/authentication':
			return redirect('/docs/sdk/javascript/core/handling-authentication');
		case '/docs/sdk/javascript/core/data-querying':
			return redirect('/docs/sdk/javascript/core/data-maniplulation');
		case '/docs/sdk/javascript/core/methods/authenticate':
			return redirect('/docs/sdk/javascript/methods/authenticate');
		case '/docs/sdk/javascript/core/methods/invalidate':
			return redirect('/docs/sdk/javascript/methods/invalidate');
		case '/docs/sdk/javascript/setup':
			return redirect('/docs/sdk/javascript/core');
		// Redirect old SurrealQL functions pages
		case '/docs/surrealdb/surrealql/functions/array':
		case '/docs/surrealdb/surrealql/functions/count':
		case '/docs/surrealdb/surrealql/functions/crypto':
		case '/docs/surrealdb/surrealql/functions/duration':
		case '/docs/surrealdb/surrealql/functions/encoding':
		case '/docs/surrealdb/surrealql/functions/geo':
		case '/docs/surrealdb/surrealql/functions/http':
		case '/docs/surrealdb/surrealql/functions/math':
		case '/docs/surrealdb/surrealql/functions/meta':
		case '/docs/surrealdb/surrealql/functions/object':
		case '/docs/surrealdb/surrealql/functions/parse':
		case '/docs/surrealdb/surrealql/functions/rand':
		case '/docs/surrealdb/surrealql/functions/search':
		case '/docs/surrealdb/surrealql/functions/session':
		case '/docs/surrealdb/surrealql/functions/sleep':
		case '/docs/surrealdb/surrealql/functions/string':
		case '/docs/surrealdb/surrealql/functions/time':
		case '/docs/surrealdb/surrealql/functions/type':
		case '/docs/surrealdb/surrealql/functions/vector':
			return redirect(`https://surrealdb.com/docs/surrealdb/surrealql/functions/database/${path.slice(36)}`);
		// Redirect old directory structure
		case '/docs/intro':
		case '/docs/surrealdb/intro':
			return redirect('https://surrealdb.com/docs/surrealdb');
		case '/docs/cli/overview':
		case '/docs/surrealdb/cli/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/cli');
		case '/docs/deployment/overview':
		case '/docs/surrealdb/deployment/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/deployment');
		case '/docs/embedding/overview':
		case '/docs/surrealdb/embedding/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/embedding');
		case '/docs/faqs/overview':
		case '/docs/surrealdb/faqs/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/faqs');
		case '/docs/how-to/overview':
		case '/docs/surrealdb/how-to/overview':
			return redirect('https://surrealdb.com/docs/tutorials');
		case '/docs/tutorials/overview':
		case '/docs/surrealdb/tutorials/overview':
			return redirect('https://surrealdb.com/docs/tutorials');
		case '/docs/surrealdb/tutorials':
			return redirect('https://surrealdb.com/docs/tutorials');
		case '/docs/installation/overview':
		case '/docs/surrealdb/installation/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/installation');
		case '/docs/integration/overview':
		case '/docs/surrealdb/integration/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/integration');
		case '/docs/integration/sdks/overview':
		case '/docs/surrealdb/integration/sdks/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/integration/sdks');
		case '/docs/introduction/overview':
		case '/docs/surrealdb/introduction/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/introduction');
		case '/docs/surrealql/overview':
		case '/docs/surrealdb/surrealql/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql');
		case '/docs/surrealql/datamodel/overview':
		case '/docs/surrealdb/surrealql/datamodel/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql/datamodel');
		case '/docs/surrealql/functions/overview':
		case '/docs/surrealdb/surrealql/functions/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql/functions');
		case '/docs/surrealql/functions/script/overview':
		case '/docs/surrealdb/surrealql/functions/script/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql/functions/script');
		case '/docs/surrealql/statements/overview':
		case '/docs/surrealdb/surrealql/statements/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql/statements');
		case '/docs/surrealdb/surrealql':
			return redirect('https://surrealdb.com/docs/surrealql');
		case '/docs/surrealql/statements/define/overview':
		case '/docs/surrealdb/surrealql/statements/define/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql/statements/define');
		case '/docs/surrealql/statements/remove/overview':
		case '/docs/surrealdb/surrealql/statements/remove/overview':
			return redirect('https://surrealdb.com/docs/surrealdb/surrealql/statements/remove');
		case '/docs/surrealdb/installation/upgrading/beta':
			return redirect('/docs/surrealdb/installation/upgrading/migrating-data-to-2x');
		case '/docs/1.0.x':
		case '/docs/1.0.0':
		case '/docs/1.1.x':
		case '/docs/1.1.0':
		case '/docs/1.2.x':
		case '/docs/1.2.0':
		case '/docs/1.3.x':
		case '/docs/1.3.0':
		case '/docs/surrealdb/2.x':
		case '/docs/surrealdb/1.0.x':
		case '/docs/surrealdb/1.0.0':
		case '/docs/surrealdb/1.1.x':
		case '/docs/surrealdb/1.1.0':
		case '/docs/surrealdb/1.2.x':
		case '/docs/surrealdb/1.2.0':
		case '/docs/surrealdb/1.3.x':
		case '/docs/surrealdb/1.3.0':
		    return redirect('https://surrealdb.com/docs/surrealdb');
	}

	switch (true) {
		// Redirect nightly pages to default
		case path.startsWith('/docs/nightly/'):
			return redirect(`https://surrealdb.com/docs/surrealdb/${path.slice(14)}`);
		// Redirect nightly pages to default
		case path.startsWith('/docs/surrealdb/nightly/'):
			return redirect(`https://surrealdb.com/docs/surrealdb/${path.slice(24)}`);
		// Redirect versioned pages to default
		case path.startsWith('/docs/1.0.x/'):
		case path.startsWith('/docs/1.0.0/'):
		case path.startsWith('/docs/1.1.x/'):
		case path.startsWith('/docs/1.1.0/'):
		case path.startsWith('/docs/1.2.x/'):
		case path.startsWith('/docs/1.2.0/'):
		case path.startsWith('/docs/1.3.x/'):
		case path.startsWith('/docs/1.3.0/'):
			return redirect(`https://surrealdb.com/docs/surrealdb/${path.slice(12)}`);
		// Redirect versioned pages to default
		case path.startsWith('/docs/surrealdb/2.x/'):
			return redirect(`https://surrealdb.com/docs/surrealdb/${path.slice(20)}`);
		case path.startsWith('/docs/surrealdb/1.0.x/'):
		case path.startsWith('/docs/surrealdb/1.0.0/'):
		case path.startsWith('/docs/surrealdb/1.1.x/'):
		case path.startsWith('/docs/surrealdb/1.1.0/'):
		case path.startsWith('/docs/surrealdb/1.2.x/'):
		case path.startsWith('/docs/surrealdb/1.2.0/'):
		case path.startsWith('/docs/surrealdb/1.3.x/'):
		case path.startsWith('/docs/surrealdb/1.3.0/'):
			return redirect(`https://surrealdb.com/docs/surrealdb/${path.slice(22)}`);
		// Redirect libraries pages to sdks
		case path.startsWith('/docs/integration/libraries/'):
			return redirect(`https://surrealdb.com/docs/sdk/${path.slice(28)}`);
		case path.startsWith('/docs/surrealdb/integration/sdks/'):
			return redirect(`https://surrealdb.com/docs/sdk/${path.slice(33)}`);
		// Redirect how-to pages to tutorials
		case path.startsWith('/docs/how-to/'):
			return redirect(`https://surrealdb.com/docs/tutorials/${path.slice(13)}`);
		case path.startsWith('/docs/surrealdb/how-to/'):
			return redirect(`https://surrealdb.com/docs/tutorials/${path.slice(23)}`);
		case path.startsWith('/docs/surrealdb/tutorials/'):
			return redirect(`https://surrealdb.com/docs/tutorials/${path.slice(26)}`);
		// Redirect SurrealQL subpaths to Querying
		case path.startsWith('/docs/surrealdb/surrealql/'):
			return redirect(`https://surrealdb.com/docs/surrealql/${path.slice(26)}`);
		// Redirect all other docs pages
		case path.startsWith('/docs/'): {
			const splitted = path.split('/').slice(1);
			switch (splitted[1]) {
				case 'surrealdb':
				case 'surrealml':
				case 'surrealist':
				case 'surrealism':
				case 'surrealql':
				case 'sdk':
				case 'tutorials':
				case undefined:
					break;
				default:
					return redirect(`https://surrealdb.com/docs/surrealdb/${path.slice(6)}`);
			}
		}
	}

	request.uri = request.uri.concat('/index.html');

	return request;

}