---
sidebar_position: 3
sidebar_label: surql
title: JavaScript | SDK | API Reference | surql
description: Tagged template for composing parameterized SurrealQL queries.
---

import Label from "@components/shared/Label.astro";

# `surql` {#surql}

The `surql` tagged template function creates parameterized SurrealQL queries with automatic value binding and SQL injection prevention.

**Import:**
```ts
import { surql } from 'surrealdb';
```

**Source:** [utils/tagged-template.ts](https://github.com/surrealdb/surrealdb.js/blob/main/packages/sdk/src/utils/tagged-template.ts)

## Function Signature

```ts
function surql(
    strings: TemplateStringsArray, 
    ...values: unknown[]
): BoundQuery
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
            <td><code>strings</code> <Label label="required" /></td>
            <td><code>TemplateStringsArray</code></td>
            <td>Template string segments.</td>
        </tr>
        <tr>
            <td><code>values</code> <Label label="required" /></td>
            <td><code>unknown[]</code></td>
            <td>Interpolated values (automatically bound as parameters).</td>
        </tr>
    </tbody>
</table>

#### Returns
`BoundQuery` - Parameterized query with automatic bindings

## How It Works

The `surql` template automatically:
1. Extracts interpolated values
2. Generates unique parameter names
3. Replaces values with parameter references
4. Returns a `BoundQuery` with query string and bindings

```ts
const age = 18;
const query = surql`SELECT * FROM users WHERE age > ${age}`;

// Internally becomes:
// query.query = "SELECT * FROM users WHERE age > $bind__1"
// query.bindings = { bind__1: 18 }
```

## Basic Examples

### Simple Parameterized Query

```ts
import { surql } from 'surrealdb';

const minAge = 18;
const query = surql`SELECT * FROM users WHERE age >= ${minAge}`;

const [users] = await db.query(query).collect();
```

### Multiple Parameters

```ts
const status = 'active';
const minAge = 18;
const tier = 'premium';

const query = surql`
    SELECT * FROM users 
    WHERE status = ${status}
    AND age >= ${minAge}
    AND tier = ${tier}
`;

const [users] = await db.query(query).collect();
```

### With Value Types

```ts
import { RecordId, DateTime, Duration } from 'surrealdb';

const userId = new RecordId('users', 'john');
const cutoffDate = DateTime.now().minus(Duration.parse('30d'));

const query = surql`
    SELECT * FROM posts 
    WHERE author = ${userId}
    AND created_at >= ${cutoffDate}
    ORDER BY created_at DESC
`;

const [posts] = await db.query(query).collect();
```

## Advanced Examples

### Dynamic Query Building

```ts
function buildUserQuery(filters: {
    status?: string;
    minAge?: number;
    tier?: string;
}) {
    let query = surql`SELECT * FROM users WHERE 1=1`;
    
    if (filters.status) {
        query.append(surql` AND status = ${filters.status}`);
    }
    if (filters.minAge !== undefined) {
        query.append(surql` AND age >= ${filters.minAge}`);
    }
    if (filters.tier) {
        query.append(surql` AND tier = ${filters.tier}`);
    }
    
    return query;
}

const query = buildUserQuery({ status: 'active', minAge: 18 });
const [users] = await db.query(query).collect();
```

### Multi-Statement Queries

```ts
const userId = new RecordId('users', 'john');
const postId = new RecordId('posts', '123');

const query = surql`
    BEGIN TRANSACTION;
    
    UPDATE ${userId} SET post_count += 1;
    
    CREATE ${postId} SET
        author = ${userId},
        title = ${'My Post'},
        content = ${'Post content here'},
        created_at = time::now();
    
    COMMIT TRANSACTION;
`;

await db.query(query).collect();
```

### Combining with Expressions

```ts
import { expr, eq, gte } from 'surrealdb';

const condition = expr(and(
    eq('verified', true),
    gte('age', 18)
));

const tier = 'premium';
const query = surql`
    SELECT * FROM users 
    WHERE ${condition}
    AND tier = ${tier}
`;

const [users] = await db.query(query).collect();
```

### Inserting Arrays

```ts
const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' }
];

const query = surql`INSERT INTO users ${users}`;
await db.query(query).collect();
```

### Graph Traversal

```ts
const userId = new RecordId('users', 'john');

const query = surql`
    SELECT 
        *,
        ->follows->users.* AS following,
        <-follows<-users.* AS followers
    FROM ${userId}
`;

