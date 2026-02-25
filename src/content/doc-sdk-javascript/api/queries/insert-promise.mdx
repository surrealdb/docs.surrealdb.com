---
sidebar_position: 5
sidebar_label: InsertPromise
title: JavaScript | SDK | API Reference | InsertPromise
description: InsertPromise provides chainable methods for configuring INSERT operations.
---

import Label from "@components/shared/Label.astro";

# `InsertPromise<T, J>` {#insertpromise}

The `InsertPromise` class provides a chainable interface for configuring INSERT operations for bulk record insertion. It extends `Promise`, allowing you to `await` it directly or chain configuration methods.

**Returned by:** [`SurrealQueryable.insert()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#insert)

**Source:** [query/insert.ts](https://github.com/surrealdb/surrealdb.js/blob/main/packages/sdk/src/query/insert.ts)

## Type Parameters

- `T` - The result type
- `J` - Boolean indicating if result is JSON (default: `false`)

## Configuration Methods

### `.relation()` {#relation}

Configure the insert to work with relation (edge) records instead of regular records.

```ts title="Method Syntax"
insertPromise.relation()
```

#### Returns
`InsertPromise<T, J>` - Chainable promise

#### Example

```ts
const edges = await db.insert([
    {
        id: new RecordId('likes', '1'),
        in: new RecordId('users', 'john'),
        out: new RecordId('posts', '1')
    }
]).relation();
```

---

### `.ignore()` {#ignore}

Ignore records that already exist (skip duplicates without error).

```ts title="Method Syntax"
insertPromise.ignore()
```

#### Returns
`InsertPromise<T, J>` - Chainable promise

#### Example

```ts
const users = await db.insert([
    { id: new RecordId('users', 'john'), name: 'John' },
    { id: new RecordId('users', 'jane'), name: 'Jane' }
]).ignore();
// If 'john' exists, it's skipped; 'jane' is inserted
```

---

### `.output()` {#output}

Specify which fields to return in the response.

```ts title="Method Syntax"
insertPromise.output(fields)
```

#### Parameters
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>fields</code> <Label label="required" /></td>
            <td><code>Output</code></td>
            <td><code>"NONE"</code>, <code>"AFTER"</code>, or specific field list.</td>
        </tr>
    </tbody>
</table>

#### Returns
`InsertPromise<T, J>` - Chainable promise

#### Examples

```ts title="Return Specific Fields"
const users = await db.insert(userData)
    .output('id', 'name');
// Returns only id and name
```

```ts title="Return Nothing"
await db.insert(logData)
    .output('NONE');
// No return value, useful for performance
```

---

### `.timeout()` {#timeout}

Set a timeout for the operation.

```ts title="Method Syntax"
insertPromise.timeout(duration)
```

#### Parameters
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>duration</code> <Label label="required" /></td>
            <td><code><a href="/docs/2.x/sdk/javascript/api/values/duration">Duration</a></code></td>
            <td>Maximum time to wait.</td>
        </tr>
    </tbody>
</table>

#### Returns
`InsertPromise<T, J>` - Chainable promise

---

### `.version()` {#version}

Insert at a specific version (for versioned storage engines).

```ts title="Method Syntax"
insertPromise.version(timestamp)
```

#### Parameters
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>timestamp</code> <Label label="required" /></td>
            <td><code><a href="/docs/2.x/sdk/javascript/api/values/datetime">DateTime</a></code></td>
            <td>The version timestamp.</td>
        </tr>
    </tbody>
</table>

#### Returns
`InsertPromise<T, J>` - Chainable promise

---

### `.json()` {#json}

Return result as JSON string.

```ts title="Method Syntax"
insertPromise.json()
```

#### Returns
`InsertPromise<T, true>` - Promise returning JSON string

---

### `.stream()` {#stream}

Stream results as records are inserted.

```ts title="Method Syntax"
insertPromise.stream()
```

#### Returns
`AsyncIterableIterator` - Async iterator

## Complete Examples

### Basic Insertion

```ts
import { Surreal, RecordId } from 'surrealdb';

const db = new Surreal();
await db.connect('ws://localhost:8000');

// Insert single record
const user = await db.insert({
    id: new RecordId('users', 'alice'),
    name: 'Alice',
    email: 'alice@example.com'
});

// Insert multiple records
const users = await db.insert([
    { id: new RecordId('users', 'bob'), name: 'Bob' },
    { id: new RecordId('users', 'carol'), name: 'Carol' }
]);
```

### Insert into Table

```ts
// Let database generate IDs
const users = await db.insert(new Table('users'), [
    { name: 'Dave', email: 'dave@example.com' },
    { name: 'Eve', email: 'eve@example.com' }
]);
```

### Ignore Duplicates

```ts
// Skip existing records without error
const users = await db.insert([
    { id: new RecordId('users', 'john'), name: 'John' },
    { id: new RecordId('users', 'jane'), name: 'Jane' }
]).ignore();

console.log(`Inserted ${users.length} new users`);
```

### Bulk Insert with Streaming

```ts
const largeDataset = generateThousandsOfRecords();

let count = 0;
for await (const record of db.insert(largeDataset).stream()) {
    count++;
    if (count % 100 === 0) {
        console.log(`Inserted ${count} records`);
    }
}
```

### Insert Relations (Edges)

```ts
const likes = await db.insert([
    {
        id: new RecordId('likes', '1'),
        in: new RecordId('users', 'john'),
        out: new RecordId('posts', '1'),
        created_at: DateTime.now()
    },
    {
        id: new RecordId('likes', '2'),
        in: new RecordId('users', 'jane'),
        out: new RecordId('posts', '1'),
        created_at: DateTime.now()
    }
]).relation();
```

### Optimized Insertion

```ts
// Don't wait for return values
await db.insert(logEntries)
    .output('NONE');
// Faster execution when you don't need the results
```

### Insert with Timeout

```ts
const users = await db.insert(largeDataset)
    .timeout(Duration.parse('30s'));
```

### Error Handling

```ts
try {
    const users = await db.insert([
        { id: new RecordId('users', 'existing'), name: 'Test' }
    ]);
} catch (error) {
    if (error instanceof ResponseError) {
        console.error('Duplicate key error:', error.message);
        
        // Retry with ignore
        const users = await db.insert([
            { id: new RecordId('users', 'existing'), name: 'Test' }
        ]).ignore();
    }
}
```

### Batch Processing

```ts
const BATCH_SIZE = 100;
const allUsers = [...]; // Large array

for (let i = 0; i < allUsers.length; i += BATCH_SIZE) {
    const batch = allUsers.slice(i, i + BATCH_SIZE);
    await db.insert(batch);
    console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
}
```

## vs CREATE

### When to use INSERT vs CREATE

```ts
// CREATE: For single records, with more configuration options
const user = await db.create(new RecordId('users', 'john'))
    .content(userData);

// INSERT: For bulk operations, optimized for performance
const users = await db.insert([
    { id: new RecordId('users', 'alice'), ...data1 },
    { id: new RecordId('users', 'bob'), ...data2 },
    { id: new RecordId('users', 'carol'), ...data3 }
]);
```

## Chaining Pattern

```ts
const result = await db.insert(records)
    .ignore()
    .output('id', 'name')
    .timeout(Duration.parse('10s'));
```

## See Also

- [SurrealQueryable.insert()](/docs/2.x/sdk/javascript/api/core/surreal-queryable#insert) - Method that returns InsertPromise
- [CreatePromise](/docs/2.x/sdk/javascript/api/queries/create-promise) - Single record creation
- [UpsertPromise](/docs/2.x/sdk/javascript/api/queries/upsert-promise) - Insert or update
- [Query Overview](/docs/2.x/sdk/javascript/api/queries/) - All query builder classes
