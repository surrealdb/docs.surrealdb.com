---
sidebar_position: 1
sidebar_label: query
title: JavaScript | SDK | Methods | query
description: The SurrealDB SDK for JavaScript enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.query()` {#query}

Runs a set of [SurrealQL statements](/docs/surrealql) against the database.

```ts title="Method Syntax"
db.query<T>(query, vars)
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
                <code>query</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Specifies the SurrealQL statements.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>vars</code>
               <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Assigns variables which can be used in the query.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```ts
type Person = {
	id: string;
	name: string;
};

// Assign the variable on the connection
const result = await db.query<[Person[], Person[]]>(
	'CREATE person SET name = "John"; SELECT * FROM type::table($tb);',
	{ tb: 'person' }
);

// Get the first result from the first query
const created = result[0].result[0];

// Get all of the results from the second query
const people = result[1].result;
```

### `.query_raw()`

With `.query_raw()`, you will get back the raw RPC response. This contrast to the `.query()` method, this will not throw for errors that occur in individual queries, but will rather give those back as a string, and this will include the time it took to execute the individual queries.