const [result] = await db.query(query).collect();
console.log('Following:', result.following);
console.log('Followers:', result.followers);
```

### Conditional Updates

```ts
const status = 'inactive';
const threshold = DateTime.now().minus(Duration.parse('90d'));

const query = surql`
    UPDATE users 
    SET status = ${status}
    WHERE active = false 
    AND last_login < ${threshold}
`;

const [updated] = await db.query(query).collect();
console.log(`Updated ${updated.length} users`);
```

### Variable Definition

```ts
const minScore = 80;
const category = 'tech';

const query = surql`
    LET $high_scorers = SELECT * FROM users WHERE score >= ${minScore};
    LET $tech_users = SELECT * FROM users WHERE category = ${category};
    
    RETURN {
        high_scorers: $high_scorers,
        tech_users: $tech_users,
        intersection: SELECT * FROM $high_scorers WHERE category = ${category}
    };
`;

const [result] = await db.query(query).collect();
```

### Batch Operations

```ts
const recordIds = [
    new RecordId('users', 'alice'),
    new RecordId('users', 'bob'),
    new RecordId('users', 'carol')
];

const query = surql`
    SELECT * FROM [${recordIds[0]}, ${recordIds[1]}, ${recordIds[2]}]
`;

const [users] = await db.query(query).collect();
```

## SQL Injection Prevention

The `surql` template prevents SQL injection by automatically parameterizing all values:

```ts
// User input
const userInput = "'; DROP TABLE users; --";

// Safe: Treated as a parameter value
const query = surql`SELECT * FROM users WHERE name = ${userInput}`;
// Becomes: SELECT * FROM users WHERE name = $bind__1
// With binding: { bind__1: "'; DROP TABLE users; --" }

// The malicious SQL is safely treated as a string value
```

## Best Practices

### 1. Always Use surql for User Input

```ts
// Good: Safe parameterization
const userName = getUserInput();
const query = surql`SELECT * FROM users WHERE name = ${userName}`;

// Dangerous: SQL injection risk
const query = `SELECT * FROM users WHERE name = '${userName}'`;
```

### 2. Use for Complex Queries

```ts
// Good: Clear and safe
const query = surql`
    SELECT *,
        ->purchased->products.* AS purchases,
        <-manages<-departments.* AS departments
    FROM ${userId}
    WHERE active = ${true}
`;

// Harder to read and maintain
const query = new BoundQuery(
    'SELECT *, ->purchased->products.* AS purchases FROM $userId WHERE active = $active',
    { userId, active: true }
);
```

### 3. Leverage Type System

```ts
// Good: Type-safe values
const recordId = new RecordId('users', 'john');
const datetime = DateTime.now();

const query = surql`
    UPDATE ${recordId}
    SET last_login = ${datetime}
`;

// Values maintain their types through the query
```

### 4. Build Queries Incrementally

```ts
// Good: Append for dynamic queries
let query = surql`SELECT * FROM products WHERE 1=1`;

if (minPrice) {
    query.append(surql` AND price >= ${minPrice}`);
}
if (category) {
    query.append(surql` AND category = ${category}`);
}

query.append(surql` ORDER BY created_at DESC LIMIT ${limit}`);
```

## Common Pitfalls

### 1. Identifier Interpolation

```ts
// Problem: Table names can't be parameterized
const tableName = 'users';
const wrong = surql`SELECT * FROM ${tableName}`; // Creates $bind__1

// Solution: Use Table class
const table = new Table('users');
const correct = surql`SELECT * FROM ${table}`;
```

### 2. Field Names

```ts
// Problem: Field names as parameters
const fieldName = 'age';
const wrong = surql`SELECT * FROM users WHERE ${fieldName} > 18`;

// Solution: Use raw SQL for field names (with validation)
import { escapeIdent } from 'surrealdb';
const validated = escapeIdent(fieldName);
const correct = surql`SELECT * FROM users WHERE ${raw(validated)} > 18`;
```

## See Also

- [BoundQuery](/docs/2.x/sdk/javascript/api/utilities/bound-query) - Parameterized query class
- [expr](/docs/2.x/sdk/javascript/api/utilities/expr) - Expression builder
- [Query](/docs/2.x/sdk/javascript/api/queries/query) - Executing queries
- [SurrealQueryable.query()](/docs/2.x/sdk/javascript/api/core/surreal-queryable#query) - Query method
