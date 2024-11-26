---
sidebar_position: 4
sidebar_label: Properties
title: JavaScript | SDKs | Properties
description: The SurrealDB SDK for JavaScript enables simple and advanced querying of a remote or embedded database.
---

# SDK methods

The SurrealDB SDK for JavaScript has a single SurrealDB class that provides methods for querying a remote SurrealDB database.
The class is designed to be simple to use and easy to understand for developers who are new to JavaScript or SurrealDB.
This page lists out the methods that are available in the SurrealDB class.

## Available properties

<table>
	<thead>
		<tr>
			<th scope="col">Property</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="#ready"> <code> db.ready </code></a></td>
			<td scope="row" data-label="Description">A promise which can be awaited, resolves when the connection is established</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#status"> <code> db.status </code></a></td>
            <td scope="row" data-label="Description">Reports the current connection status</td>
        </tr>
		<tr>
			<td scope="row" data-label="Method"><a href="#emitter"> <code> db.emitter </code></a></td>
			<td scope="row" data-label="Description">Stores the event emitter used for communication within the SDK</td>
		</tr>
	</tbody>
</table>

## `db.ready` {#ready}

A promise which can be awaited, resolves when the connection is established. 

> [!NOTE]
> This property is available once you call the `.connect()` method.

```ts
const db = new Surreal();

// These two promises are the same
const promise1 = db.connect();
const promise2 = db.ready;
```



## `db.status` {#status}

Reports the current connection status. Can be any of the following in string format:
- `disconnected`
- `connecting`
- `connected`
- `error`

```ts
db.status; // "disconnected"

db.connect();
db.status; // "connecting"

await db.ready;
db.status; // "connected"

// Once an error in the connection occurs
db.status; // "error"
```



## `db.emitter` {#emitter}

Stores the event emitter used for communication within the SDK.
The following general events can occur:
- `disconnected` - No arguments passed
- `connecting` - No arguments passed
- `connected` - No arguments passed
- `error` - An `Error` instance will be passed

The following events are intended for internal use only:
- `rpc-${string | number}` - An `RcpResponse` or `EngineDisconnected` instance will be passed
- `live-${string}` - Returns either of the following arguments
  - A `LiveAction`, being `"CREATE" | "UPDATE" | "DELETE"`, and a `Result` - being an object or patch
  - Or `"CLOSE"`, and a reason being `"killed" | "disconnected"` 

```ts title="Subscribe to events continuesly"
function listener(error: Error) {
    console.error("An error occurred:", error);
}

// Listen for the event
db.emitter.subscribe("error", listener);
// Check if the listener is subscribed
db.emitter.isSubscribed("error", listener);
// Unsubscribe the listener
db.emitter.unSubscribe("error", listener);
```

```ts title="Subscribe to an event once"
const disconnectedPromise = db.emitter.subscribeOnce("disconnected");
const connectingPromise = db.emitter.subscribeOnce("connecting");
const connectedPromise = db.emitter.subscribeOnce("connected");
const errorPromise = db.emitter.subscribeOnce("error");
```