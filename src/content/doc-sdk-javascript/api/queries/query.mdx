---
sidebar_position: 9
sidebar_label: Query
title: JavaScript | SDK | API Reference | Query
description: Query class for executing raw SurrealQL with streaming and batch processing support.
---

import Label from "@components/shared/Label.astro";

# `Query<R, J>` {#query}

The `Query` class provides a configurable interface for executing raw SurrealQL statements with support for streaming, batch processing, and response handling. It extends `Promise`, allowing you to `await` it directly or use specialized methods.

**Returned by:** [`SurrealQueryable.query()`](/docs/2.x/sdk/javascript/api/core/surreal-queryable#query)

**Source:** [query/query.ts](https://github.com/surrealdb/surrealdb.js/blob/main/packages/sdk/src/query/query.ts)

## Type Parameters

- `R extends unknown[]` - Array of result types for each query statement
- `J extends boolean` - Boolean indicating if result is JSON (default: `false`)

## Methods

### `.collect()` {#collect}

Collect and return the results of all queries at once. If any query fails, the promise rejects.

You can optionally specify which query indexes to collect.

```ts title="Method Syntax"
query.collect<T>(...queryIndexes?)
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
            <td><code>queryIndexes</code> <Label label="optional" /></td>
            <td><code>number[]</code></td>
            <td>Specific query indexes to collect. If omitted, collects all.</td>
        </tr>
    </tbody>
</table>

#### Type Parameters
- `T extends unknown[]` - Override result types

#### Returns
`Promise<Collect<T, J>>` - Array of results

#### Examples

```ts title="Single Query"
const result = await db.query('SELECT * FROM users').collect();
console.log(result); // [{ success: true, result: [...] }]
```

```ts title="Multiple Queries with Types"
const [users, posts] = await db.query<[User[], Post[]]>(`
    SELECT * FROM users;
    SELECT * FROM posts;
`).collect();
```

```ts title="Collect Specific Queries"
const [users] = await db.query(`
    SELECT * FROM users;
    SELECT * FROM posts;
    SELECT * FROM comments;
`).collect<[User[]]>(0); // Only collect first query
```

```ts title="With Bindings"
const result = await db.query(
    'SELECT * FROM users WHERE age > $age',
    { age: 18 }
).collect();
```

---

### `.stream()` {#stream}

Stream response frames as they are received from the database.

Each iteration yields a value frame, error frame, or done frame.

```ts title="Method Syntax"
query.stream()
```

#### Returns
`AsyncIterableIterator<Frame<unknown, J>>` - Async iterator of frames

Each frame is one of three types, distinguished by the `type` property:

**Value Frame** (`type: 'value'`)
- `frame.value` - The result data
- `frame.query` - Query index

**Error Frame** (`type: 'error'`)
- `frame.error` - Error information
- `frame.query` - Query index

**Done Frame** (`type: 'done'`)
- `frame.query` - Query index that completed

#### Examples

```ts title="Stream Processing"
for await (const frame of db.query('SELECT * FROM users').stream()) {
    if (frame.type === 'value') {
        console.log('Received data:', frame.value);
    } else if (frame.type === 'error') {
        console.error('Query error:', frame.error);
    } else if (frame.type === 'done') {
        console.log('Query complete');
    }
}
```

```ts title="Process Large Results"
let count = 0;
for await (const frame of db.query('SELECT * FROM large_table').stream()) {
    if (frame.type === 'value') {
        await processRecord(frame.value);
        count++;
    }
}
console.log(`Processed ${count} records`);
```

---

### `.responses()` {#responses}

Get individual response objects for each query statement, including success/failure status.

```ts title="Method Syntax"
query.responses<T>()
```

#### Type Parameters
- `T extends unknown[]` - Override result types

#### Returns
`Promise<Responses<T, J>>` - Array of [`QueryResponse`](/docs/2.x/sdk/javascript/api/types/#queryresponse) objects

#### Examples

```ts title="Handle Individual Responses"
const responses = await db.query(`
    SELECT * FROM users;
    INVALID QUERY;
    SELECT * FROM posts;
`).responses();

for (const [index, response] of responses.entries()) {
    if (response.success) {
        console.log(`Query ${index} succeeded:`, response.result);
    } else {
        console.error(`Query ${index} failed:`, response.error.message);
    }
}
```

```ts title="Check Query Statistics"
const responses = await db.query('SELECT * FROM users').responses();

for (const response of responses) {
    if (response.success && response.stats) {
        console.log('Records scanned:', response.stats.recordsScanned);
        console.log('Duration:', response.stats.duration);
    }
}
```

---

### `.json()` {#json}

Configure the query to return results as JSON strings.

```ts title="Method Syntax"
query.json()
```

#### Returns
`Query<R, true>` - Query returning JSON strings

#### Example

```ts
const jsonResults = await db.query('SELECT * FROM users').json().collect();
console.log(typeof jsonResults[0]); // 'string'
```

## Complete Examples

### Basic Query Execution

```ts
import { Surreal } from 'surrealdb';

const db = new Surreal();
await db.connect('ws://localhost:8000');

// Simple query
const result = await db.query('SELECT * FROM users').collect();
console.log(result[0]); // Array of users

// With await (same as .collect())
const result = await db.query('SELECT * FROM users');
```

### Parameterized Queries

```ts
// Using bindings object
const result = await db.query(
    'SELECT * FROM users WHERE age > $age AND status = $status',
    { age: 18, status: 'active' }
).collect();

// Using surql template
import { surql } from 'surrealdb';

const minAge = 18;
const result = await db.query(
    surql`SELECT * FROM users WHERE age > ${minAge}`
).collect();
```

### Multiple Statements

```ts
const [users, posts, comments] = await db.query<[User[], Post[], Comment[]]>(`
    SELECT * FROM users;
    SELECT * FROM posts WHERE published = true;
    SELECT * FROM comments WHERE approved = true;
`).collect();

console.log('Users:', users);
console.log('Posts:', posts);
console.log('Comments:', comments);
```

### Streaming Large Results

```ts
const query = db.query('SELECT * FROM large_table');

for await (const frame of query.stream()) {
    if (frame.type === 'value') {
        // Process each chunk as it arrives
        await processChunk(frame.value);
    } else if (frame.type === 'error') {
        console.error('Error:', frame.error);
        break;
    }
}
```

### Error Handling with Responses

```ts
const responses = await db.query(`
    CREATE users:john SET name = 'John';
    CREATE users:john SET name = 'Duplicate';
    SELECT * FROM users:john;
`).responses();

for (const [i, response] of responses.entries()) {
    if (response.success) {
        console.log(`Query ${i} OK:`, response.result);
    } else {
        console.log(`Query ${i} failed:`, response.error.message);
    }
}
```

### Transaction Queries

```ts
const txn = await db.beginTransaction();

try {
    const [created, updated] = await txn.query<[User, User]>(`
        CREATE users:new SET name = 'New User';
        UPDATE users:john SET updated_at = time::now();
    `).collect();
    
    await txn.commit();
} catch (error) {
    await txn.cancel();
}
```

### Complex Query with Statistics

```ts
const responses = await db.query(`
    SELECT * FROM users WHERE age > 18;
    SELECT count() FROM users GROUP BY status;
`).responses();

for (const response of responses) {
    if (response.success && response.stats) {
        console.log('Execution time:', response.stats.duration);
        console.log('Records scanned:', response.stats.recordsScanned);
        console.log('Bytes received:', response.stats.bytesReceived);
    }
}
```

### Conditional Logic

```ts
const status = 'active';
const minAge = 18;

const result = await db.query(
    surql`
        LET $active_users = SELECT * FROM users WHERE status = ${status};
        LET $adult_users = SELECT * FROM users WHERE age >= ${minAge};
        RETURN {
            active: $active_users,
            adults: $adult_users,
            both: SELECT * FROM $active_users WHERE age >= ${minAge}
        };
    `
).collect();
```

### Data Migration

```ts
// Batch update with query
const migration = await db.query(`
    -- Add new field to all users
    UPDATE users SET new_field = 'default_value';
    
    -- Migrate data format
    UPDATE users SET profile = {
        bio: bio,
        avatar: avatar_url
    };
    
    -- Remove old fields
    UPDATE users UNSET bio, avatar_url;
`).collect();

console.log('Migration complete');
```

### Streaming with Progress

```ts
let totalRecords = 0;
let queriesCompleted = 0;

for await (const frame of db.query('SELECT * FROM users; SELECT * FROM posts;').stream()) {
    if (frame.type === 'value') {
        totalRecords += frame.value.length;
        console.log(`Received ${frame.value.length} records`);
    } else if (frame.type === 'done') {
        queriesCompleted++;
        console.log(`Query ${frame.query} completed`);
    }
}

console.log(`Total: ${totalRecords} records from ${queriesCompleted} queries`);
```

## Best Practices

### 1. Use Parameterization

```ts
// Good: Parameterized
const result = await db.query(
    'SELECT * FROM users WHERE name = $name',
    { name: userName }
).collect();

// Better: Use surql template
const result = await db.query(
    surql`SELECT * FROM users WHERE name = ${userName}`
).collect();

// Avoid: String concatenation (SQL injection risk)
const result = await db.query(
    `SELECT * FROM users WHERE name = '${userName}'`
).collect();
```

### 2. Handle Errors Appropriately

```ts
// Good: Check individual responses
const responses = await db.query(multiStatementQuery).responses();

for (const response of responses) {
    if (!response.success) {
        handleError(response.error);
    }
}

// Simple: Use collect with try-catch
try {
    const results = await db.query(query).collect();
} catch (error) {
    // First error stops execution
}
```

### 3. Use Streaming for Large Results

```ts
// Good: Stream large datasets
for await (const frame of db.query('SELECT * FROM large_table').stream()) {
    if (frame.type === 'value') {
        await processChunk(frame.value);
    }
}

// Avoid: Loading everything into memory
const [large] = await db.query('SELECT * FROM large_table').collect();
// May cause memory issues
```

### 4. Leverage Type Parameters

```ts
// Good: Type-safe results
const [users, posts] = await db.query<[User[], Post[]]>(`
    SELECT * FROM users;
    SELECT * FROM posts;
`).collect();

// Now TypeScript knows the types
users[0].name; // string
posts[0].title; // string
```

## See Also

- [SurrealQueryable.query()](/docs/2.x/sdk/javascript/api/core/surreal-queryable#query) - Method that returns Query
- [BoundQuery](/docs/2.x/sdk/javascript/api/utilities/#boundquery) - Parameterized queries
- [surql](/docs/2.x/sdk/javascript/api/utilities/#surql) - Template tag for queries
- [Query Overview](/docs/2.x/sdk/javascript/api/queries/) - All query builder classes
