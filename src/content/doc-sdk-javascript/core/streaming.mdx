---
sidebar_position: 4
sidebar_label: Real-Time data streaming
title: JavaScript | SDK | Real-Time data streaming
description: The SurrealDB SDK for JavaScript allows you to create live queries that listen for changes in the database and automatically update your application when changes occur.
---

import Label from "@components/shared/Label.astro";

# Real-Time data streaming

You can use the SurrealDB JavaScript SDK to create live queries that listen for changes in the database and automatically update your application when changes occur. This feature is useful for building real-time applications that need to respond to changes in the database.

<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="#live"> <code> db.live(table, callback, diff) </code></a></td>
			<td scope="row" data-label="Description">Initiates a live query</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#subscribeLive"> <code> db.subscribeLive(queryUuid, callback) </code></a></td>
            <td scope="row" data-label="Description">Registers a callback function for a running live query</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#kill"> <code> db.kill(queryUuid) </code></a></td>
			<td scope="row" data-label="Description">Kills a running live query by it's UUID</td>
		</tr>
	</tbody>
</table>

## `.live()` {#live}

Initiates a live query.

```ts title="Method Syntax"
async db.live<T>(table, callback, diff)
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
                <code>table</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name to listen for changes for
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>callback</code>
               <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                A callback function that processes live notifications. Consult the [Live Actions](#live-actions) for a list of all possible values being returned.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>diff</code>
               <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                If set to true, live notifications will include an array of JSON Patch objects, rather than the entire record for each notification.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```ts
// The uuid of the live query will be returned
const queryUuid = await db.live(
	"person",
	// The callback function takes two arguments: the 'action' and 'result' properties
	( action, result ) => {
		// action can be: 'CREATE', 'UPDATE', 'DELETE' or 'CLOSE'
	    if (action === 'CLOSE') return;

		// result contains either the entire record, or a set of JSON patches when diff mode is enabled
		processSomeLiveQueryUpdate(result);
	}
)
```

<br />

## `.subscribeLive()` {#subscribeLive}

Registers a callback function for a running live query.

```ts title="Method Syntax"
async db.subscribeLive<T>(queryUuid, callback)
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
                <code>queryUuid</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The UUID of a running live query
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>callback</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                A callback function that processes live notifications. Consult the [Live Actions](#live-actions) for a list of all possible values being returned.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```ts
await db.subscribeLive(
	queryUuid,
	// The callback function takes an object with the "action" and "result" properties
	( action, result ) => {
		// action can be: "CREATE", "UPDATE", "DELETE" or "CLOSE"
	    if (action === 'CLOSE') return;

		// result contains either the entire record, or a set of JSON patches when diff mode is enabled
		processSomeLiveQueryUpdate(result);
	}
)
```

<br />

## `.kill()` {#kill}

Kills a running live query by it's UUID

```ts title="Method Syntax"
async db.kill(queryUuid)
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
                <code>queryUuid</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The UUID of the live query you wish to kill
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```ts
await db.kill(queryUuid)
```

<br />

## Live Actions

For `CREATE`, `UPDATE` and `DELETE`, the type `Result` is the generic argument passed to [`.live()`](#live) or [`.subscribeLive()`](#subscribeLive). <br />
It extends either `Record<string, unknown>` or `Patch`.

It's generally recommended to handle the `CLOSE` action first, as that clears out the type for the result parameter.

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
                `CLOSE`
            </td>
            <td colspan="1" scope="row" data-label="Result">
                `killed` or `disconnected`
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
                `DELETE`
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
