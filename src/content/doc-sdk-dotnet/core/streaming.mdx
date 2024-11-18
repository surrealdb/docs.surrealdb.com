---
sidebar_position: 5
sidebar_label: Realtime data streaming
title: Realtime data streaming | .NET | SDK | Concepts
description: The SurrealDB SDK for .NET allows you to create live queries that listen for changes in the database and automatically update your application when changes occur.
---

import Label from "@components/shared/Label.astro";

# Realtime data streaming

You can use the SurrealDB SDK to create live queries that listen for changes in the database and automatically update your application when changes occur.
This feature is useful for building real-time applications that need to respond to changes in the database.

<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="#listen-live"> <code> db.ListenLive(queryUuid) </code></a></td>
			<td scope="row" data-label="Description">Listen responses from an existing live query</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#live-query"> <code> db.LiveQuery(sql) </code></a></td>
            <td scope="row" data-label="Description">Initiate a live query from a SurrealQL statement</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#live-raw-query"> <code> db.LiveRawQuery(sql, params) </code></a></td>
			<td scope="row" data-label="Description">Initiate a live query from a SurrealQL statement, based on a raw SurrealQL query</td>
		</tr>
		<tr>
			<td scope="row" data-label="Method"><a href="#live-table"> <code> db.LiveTable(table, diff) </code></a></td>
			<td scope="row" data-label="Description">Initiate a live query from a table</td>
		</tr>
		<tr>
			<td scope="row" data-label="Method"><a href="#kill"> <code> db.Kill(queryUuid) </code></a></td>
			<td scope="row" data-label="Description">Kills a running live query by it's UUID</td>
		</tr>
	</tbody>
</table>

## `.ListenLive<T>()` {#listen-live}

Listen responses from an existing live query.

```csharp title="Method Syntax"
db.ListenLive<T>(queryUuid)
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
                <code>queryUuid</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The UUID of the live query to consume.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
await using var liveQuery = db.ListenLive<Person>(queryUuid);

// Consume the live query...
```

You can then consume the live query using either an `IAsyncEnumerable` or an `Observable`.

#### Using an `IAsyncEnumerable`

:::note 
___NOTE:___ This will block the current thread until the query is killed.
:::

```csharp title="Option 1: Consume the live query via an IAsyncEnumerable"
await foreach (var response in liveQuery)
{
    // Either an Open, Create, Update, Delete or Close notification...

    if (response is SurrealDbLiveQueryOpenResponse)
    {
        // Do something...
    }
    if (response is SurrealDbLiveQueryCreateResponse<Person> create)
    {
        // Use the `Result` record
    }
    if (response is SurrealDbLiveQueryUpdateResponse<Person> update)
    {
        // Use the `Result` record
    }
    if (response is SurrealDbLiveQueryDeleteResponse<Person> delete)
    {
        // Use the `Result` record
    }
    if (response is SurrealDbLiveQueryCloseResponse)
    {
        // Do something...
    }
}
```

#### Using an `Observable`

```csharp title="Option 2: Consume the live query via an Observable"
liveQuery
    .ToObservable()
    .Subscribe((response) => 
    {
        // Either an Open, Create, Update, Delete or Close notification...

        if (response is SurrealDbLiveQueryOpenResponse)
        {
            // Do something...
        }
        if (response is SurrealDbLiveQueryCreateResponse<Person> create)
        {
            // Use the `Result` record
        }
        if (response is SurrealDbLiveQueryUpdateResponse<Person> update)
        {
            // Use the `Result` record
        }
        if (response is SurrealDbLiveQueryDeleteResponse<Person> delete)
        {
            // Use the `Result` record
        }
        if (response is SurrealDbLiveQueryCloseResponse)
        {
            // Do something...
        }
    });
```

You can also use the `OfType` operator to filter the responses.

```csharp
liveQuery
    .ToObservable()
    .OfType<SurrealDbLiveQueryCreateResponse<Person>>()
    .Select(response => response.Result)
    .Subscribe((record) => 
    {
        // Use the created record
    });
```

