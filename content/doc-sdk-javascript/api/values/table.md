---
sidebar_position: 7
sidebar_label: Table
title: JavaScript | SDK | API Reference | Table
description: Type-safe table references for query operations.
---

import Label from "@components/shared/Label.astro";

# `Table<T>` {#table}

The `Table` class provides type-safe references to database tables, enabling TypeScript type checking for query results.

**Import:**
```ts
import { Table } from 'surrealdb';
```

**Source:** [value/table.ts](https://github.com/surrealdb/surrealdb.js/blob/main/packages/sdk/src/value/table.ts)

## Type Parameters

- `T` - The record type for this table (optional, defaults to `string`)

## Constructor

### `new Table<T>(name)` {#constructor}

Create a new table reference.

```ts title="Syntax"
new Table(name)
new Table<RecordType>(name)
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
            <td><code>name</code> <Label label="required" /></td>
            <td><code>string</code></td>
            <td>The table name.</td>
        </tr>
    </tbody>
</table>

#### Examples

```ts
// Basic table reference
const users = new Table('users');

// Type-safe table reference
interface User {
    id: RecordId;
    name: string;
    email: string;
}

const users = new Table<User>('users');

// TypeScript now knows the result type
const allUsers: User[] = await db.select(users);
```

## Properties

### `name` {#name}

The table name.

**Type:** `string`

```ts
const users = new Table('users');
console.log(users.name); // 'users'
```

## Instance Methods

### `.toString()` {#tostring}

Convert to string representation (escaped table name).

```ts title="Syntax"
table.toString()
```

#### Returns
`string` - Escaped table name

#### Example

```ts
const users = new Table('users');
console.log(users.toString()); // 'users'

// Handles special characters
const special = new Table('my-table');
console.log(special.toString()); // Properly escaped
```

---

### `.toJSON()` {#tojson}

Serialize for JSON.

```ts title="Syntax"
table.toJSON()
```

#### Returns
`string` - Table name

---

### `.equals(other)` {#equals}

Check if two table references are equal.

```ts title="Syntax"
table.equals(other)
```

#### Returns
`boolean` - True if equal

## Complete Examples

### Type-Safe Queries

```ts
import { Surreal, Table } from 'surrealdb';

// Define your data model
interface User {
    id: RecordId;
    name: string;
    email: string;
    age: number;
}

interface Post {
    id: RecordId;
    title: string;
    content: string;
    author: RecordId;
}

const db = new Surreal();
await db.connect('ws://localhost:8000');

// Create type-safe table references
const users = new Table<User>('users');
const posts = new Table<Post>('posts');

// TypeScript knows the return types
const allUsers: User[] = await db.select(users);
const allPosts: Post[] = await db.select(posts);

// Type checking in IDE
allUsers[0].name; // ✓ TypeScript knows this exists
allUsers[0].title; // ✗ TypeScript error: Property 'title' does not exist
```

### Select Operations

```ts
const users = new Table<User>('users');

// Select all records
const all = await db.select(users);

// Select with filtering
const active = await db.select(users)
    .where('active = true');

// Select with pagination
const page = await db.select(users)
    .limit(10)
    .start(0);
```

### Create Operations

```ts
const users = new Table<User>('users');

// Create single record with auto-generated ID
const user = await db.create(users).content({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
});

// Create multiple records
const newUsers = await db.insert(users, [
    { name: 'Alice', email: 'alice@example.com', age: 25 },
    { name: 'Bob', email: 'bob@example.com', age: 35 }
]);
```

### Update Operations

```ts
const users = new Table<User>('users');

// Update all records in table
const updated = await db.update(users)
    .merge({ verified: true })
    .where('email_confirmed = true');

// Update with content
await db.update(users)
    .content({
        name: 'New Name',
        email: 'new@example.com',
        age: 31
    })
    .where('id = users:john');
```

### Delete Operations

```ts
const users = new Table<User>('users');

// Delete all inactive users
const deleted = await db.delete(users)
    .where('inactive = true');

// Get deleted records
const deletedWithData = await db.delete(users)
    .output('BEFORE')
    .where('created_at < $date', { 
        date: DateTime.parse('2024-01-01') 
    });
```

### Multiple Tables

```ts
interface Product {
    id: RecordId;
    name: string;
    price: Decimal;
}

interface Order {
    id: RecordId;
    user: RecordId;
    products: RecordId[];
    total: Decimal;
}

const products = new Table<Product>('products');
const orders = new Table<Order>('orders');
const users = new Table<User>('users');

// Work with multiple tables
const [allProducts, allOrders, allUsers] = await Promise.all([
    db.select(products),
    db.select(orders),
    db.select(users)
]);
```

### Query Builder Pattern

```ts
const users = new Table<User>('users');

// Build complex queries
const query = db.select(users)
    .fields('name', 'email', 'age')
    .where('age >= $minAge', { minAge: 18 })
    .order('name ASC')
    .limit(100);

const results = await query;
```

### Live Queries

```ts
const users = new Table<User>('users');

// Subscribe to table changes
const subscription = await db.live(users);

for await (const update of subscription) {
    if (update.action === 'CREATE') {
        console.log('New user:', update.result);
    } else if (update.action === 'UPDATE') {
        console.log('User updated:', update.result);
    } else if (update.action === 'DELETE') {
        console.log('User deleted:', update.result);
    }
}

// Clean up
await subscription.kill();
```

### Transactions

```ts
const users = new Table<User>('users');
const orders = new Table<Order>('orders');

const txn = await db.beginTransaction();

try {
    // Create user
    const user = await txn.create(users).content({
        name: 'Jane Doe',
        email: 'jane@example.com'
    });
    
    // Create order
    await txn.create(orders).content({
        user: user.id,
        products: [],
        total: new Decimal('0')
    });
    
    await txn.commit();
} catch (error) {
    await txn.cancel();
}
```

### Generic Table Functions

```ts
// Create reusable functions
async function getAllFromTable<T>(
    db: Surreal,
    table: Table<T>
): Promise<T[]> {
    return db.select(table);
}

async function deleteAllFromTable<T>(
    db: Surreal,
    table: Table<T>
): Promise<T[]> {
    return db.delete(table);
}

// Use with any table
const users = await getAllFromTable(db, new Table<User>('users'));
const posts = await getAllFromTable(db, new Table<Post>('posts'));
```

### Table Schema Validation

```ts
// Define table with strict types
interface StrictUser {
    id: RecordId<'users', string>;
    name: string;
    email: string;
    age: number;
    created_at: DateTime;
    updated_at: DateTime;
}

const users = new Table<StrictUser>('users');

// TypeScript enforces the schema
const user = await db.create(users).content({
    name: 'Alice',
    email: 'alice@example.com',
    age: 25,
    created_at: DateTime.now(),
    updated_at: DateTime.now()
    // Missing fields or wrong types will cause TypeScript errors
});
```

### Repository Pattern

```ts
class UserRepository {
    private table = new Table<User>('users');
    
    constructor(private db: Surreal) {}
    
    async getAll(): Promise<User[]> {
        return this.db.select(this.table);
    }
    
    async getById(id: RecordId): Promise<User | undefined> {
        return this.db.select(id);
    }
    
    async create(data: Omit<User, 'id'>): Promise<User> {
        return this.db.create(this.table).content(data);
    }
    
    async update(id: RecordId, data: Partial<User>): Promise<User> {
        return this.db.update(id).merge(data);
    }
    
    async delete(id: RecordId): Promise<void> {
        await this.db.delete(id);
    }
    
    async findByEmail(email: string): Promise<User[]> {
        return this.db.select(this.table)
            .where('email = $email', { email });
    }
}

// Usage
const userRepo = new UserRepository(db);
const users = await userRepo.getAll();
const john = await userRepo.findByEmail('john@example.com');
```

## Best Practices

### 1. Use Type Parameters

```ts
// Good: Type-safe
const users = new Table<User>('users');
const results: User[] = await db.select(users);

// Avoid: No type safety
const users = new Table('users');
const results = await db.select(users); // any[]
```

### 2. Define Interfaces for Tables

```ts
// Good: Clear data structure
interface User {
    id: RecordId;
    name: string;
    email: string;
    created_at: DateTime;
}

const users = new Table<User>('users');

// Avoid: Using 'any' or no interface
const users = new Table('users');
```

### 3. Reuse Table References

```ts
// Good: Single source of truth
const USERS_TABLE = new Table<User>('users');

async function getUsers() {
    return db.select(USERS_TABLE);
}

async function createUser(data: Omit<User, 'id'>) {
    return db.create(USERS_TABLE).content(data);
}

// Avoid: Creating new references everywhere
async function getUsers() {
    return db.select(new Table('users'));
}
```

### 4. Use with RecordId for Type Safety

```ts
// Good: Strongly typed
interface User {
    id: RecordId<'users', string>;
    name: string;
}

const users = new Table<User>('users');

// TypeScript ensures correct table name
const userId: RecordId<'users', string> = new RecordId('users', 'john');
```

## Common Patterns

### Enum-based Tables

```ts
enum Tables {
    Users = 'users',
    Posts = 'posts',
    Comments = 'comments'
}

const users = new Table<User>(Tables.Users);
const posts = new Table<Post>(Tables.Posts);
```

### Table Factory

```ts
function createTable<T>(name: string): Table<T> {
    return new Table<T>(name);
}

const users = createTable<User>('users');
const posts = createTable<Post>('posts');
```

## See Also

- [RecordId](/docs/2.x/sdk/javascript/api/values/record-id) - Record identifiers
- [Data Types Overview](/docs/2.x/sdk/javascript/api/values/) - All custom data types
- [Query Builders](/docs/2.x/sdk/javascript/api/queries/) - Using Table in queries
- [SurrealQL Tables](/docs/surrealql/statements/define/table) - Database table definitions
