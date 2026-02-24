---
sidebar_position: 1
sidebar_label: Query Builders
title: JavaScript | SDK | API Reference | Query Builders
description: Query builder classes provide chainable configuration methods for executing database operations.
---

# Query Builders

Query builder classes are promise-like objects returned by query methods on [`SurrealQueryable`](/docs/2.x/sdk/javascript/api/core/surreal-queryable). They provide chainable configuration methods before executing the query.

All query builders implement a promise-like interface, allowing you to `await` them directly or chain configuration methods before execution.

## Common Pattern

```ts
// Chain configuration before awaiting
const users = await db.select(new Table('users'))
    .where('age > 18')
    .limit(10)
    .start(0);

// Or await directly
const user = await db.select(new RecordId('users', 'john'));
```

## Query Builder Classes

### Core Query Execution

- [**Query**](/docs/2.x/sdk/javascript/api/queries/query) - Execute raw SurrealQL with streaming and batch processing support
  - Returned by: [`SurrealQueryable.query()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#query)
  - Key methods: `.collect()`, `.stream()`, `.responses()`, `.json()`

### Record Operations

- [**SelectPromise**](/docs/2.x/sdk/javascript/api/queries/select-promise) - Configure SELECT queries with filtering, pagination, and field selection
  - Returned by: [`SurrealQueryable.select()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#select)
  - Key methods: `.fields()`, `.value()`, `.where()`, `.fetch()`, `.start()`, `.limit()`

- [**CreatePromise**](/docs/2.x/sdk/javascript/api/queries/create-promise) - Configure CREATE operations for new records
  - Returned by: [`SurrealQueryable.create()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#create)
  - Key methods: `.content()`, `.patch()`, `.output()`

- [**InsertPromise**](/docs/2.x/sdk/javascript/api/queries/insert-promise) - Configure INSERT operations for bulk record insertion
  - Returned by: [`SurrealQueryable.insert()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#insert)
  - Key methods: `.relation()`, `.ignore()`, `.output()`

- [**UpdatePromise**](/docs/2.x/sdk/javascript/api/queries/update-promise) - Configure UPDATE operations with various update strategies
  - Returned by: [`SurrealQueryable.update()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#update)
  - Key methods: `.content()`, `.merge()`, `.replace()`, `.patch()`, `.where()`, `.output()`

- [**UpsertPromise**](/docs/2.x/sdk/javascript/api/queries/upsert-promise) - Configure UPSERT operations (insert or replace)
  - Returned by: [`SurrealQueryable.upsert()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#upsert)
  - Key methods: `.content()`, `.merge()`, `.patch()`, `.output()`

- [**DeletePromise**](/docs/2.x/sdk/javascript/api/queries/delete-promise) - Configure DELETE operations
  - Returned by: [`SurrealQueryable.delete()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#delete)
  - Key methods: `.output()`, `.timeout()`

### Graph Operations

- [**RelatePromise**](/docs/2.x/sdk/javascript/api/queries/relate-promise) - Configure RELATE operations for creating graph relationships
  - Returned by: [`SurrealQueryable.relate()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#relate)
  - Key methods: `.unique()`, `.output()`, `.timeout()`

### Real-time & Advanced

- [**LivePromise**](/docs/2.x/sdk/javascript/api/queries/live-promise) - Subscribe to live query updates for real-time data changes
  - Variants: `ManagedLivePromise`, `UnmanagedLivePromise`
  - Returned by: [`SurrealQueryable.live()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#live), [`SurrealQueryable.liveOf()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#liveof)
  - Key methods: `.diff()`, `.fields()`, `.where()`, `.fetch()`

- [**RunPromise**](/docs/2.x/sdk/javascript/api/queries/run-promise) - Execute SurrealDB functions and SurrealML models
  - Returned by: [`SurrealQueryable.run()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#run)
  - Key methods: `.json()`

- [**ApiPromise**](/docs/2.x/sdk/javascript/api/queries/api-promise) - Execute user-defined API endpoint calls
  - Returned by: Methods on [`SurrealApi`](/docs/2.x/sdk/javascript/api/core/surreal-api)
  - Key methods: `.value()`, `.header()`, `.json()`

## Common Configuration Options

Most query builders support these common configuration methods:

### `.json()` {#json}

Return results as JSON strings instead of parsed objects.

```ts
const jsonString = await db.select(new Table('users')).json();
```

### `.timeout(duration)` {#timeout}

Set a timeout for the query operation.

```ts
await db.select(new Table('users'))
    .timeout(new Duration('5s'));
```

### `.version(timestamp)` {#version}

Query records at a specific version/timestamp (time-travel queries).

```ts
await db.select(new Table('users'))
    .version(new DateTime('2024-01-01T00:00:00Z'));
```

## Type Parameters

Query builders use generic type parameters for type safety:

- `T` - The base type of the record
- `I` - The input type for operations
- `J` - The JSON string type when using `.json()`
- `R` - The result type (for Query class)

## See Also

- [SurrealQueryable](/docs/2.x/sdk/javascript/api/core/surreal-queryable) - Methods that return query builders
- [SelectPromise](/docs/2.x/sdk/javascript/api/queries/select-promise) - Detailed SELECT documentation
- [CreatePromise](/docs/2.x/sdk/javascript/api/queries/create-promise) - Detailed CREATE documentation
- [Expression Builders](/docs/2.x/sdk/javascript/api/utilities/#expr) - Building query conditions
