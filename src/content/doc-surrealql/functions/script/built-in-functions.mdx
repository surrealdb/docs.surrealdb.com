---
sidebar_position: 3
sidebar_label: Built-in functions
title: Built-in functions | Embedded scripting functions | SurrealQL
description: Besides basic JavaScript utilities and classes for SurrealQL types, there are a handful of utilities built into the embedded scripting functions.
---

import Label from "@components/shared/Label.astro";

# Built-in functions

Besides basic JavaScript utilities and [classes for SurrealQL types](/docs/surrealql/functions/script/type-conversion), there are a handful of utilities built into the embedded scripting functions.

<table>
  <thead>
    <tr>
      <th>Function</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="#fetch"><code>async fetch(resource, options)</code></a></td>
      <td>Full fledged fetch implementation closely matching the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">official specification</a>.</td>
    </tr>
    <tr>
      <td><a href="#query"><code>async query(surql)</code></a></td>
      <td>Run SurrealQL subqueries from within the embedded scripting functions.</td>
    </tr>
    <tr>
      <td><a href="#value"><code>async value(variable)</code></a></td>
      <td>Retrieve values for SurrealQL variables from within the embedded scripting functions.</td>
    </tr>
  </tbody>
</table>

## `async fetch(resource, options)` {#fetch}

Full fledged fetch implementation closely matching the [official specification](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

> [!NOTE]
> For complete documentation, please refer to the MDN documentation.

<table>
    <thead>
        <tr>
            <th colspan="2">Arguments</th>
            <th colspan="2">Description</th>
        </tr>
    </thead>  
    <tbody>
        <tr>
            <td colspan="2">
                <code>resource</code>
                <Label label="required" />
            </td>
            <td colspan="2">
                Accepts either a url in a string, or a URL or Request object.
            </td>
        </tr>
         <tr>
            <td colspan="2">
                <code>options</code>
            </td>
            <td colspan="2">
                Accepts various options related to the request. Refer to MDN docs for a full reference.
            </td>
        </tr>
    </tbody>
</table>

```surql
RETURN function() {
	// List all posts
	const posts = fetch('https://jsonplaceholder.typicode.com/posts');

	// Update post with ID 1
	const updated = fetch('https://jsonplaceholder.typicode.com/posts/1', {
		method: 'PUT',
		body: JSON.stringify({
			id: 1,
			title: 'foo',
			body: 'bar',
			userId: 1,
		}),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	});

	return { posts, updated };
}
```

<br />

## `async query(surql)` {#query}

Run SurrealQL subqueries from within the embedded scripting functions.

> [!NOTE]
> Only subqueries can be executed with the query() function. This means that only a single query can currently be executed, and that only CRUD operations are allowed.

<table>
    <thead>
        <tr>
            <th colspan="2">Arguments</th>
            <th colspan="2">Description</th>
        </tr>
    </thead>  
    <tbody>
        <tr>
            <td colspan="2">
                <code>surql</code>
                <Label label="required" />
            </td>
            <td colspan="2">
                Accepts a single SurrealQL query, which is limited to a CRUD operation.
            </td>
        </tr>
    </tbody>
</table>

```surql
CREATE user:john, user:mary;

RETURN function() {
	// Select all users
	const users = await surrealdb.query("SELECT * FROM user");

	// Prepared query
	const query = new surrealdb.Query("SELECT * FROM $id", {
		id: new Record('user', 'mary')
	});

	// Execute prepared query
	const mary = (await surrealdb.query(query))[0];

	// Assign variables later to prepared query
	query.bind('id', new Record('user', 'john'));

	// Execute prepared query
	const john = (await surrealdb.query(query))[0];

	return { john, mary };
}
```

<br />

## `async value(variable)` {#value}

Retrieve values for SurrealQL variables from within the embedded scripting functions.

<table>
    <thead>
        <tr>
            <th colspan="2">Arguments</th>
            <th colspan="2">Description</th>
        </tr>
    </thead>  
    <tbody>
        <tr>
            <td colspan="2">
                <code>variable</code>
                <Label label="required" />
            </td>
            <td colspan="2">
                Accepts the path to a variable
            </td>
        </tr>
    </tbody>
</table>

```surql
LET $something = 123;
LET $obj = {
	nested: 456
};

LET $arr = [
	{ value: 1 },
	{ value: 2 },
	{ value: 3 },
	{ value: 4 },
	{ value: 5 },
	{ value: 6 },
];

RETURN function() {
	// Get the value for a variable
	const something = await surrealdb.value("$something");

	// Get the value for a nested property
	const nested = await surrealdb.value("$obj.nested");

	// Filter properties from an array
	const fromArray = await surrealdb.value("$arr[WHERE value > 3].value");

	return { something, nested, fromArray };
}
```

<br /><br />