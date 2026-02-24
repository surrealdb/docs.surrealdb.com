---
sidebar_position: 6
sidebar_label: Run SurrealQL queries
title: Run SurrealQL queries | .NET | SDK | Concepts
description: SurrealDB supports a number of methods for interacting with the database and performing CRUD operations.
---
import Label from "@components/shared/Label.astro";

# Run SurrealQL queries

The methods below are used to interact with the database and perform CRUD operations. You can also use the `query` method to run [SurrealQL statements](/docs/surrealql/statements) against the database.

<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="#query"> <code> db.Query() </code></a></td>
			<td scope="row" data-label="Description">Runs a set of SurrealQL statements against the database</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#raw_query"> <code> db.RawQuery() </code></a></td>
            <td scope="row" data-label="Description">Runs a set of SurrealQL statements against the database, based on a raw SurrealQL query</td>
        </tr>
	</tbody>
</table>

## `.Query()` {#query}

Runs a set of SurrealQL statements against the database.

```csharp title="Method Syntax"
await db.Query(sql)
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
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>sql</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Specifies the SurrealQL statements.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
// Execute query with params
const string table = "person";
var result = await db.Query($"CREATE person; SELECT * FROM type::table({table});");

// Get the first result from the first query
var created = result.GetValue<Person>(0);

// Get all of the results from the second query
var people = result.GetValue<List<Person>>(1);
```

<br />

## `.RawQuery()` {#raw_query}

Runs a set of SurrealQL statements against the database, based on a raw SurrealQL query.

```csharp title="Method Syntax"
await db.RawQuery(sql, params)
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
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>sql</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Specifies the SurrealQL statements.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>params</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Assigns variables which can be used in the query.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
// Assign the variable on the connection
var @params = new Dictionary<string, object> { { "table", "person" } };
var result = await db.RawQuery("CREATE person; SELECT * FROM type::table($table);", @params);

// Get the first result from the first query
var created = result.GetValue<Person>(0);

// Get all of the results from the second query
var people = result.GetValue<List<Person>>(1);
```

<br />