Note that this pattern is already simplified via methods available on the `SurrealDbLiveQuery` object.
You can learn more about these methods in the [LiveQuery methods](#surrealdblivequery-methods) section.

<br />

## `.LiveQuery<T>()` {#live-query}

Initiate a live query from a SurrealQL statement.

```csharp title="Method Syntax"
await db.LiveQuery<T>(sql)
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
const string table = "person"; 
await using var liveQuery = await db.LiveQuery<Person>($"LIVE SELECT * FROM type::table({table});");

// Consume the live query...
```

### `SurrealDbLiveQuery` methods

The `SurrealDbLiveQuery` object provides the following methods:

#### `GetResults()` {#get-results}

Returns an enumerator that iterates asynchronously through the collection of results
(all actions `CREATE`, `UPDATE` and `DELETE`, except `OPEN` and `CLOSE`).

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
await using var liveQuery = await db.LiveRawQuery<Person>("LIVE SELECT * FROM person;");

// highlight-next-line
await foreach (var response in liveQuery.GetResults())
{
    // Either a Create, Update or Delete notification...

    if (response is SurrealDbLiveQueryCreateResponse<Person> create)
    {
        // Use the `Result` record
    }
    if (response is SurrealDbLiveQueryUpdateResponse<Person> update)
    {
        // Use the `Result` record
    }
    if (response is SurrealDbLiveQueryDeleteResponse<Person> delete)
    {
        // Use the `Result` record
    }
}
```

#### `GetCreatedRecords()` {#get-created-records}

Returns an enumerator that iterates asynchronously through the collection of created records.

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
await using var liveQuery = await db.LiveRawQuery<Person>("LIVE SELECT * FROM person;");

// highlight-next-line
await foreach (var record in liveQuery.GetCreatedRecords())
{
    // Use the created record
}
```

#### `GetUpdatedRecords()` {#get-updated-records}

Returns an enumerator that iterates asynchronously through the collection of updated records.

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
await using var liveQuery = await db.LiveRawQuery<Person>("LIVE SELECT * FROM person;");

// highlight-next-line
await foreach (var record in liveQuery.GetUpdatedRecords())
{
    // Use the updated record
}
```

#### `GetDeletedRecords()` {#get-deleted-records}

Returns an enumerator that iterates asynchronously through the collection of deleted records.

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
await using var liveQuery = await db.LiveRawQuery<Person>("LIVE SELECT * FROM person;");

// highlight-next-line
await foreach (var record in liveQuery.GetDeletedRecords())
{
    // Use the deleted record
}
```

#### `KillAsync()` {#kill-async}

Kills the underlying live query.

```csharp title="Method Syntax"
await liveQuery.KillAsync(cancellationToken)
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
var liveQuery = await db.LiveRawQuery<Person>("LIVE SELECT * FROM person;");

// Consume the live query...

// Manually kill the live query
// highlight-next-line
await liveQuery.KillAsync();
```

<br />

## `.LiveRawQuery<T>()` {#live-raw-query}

Initiate a live query from a SurrealQL statement, based on a raw SurrealQL query.

```csharp title="Method Syntax"
await db.LiveRawQuery<T>(sql, params)
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
await using var liveQuery = await db.LiveRawQuery<Person>("LIVE SELECT * FROM person;");

// Consume the live query...
```

<br />

## `.LiveTable<T>()` {#live-table}

Initiate a live query from a table.

```csharp title="Method Syntax"
await db.LiveTable<T>(table, diff)
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
                <code>table</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The table name to listen for changes for.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>diff</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                If set to true, live notifications will include an array of JSON Patch objects, rather than the entire record for each notification.
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
await using var liveQuery = await db.LiveTable<Person>("person");

// Consume the live query...
```

<br />

## `.Kill()` {#kill}

Kills a running live query by it's UUID.

```csharp title="Method Syntax"
await db.Kill(queryUuid)
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
                <code>queryUuid</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The UUID of the live query you wish to kill.
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
await db.Kill(queryUuid);
```

<br />

## Live Actions

A live query event can be one of the following:

<table>
    <thead>
        <tr>
            <th colspan="1" scope="col">Action</th>
            <th colspan="1" scope="col">Result</th>
            <th colspan="2" scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="1" scope="row" data-label="Action">
                `OPEN`
            </td>
            <td colspan="1" scope="row" data-label="Result">
                N/A
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Emitted when the live query is opened in the server.
            </td>
        </tr>
        <tr>
            <td colspan="1" scope="row" data-label="Action">
                `CLOSE`
            </td>
            <td colspan="1" scope="row" data-label="Result">
                `SocketClosed` or `QueryKilled`
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Emitted when the live query is closed due to it either being killed or the connection being disconnected.
            </td>
        </tr>
        <tr>
            <td colspan="1" scope="row" data-label="Action">
                `CREATE`
            </td>
            <td colspan="1" scope="row" data-label="Result">
                `Result`
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Emitted when a record within your subscription gets created
            </td>
        </tr>
        <tr>
            <td colspan="1" scope="row" data-label="Action">
                `UPDATE`
            </td>
            <td colspan="1" scope="row" data-label="Result">
                `Result`
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Emitted when a record within your subscription gets updated
            </td>
        </tr>
        <tr>
            <td colspan="1" scope="row" data-label="Action">
                `CREATE`
            </td>
            <td colspan="1" scope="row" data-label="Result">
                `Result`
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Emitted when a record within your subscription gets deleted
            </td>
        </tr>
    </tbody>
</table>