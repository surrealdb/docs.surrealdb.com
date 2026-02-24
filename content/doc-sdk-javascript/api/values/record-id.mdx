---
sidebar_position: 2
sidebar_label: RecordId
title: JavaScript | SDK | API Reference | RecordId
description: Type-safe record identifiers with table name and ID components.
---

import Label from "@components/shared/Label.astro";

# `RecordId<Tb, Id>` {#recordid}

The `RecordId` class provides type-safe record identifiers in SurrealDB. Each record ID consists of a table name and an ID value, represented as `table:id` in SurrealQL.

**Import:**
```ts
import { RecordId } from 'surrealdb';
```

**Source:** [value/record-id.ts](https://github.com/surrealdb/surrealdb.js/blob/main/packages/sdk/src/value/record-id.ts)

## Type Parameters

- `Tb extends string` - The table name (string literal type for type safety)
- `Id` - The ID value type (string, number, object, etc.)

## Constructor

### `new RecordId(table, id, validate?)` {#constructor}

Create a new record identifier.

```ts title="Syntax"
new RecordId(table, id, validate?)
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
            <td><code>table</code> <Label label="required" /></td>
            <td><code>Tb</code></td>
            <td>The table name.</td>
        </tr>
        <tr>
            <td><code>id</code> <Label label="required" /></td>
            <td><code>Id</code></td>
            <td>The record ID value (string, number, object, array, or RecordId).</td>
        </tr>
        <tr>
            <td><code>validate</code> <Label label="optional" /></td>
            <td><code>boolean</code></td>
            <td>Whether to validate the table name format (default: <code>true</code>).</td>
        </tr>
    </tbody>
</table>

#### Examples

```ts
// String IDs
const user = new RecordId('users', 'john');
const post = new RecordId('posts', '123');

// Numeric IDs
const product = new RecordId('products', 42);

// Complex/structured IDs
const metric = new RecordId('metrics', { 
    service: 'api', 
    timestamp: 1234567890 
});

// Array IDs
const compound = new RecordId('items', ['type-a', 123]);

// Nested RecordId
const nested = new RecordId('links', new RecordId('users', 'alice'));

// Type-safe with generics
const typedUser = new RecordId<'users', string>('users', 'john');
```

## Properties

### `tb` {#tb}

The table name component.

**Type:** `Tb`

```ts
const userId = new RecordId('users', 'john');
console.log(userId.tb); // 'users'
```

---

### `id` {#id}

The ID value component.

**Type:** `Id`

```ts
const userId = new RecordId('users', 'john');
console.log(userId.id); // 'john'

const productId = new RecordId('products', 42);
console.log(productId.id); // 42
```

## Static Methods

### `RecordId.parse(string)` {#parse}

Parse a record ID from its string representation.

```ts title="Syntax"
RecordId.parse(str)
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
            <td><code>str</code> <Label label="required" /></td>
            <td><code>string</code></td>
            <td>The record ID string (format: <code>table:id</code>).</td>
        </tr>
    </tbody>
</table>

#### Returns
`RecordId` - The parsed record ID

#### Examples

```ts
// Parse simple IDs
const user = RecordId.parse('users:john');
const post = RecordId.parse('posts:123');

// Parse complex IDs
const metric = RecordId.parse('metrics:{ service: "api", time: 1234567890 }');

// Use in queries
const userId = RecordId.parse('users:alice');
const user = await db.select(userId);
```

---

### `RecordId.from(value)` {#from}

Create a record ID from various value types.

```ts title="Syntax"
RecordId.from(value)
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
            <td><code>value</code> <Label label="required" /></td>
            <td><code>unknown</code></td>
            <td>Value to convert to RecordId.</td>
        </tr>
    </tbody>
</table>

#### Returns
`RecordId | undefined` - The record ID or undefined if conversion fails

```ts
const rid = RecordId.from('users:john');
const same = RecordId.from(new RecordId('users', 'john'));
```

## Instance Methods

### `.toString()` {#tostring}

Convert the record ID to its string representation.

```ts title="Syntax"
recordId.toString()
```

#### Returns
`string` - String representation in format `table:id`

#### Examples

```ts
const userId = new RecordId('users', 'john');
console.log(userId.toString()); // 'users:john'

const productId = new RecordId('products', 42);
console.log(productId.toString()); // 'products:42'

const complex = new RecordId('items', { type: 'widget', id: 5 });
console.log(complex.toString()); // 'items:{ type: "widget", id: 5 }'
```

---

### `.toJSON()` {#tojson}

Serialize the record ID for JSON.

```ts title="Syntax"
recordId.toJSON()
```

#### Returns
`string` - JSON-safe string representation

```ts
const userId = new RecordId('users', 'john');
console.log(JSON.stringify(userId)); // '"users:john"'
```

---

### `.equals(other)` {#equals}

Check if two record IDs are equal.

```ts title="Syntax"
recordId.equals(other)
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
            <td><code>other</code> <Label label="required" /></td>
            <td><code>unknown</code></td>
            <td>Value to compare.</td>
        </tr>
    </tbody>
</table>

#### Returns
`boolean` - True if equal

```ts
const a = new RecordId('users', 'john');
const b = new RecordId('users', 'john');
const c = new RecordId('users', 'jane');

console.log(a.equals(b)); // true
console.log(a.equals(c)); // false
```

## Complete Examples

### Basic Usage

```ts
import { Surreal, RecordId } from 'surrealdb';

const db = new Surreal();
await db.connect('ws://localhost:8000');

// Create record with specific ID
const user = await db.create(new RecordId('users', 'john'))
    .content({
        name: 'John Doe',
        email: 'john@example.com'
    });

// Select by record ID
const retrieved = await db.select(new RecordId('users', 'john'));

// Update by record ID
await db.update(new RecordId('users', 'john'))
    .merge({ status: 'active' });

// Delete by record ID
await db.delete(new RecordId('users', 'john'));
```

### Type-Safe Record IDs

```ts
interface User {
    id: RecordId<'users', string>;
    name: string;
    email: string;
}

// TypeScript enforces correct table name
const userId: RecordId<'users', string> = new RecordId('users', 'alice');

// This would be a type error:
// const wrong: RecordId<'posts', string> = new RecordId('users', 'alice');

const user = await db.select<User>(userId);
```

### Complex ID Structures

```ts
// Time-series data with structured IDs
const metricId = new RecordId('metrics', {
    service: 'api',
    host: 'server-01',
    timestamp: 1234567890
});

await db.create(metricId).content({
    cpu: 45.2,
    memory: 78.1
});

// Compound keys
const sessionId = new RecordId('sessions', {
    userId: 'john',
    deviceId: 'device-123'
});
```

### Parsing from Strings

```ts
// Parse user input
const userInput = 'users:john';
const userId = RecordId.parse(userInput);
const user = await db.select(userId);

// Parse from query results
const result = await db.query('SELECT id FROM users:john').collect();
const recordId = RecordId.parse(result[0].id);
```

### Working with Relations

```ts
// Create relationship using record IDs
const from = new RecordId('users', 'john');
const to = new RecordId('posts', '123');

const edge = await db.relate(
    from,
    new Table('likes'),
    to,
    { timestamp: DateTime.now() }
);

console.log('Edge from:', edge.in);  // RecordId('users', 'john')
console.log('Edge to:', edge.out);   // RecordId('posts', '123')
```

### UUID-based Record IDs

```ts
import { Uuid } from 'surrealdb';

// Generate time-ordered IDs
const userId = new RecordId('users', Uuid.v7());

// Generate random IDs
const sessionId = new RecordId('sessions', Uuid.v4());

await db.create(userId).content({
    name: 'Alice',
    created: DateTime.now()
});
```

### Validation

```ts
// Validate table names (enabled by default)
try {
    const invalid = new RecordId('invalid-table!', 'id');
} catch (error) {
    console.error('Invalid table name');
}

// Skip validation
const unvalidated = new RecordId('any-name', 'id', false);
```

## RecordIdRange {#recordidrange}

The `RecordIdRange` class represents a range of record IDs for querying multiple records.

### Constructor

```ts
new RecordIdRange(table, begin, end)
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
            <td><code>table</code> <Label label="required" /></td>
            <td><code>string</code></td>
            <td>The table name.</td>
        </tr>
        <tr>
            <td><code>begin</code> <Label label="required" /></td>
            <td><code>string | number | RecordId</code></td>
            <td>Start of the range (inclusive).</td>
        </tr>
        <tr>
            <td><code>end</code> <Label label="required" /></td>
            <td><code>string | number | RecordId</code></td>
            <td>End of the range (exclusive).</td>
        </tr>
    </tbody>
</table>

### Examples

```ts
import { RecordIdRange } from 'surrealdb';

// Select range of users from 'a' to 'f'
const range = new RecordIdRange('users', 'a', 'f');
const users = await db.select(range);

// Numeric range
const numRange = new RecordIdRange('items', 1, 100);
const items = await db.select(numRange);

// Update range
await db.update(new RecordIdRange('users', 'a', 'f'))
    .merge({ verified: true });

// Delete range
await db.delete(new RecordIdRange('logs', '2024-01-01', '2024-02-01'));
```

## Best Practices

### 1. Use Type Parameters

```ts
// Good: Type-safe
type UserId = RecordId<'users', string>;
const userId: UserId = new RecordId('users', 'john');

// Better: Enforce at compile time
function getUser(id: RecordId<'users', string>) {
    return db.select(id);
}
```

### 2. Prefer RecordId Over Strings

```ts
// Good: Type-safe with validation
const user = await db.select(new RecordId('users', 'john'));

// Avoid: String-based (no validation)
const user = await db.query('SELECT * FROM users:john').collect();
```

### 3. Use Structured IDs for Complex Keys

```ts
// Good: Structured composite key
const id = new RecordId('events', {
    userId: 'john',
    timestamp: Date.now()
});

// Avoid: String concatenation
const id = new RecordId('events', `john-${Date.now()}`);
```

### 4. Handle Parsing Errors

```ts
// Good: Safe parsing
try {
    const id = RecordId.parse(userInput);
    const record = await db.select(id);
} catch (error) {
    console.error('Invalid record ID format');
}
```

## See Also

- [Data Types Overview](/docs/2.x/sdk/javascript/api/values/) - All custom data types
- [Table](/docs/2.x/sdk/javascript/api/values/table) - Table references
- [Query Builders](/docs/2.x/sdk/javascript/api/queries/) - Using RecordId in queries
- [SurrealQL Record IDs](/docs/surrealql/datamodel/ids) - Database record ID documentation
