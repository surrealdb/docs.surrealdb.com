---
sidebar_position: 1
sidebar_label: connect
title: JavaScript | SDK | Methods | connect
description: The SurrealDB SDK for JavaScript enables simple and advanced querying of a remote or embedded database.
---

# `.connect()` {#connect}

Connects to a local or remote database endpoint.

```javascript title="Method Syntax"
db.connect(url, options)
```

### Arguments
<table>
    <thead>
        <tr>
            <th colspan="2" scope="col">Arguments</th>
            <th colspan="2" scope="col">Description</th>
        </tr>
    </thead>  
    <tbody>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>url</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The url of the database endpoint to connect to.
            </td>
        </tr>
                <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>options</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                An object with options to initiate the connection to SurrealDB.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

There are several ways to connect to a database endpoint. You can connect to a local or remote endpoint, specify a namespace and database pair to use, authenticate with an existing token, authenticate using a pair of credentials, or use advanced custom logic to prepare the connection to the database.

```ts
// Connect to a local endpoint
await db.connect('http://127.0.0.1:8000/rpc');

// Connect to a remote endpoint
await db.connect('https://cloud.surrealdb.com/rpc');

// Specify a namespace and database pair to use
await db.connect('https://cloud.surrealdb.com/rpc', {
	namespace: 'surrealdb',
	database: 'docs',
});

// Authenticate with an existing token
// The .authenticate() function is used under the hood.
await db.connect('https://cloud.surrealdb.com/rpc', {
	auth: '.....',
});

// Authenticate using a pair of credentials
await db.connect('https://cloud.surrealdb.com/rpc', {
	auth: {
		username: 'root',
		password: 'surrealdb',
	},
});

// Use advanced custom logic to prepare the connection to the database
await db.connect('https://cloud.surrealdb.com/rpc', {
	prepare: async (db) => {
		await db.use({ namespace: 'surrealdb', database: 'docs' });

		const token = await retrieveToken();
		if (token) await db.authenticate(token);

		// Any queries executed before the .prepare() function finishes will be forced to wait
		// Please note that this is also the case for queries executed within the prepare function
		// Doing so can cause the connection to stay in a initializing state
	},
});
```